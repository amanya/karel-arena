import gevent
from flask import current_app

from app import game
from app import redis
from . import setup

running = False


@setup.route('/setup-submit')
def inbox(ws):
    """Receives incoming chat messages, inserts them into Redis."""
    global running
    if not running:
        game.start()
        running = True
    while not ws.closed:
        # Sleep to prevent *constant* context-switches.
        gevent.sleep(0.1)
        raw_message = ws.receive()

        if raw_message:
            redis.publish(current_app.config['REDIS_CHAN'], raw_message)


@setup.route('/setup-receive')
def outbox(ws):
    """Sends outgoing chat messages, via `ChatBackend`."""
    game.register(ws)

    while not ws.closed:
        # Context switch while `ChatBackend.start` is running in the background.
        gevent.sleep(0.1)
