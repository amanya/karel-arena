from flask import Blueprint
from flask_socketio import Namespace, join_room, emit

setup = Blueprint('setup', __name__)


class SetupNamespace(Namespace):
    def __init__(self, redis, namespace=None):
        super(SetupNamespace, self).__init__(namespace)
        self.redis = redis

    def on_choose_nickname(self, data):
        join_room(data["game_id"])
        key = "{}|*".format(data["game_id"])
        keys = self.redis.keys(key)
        for key in keys:
            handle = self.redis.get(key)
            if handle:
                _, nickname = key.split('|')
                emit('pick_karel', (nickname, handle), room=data["game_id"])
        key = "{game_id}|{nickname}".format(**data)
        self.redis.set(key, "")

    def on_pick_karel(self, data):
        join_room(data["game_id"])
        key = "{game_id}|{nickname}".format(**data)
        self.redis.set(key, data["handle"])
        emit('pick_karel', (data["nickname"], data["handle"]), room=data["game_id"])
