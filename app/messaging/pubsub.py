import json
from functools import partial

import gevent
from flask import current_app
from pykarel.karel_compiler import KarelCompiler

from app import game, karels, model
from app import redis
from app.karel import DyingException
from . import messaging

running = False


@messaging.route('/submit')
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
            message = json.loads(raw_message)

            handle = message["handle"]

            compiler = KarelCompiler(karels[handle])

            try:
                compiler.compile(str(message["text"]))
            except Exception, e:
                msg = json.dumps({"error": "%s" % e})
                redis.publish(current_app.config['REDIS_CHAN'], msg)
            else:
                try:
                    while not compiler.execute_step():
                        pass
                except DyingException:
                    pass

                if True: # TODO: This code should be executed when the player didn't wins
                    for beeper in iter(partial(model.return_beeper, handle), None):
                        command = '{"handle": "%s", "command": "spawnBeeper", "params": {"x": %d, "y": %d}}' % (
                            handle, beeper[0] * 24, beeper[1] * 24)
                        current_app.logger.info(command)
                        redis.publish(current_app.config['REDIS_CHAN'], command)

                    model.respawn(handle)
                    command = '{"handle": "%s", "command": "die"}' % handle
                    redis.publish(current_app.config['REDIS_CHAN'], command)


@messaging.route('/receive')
def outbox(ws):
    """Sends outgoing chat messages, via `ChatBackend`."""
    game.register(ws)

    while not ws.closed:
        # Context switch while `ChatBackend.start` is running in the background.
        gevent.sleep(0.1)
