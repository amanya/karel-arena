import json
import os
import logging
import redis
import gevent
from flask import Flask, render_template, send_from_directory
from flask_sockets import Sockets
from karel import Karel
from pykarel.karel_compiler import KarelCompiler
from impact_map import ImpactMap

REDIS_URL = os.environ['REDIS_URL']
REDIS_CHAN = 'karel'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)



class KarelBackend(object):
    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)
        self.impact_map = ImpactMap(app.logger)

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)


chats = KarelBackend()
chats.start()

karels = {}
karels["karel-blue"] = Karel(app, redis, "karel-blue")
karels["karel-green"] = Karel(app, redis, "karel-green")
karels["karel-blue"].load_world(chats.impact_map.to_compiler())
karels["karel-green"].load_world(chats.impact_map.to_compiler())

@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/lib/<path:path>')
def send_lib(path):
    return send_from_directory('static/lib', path)


@app.route('/media/<path:path>')
def send_media(path):
    return send_from_directory('static/media', path)

@app.route('/map')
def send_map():
    app.logger.info(u'Map: {}'.format(chats.impact_map.to_compiler()))
    return str(chats.impact_map)

@sockets.route('/submit')
def inbox(ws):
    """Receives incoming chat messages, inserts them into Redis."""
    while not ws.closed:
        # Sleep to prevent *constant* context-switches.
        gevent.sleep(0.1)
        raw_message = ws.receive()

        if raw_message:
            message = json.loads(raw_message)

            app.logger.info(u'Message: {}'.format(repr(message["text"])))
            compiler = KarelCompiler(karels[message["handle"]])

            compiler.compile(str(message["text"]))
            while not compiler.execute_step():
                pass


@sockets.route('/receive')
def outbox(ws):
    """Sends outgoing chat messages, via `ChatBackend`."""
    chats.register(ws)

    while not ws.closed:
        # Context switch while `ChatBackend.start` is running in the background.
        gevent.sleep(0.1)
