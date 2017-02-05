import json
import os

from flask import current_app
from flask import flash
from flask import render_template, send_from_directory
from flask import session
from flask import url_for
from werkzeug.utils import redirect

from app import game, redis
from app.impact_map import ImpactMap
from app.main.forms import GameForm
from . import main


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>", methods=["GET", "POST"])
def run_game(game_id):
    key = "{}|*".format(game_id)
    keys = redis.keys(key)
    if len(keys) >= 4:
        flash("This game is full, start a new one", "errors")
        return redirect(url_for('main.index'))
    form = GameForm()
    if form.validate_on_submit():
        session['nickname'] = form.data["nickname"]
        session['handle'] = form.data["handle"]
        if not redis.exists(form.data["game_id"]):
            impact_map = ImpactMap()
            impact_map.initialize()
            redis.set(form.data["game_id"], json.dumps(impact_map.impact_map))
        return redirect("/{}".format(game_id))

    if 'nickname' in session and len(keys) > 0:
        try:
            with open("initial-code.txt") as f:
                initial_code = f.read()
        except IOError:
            initial_code = "function main() {" + os.linesep + "}"
        return render_template(
            'game.html',
            game_id=game_id,
            nickname=session["nickname"],
            handle=session["handle"],
            initial_code=initial_code
        )
    else:
        return render_template('setup.html', game_id=game_id, form=form)


@main.route("/<regex('([A-Za-z0-9]{5,})'):game_id>")
def bad_game_name(game_id):
    flash("The game name must have exactly 4 characters", "errors")
    return redirect(url_for('main.index'))


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>/reset")
def reset_game(game_id):
    redis.delete(game_id)
    return "OK"


@main.route("/<regex('([A-Za-z0-9]{4})'):game_id>/map")
def send_map(game_id):
    impact_map = ImpactMap()
    impact_map.load(redis.get(game_id))
    return str(impact_map)


@main.route('/')
def index():
    session.clear()
    return render_template('index.html')


@main.route('/lib/<path:path>')
def send_lib(path):
    return send_from_directory('../static/lib', path)


@main.route('/media/<path:path>')
def send_media(path):
    return send_from_directory('../static/media', path)

