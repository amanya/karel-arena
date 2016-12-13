from flask import Blueprint

setup = Blueprint('setup', __name__)

from . import setup_game
