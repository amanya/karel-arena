import json
import re
from functools import partial

import socketIO_client
from celery import Celery
from flask import Blueprint
from flask import current_app
from flask import request
from flask_socketio import Namespace, emit, join_room
from pykarel.karel_compiler import KarelCompiler

from app.impact_map import ImpactMap
from app.karel import DyingException, Karel
from app.karel_model import KarelModel

messaging = Blueprint('messaging', __name__)

celery = Celery("tasks", broker="redis://", backend="redis://")

@celery.task
def spawn_beeper(game_id):
    with socketIO_client.SocketIO('localhost', 5000, socketIO_client.LoggingNamespace) as socketIO:
        socketIO.emit('spawn_beeper', {'game_id': game_id}, path='/game')

class GameNamespace(Namespace):
    def __init__(self, redis, namespace=None):
        super(GameNamespace, self).__init__(namespace)
        self.redis = redis

    def on_connect(self):
        game_id = re.match(r'^.*([A-Za-z0-9]{4})$', request.referrer).group(1)
        join_room(game_id)

    def on_spawn_beeper(self, data):
        map = self.redis.get(data["game_id"])

    def on_execute(self, data):
        spawn_beeper.apply_async(args=[data["game_id"],], countdown=5)

        karel_model = KarelModel(current_app.logger)
        map = ImpactMap()
        map.load(self.redis.get(data["game_id"]))
        karel_model.load_world(map.to_compiler())
        karel = Karel(karel_model, data["game_id"], data["nickname"], data["handle"])
        compiler = KarelCompiler(karel)

        try:
            compiler.compile(str(data["code"]))
        except Exception as e:
            emit("error", str(e), room=data["game_id"])
        else:
            try:
                while not compiler.execute_step():
                    pass
            except DyingException:
                pass

            if True:  # TODO: This code should be executed when the player didn't wins
                for beeper in iter(partial(karel_model.return_beeper, data["handle"]), None):
                    msg = {"handle": data["handle"], "command": "spawnBeeper",
                           "params": {"x": beeper[0] * 24, "y": beeper[1] * 24}}
                    emit("command", json.dumps(msg), room=data["game_id"])

                karel_model.respawn(data["handle"])
                msg = '{"handle": "%s", "command": "die"}' % (data["handle"])
                emit('command', msg, room=data["game_id"])
