import redis as redis_srv
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sockets import Sockets

from app.karel import Karel
from app.karel_backend import KarelBackend
from config import config

bootstrap = Bootstrap()
sockets = None
redis = None
game = None
karels = None


def create_app(config_name):
    app = Flask(__name__, static_folder='../static')
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)

    global sockets
    sockets = Sockets(app)
    global redis
    redis = redis_srv.from_url(app.config['REDIS_URL'])
    global game
    game = KarelBackend(app, redis)
    global karels
    karels = create_karels(app, game)

    if not app.debug and not app.testing and not app.config['SSL_DISABLE']:
        from flask_sslify import SSLify
        sslify = SSLify(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .messaging import messaging as messaging_blueprint
    sockets.register_blueprint(messaging_blueprint)

    return app


def create_karels(app, game):
    karels = {k: Karel(app, redis, k) for k in ['karel-blue', 'karel-green']}
    for karel in karels.values():
        karel.load_world(game.impact_map.to_compiler())
    return karels
