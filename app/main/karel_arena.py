import json

from flask import render_template, send_from_directory
from flask import session
from werkzeug.utils import redirect

from app import game, model, redis
from app.main.forms import GameForm
from . import main


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>", methods=["GET", "POST"])
def run_game(game_id):
    form = GameForm()
    if form.validate_on_submit():
        session['nickname'] = form.data["nickname"]
        session['handle'] = form.data["handle"]
        return redirect("/{}".format(game_id))

    if redis.exists(game_id):
        map = json.loads(redis.get(game_id))
        model.load_world(map)
        return render_template('game.html', game_id=game_id, nickname=session["nickname"], handle=session["handle"])
    else:
        map = game.impact_map.to_compiler()
        redis.set(game_id, json.dumps(map))
        return render_template('setup.html', game_id=game_id, form=form)


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>/reset")
def reset_game(game_id):
    redis.delete(game_id)
    return "OK"


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>/map")
def send_map(game_id):
    return str(game.impact_map)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/lib/<path:path>')
def send_lib(path):
    return send_from_directory('../static/lib', path)


@main.route('/media/<path:path>')
def send_media(path):
    return send_from_directory('../static/media', path)

