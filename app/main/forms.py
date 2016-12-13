from flask_wtf import FlaskForm

from wtforms import StringField, SubmitField
from wtforms.validators import Length


class GameForm(FlaskForm):
    game_id = StringField('ID of the game', validators=[Length(4)])
    nickname = StringField('Nickname of the player', validators=[Length(1, 64)])
    handle = StringField('Karel handle choosed by the user', validators=[Length(4, 64)])
    submit = SubmitField('Submit')

