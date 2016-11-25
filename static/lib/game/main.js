ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.karel',
    'game.entities.beeper',
    'game.entities.tray',
    'game.entities.exit',
    'game.entities.trigger',
    'game.entities.levelchange'
)
.defines(function(){

GameInfo = new function() {
    this.maxSteps = max_instr;
    this.numSteps = 0;
    this.maxTime = max_time;
    this.maxTimeTimer = null;
    this.requiredBeepers = num_beepers;
    this.traysFullAchieved = true;
    this.beepers = 0;
    this.finished = false;
    this.timeOut = false;
    this.command_buffer = {
        'karel-blue': [],
        'karel-green': [],
    };
},

MyGame = ig.Game.extend({

	// Load a font
    font: new ig.Font('media/font.png'),
    worldCellSize: 24,
    animating: false,
    compileEngine: null,
    karel: null,
    ival: null,

	init: function() {
        
        //ig.input.karelBind('karelEvent', 'move');
        /*
        ig.input.bind( ig.KEY.SPACE, 'turnLeft' );
        ig.input.bind( ig.KEY.ENTER, 'move' );
        ig.input.bind( ig.KEY.UP_ARROW, 'pickBeeper' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'putBeeper' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'pickBeeperFromTray' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'putBeeperInTray' );
        */
        ig.Input.inject({
            trigger: function( action ) {
                this.actions[action] = true;
                this.presses[action] = true;
                this.delayedKeyup[action] = true;
            }
        });

        if (timerExecuted){
        	GameInfo.maxTimeTimer = new ig.Timer(max_time);
        }
        this.animating = false;
        if (!GameInfo.finished) {
            GameInfo.beepers = 0;
            this.requireLevel(level_name, null);
        }
	},

    getEntityWorldPos: function(entity) {
        // Convert raw coordinates to cell position in the world board
        var pos = {
            col: Math.floor(entity.pos.x / this.worldCellSize),
            row: Math.floor(entity.pos.y / this.worldCellSize)
        };
        return pos;
    },

	update: function() {
        var a = ig.game.getEntityByName('karel-blue');

        karel_ids = ['karel-blue', 'karel-green'];
        for(var i = 0; i < karel_ids.length ; i++) {
            var karel_id = karel_ids[i];
            var karel = ig.game.getEntityByName(karel_id);
            if(karel) {
                if(!this.animating && GameInfo.command_buffer[karel_id].length > 0 && !karel.movement.isMoving()) {
                    this.animating = true;
                    var command = GameInfo.command_buffer[karel_id].shift();
                    if(karel.name == karel_id) {
                        karel.action = command;
                    }
                } else {
                    if(GameInfo.command_buffer[karel_id].length > 0) {
                        this.animating = false;
                    }
                }
            }
        }
		this.parent();
	},

	draw: function() {
    if (GameInfo.finished) return;
		// Draw all entities and backgroundMaps
		this.parent();
		if (GameInfo.maxTimeTimer){
        var max_time = Math.round(Math.abs(GameInfo.maxTimeTimer.delta()));
        var num_beepers = GameInfo.beepers;
        this.font.draw("t:" + max_time + " b:" + num_beepers, 10, 10, ig.Font.ALIGN_RIGHT);
		}
	},

    requireLevel: function(levelName, callback) {
        var levelObjectName = levelName.replace(/^(\w)(\w*)/, function(m, a, b) {
          return 'Level' + a.toUpperCase() + b;
        });
        if (typeof window[levelObjectName] != 'undefined') {
            // file already loaded, just use it
            this.loadLevel(ig.global[levelObjectName]);
        } else {
            var _this = this;

            $.getScript('/map', function() {

                _this.loadLevel(ig.global[levelObjectName]);

                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    }

}),

LevelEnd = ig.Game.extend({

    successful: function(){
        if (GameInfo.timeOut == true) {
            return false;
        }
        var reqBeepersAchieved = GameInfo.beepers >= GameInfo.requiredBeepers;
        return reqBeepersAchieved && GameInfo.traysFullAchieved
    },

    levelEndImage: new ig.Image('media/levelEnd.png'),

    init: function() {
        var form = $('#edit_project')[0];
        var fd = new FormData(form);
        fd.append("project[code]", editor.getValue());
        fd.append("project[instr_cnt]", 0);
        var time_left = Math.round(Math.abs(GameInfo.maxTimeTimer.delta()));
        fd.append("time_left", time_left);
        fd.append("project[beepers_cnt]", GameInfo.beepers);
        var xhr = new XMLHttpRequest();
        xhr.open(form.method, form.action, true);
        var that = this;
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            that.karel_check()
          }
        };
        xhr.send(fd);
    },

    draw: function() {
        this.parent();
        //this.levelEndImage.draw(0, 0);
        var font = new ig.Font('media/font.png');
        if (this.successful()) {
            font.draw('LEVEL DONE', 100, 100);
        }
        else {
            font.draw('LEVEL FAILED', 100, 100);
        }
        GameInfo.finished = true;
    },

    karel_check: function() {
      $.ajax({
        type: 'GET',
        dataType: "json",
        data: {
          id: card_id,
          game_success: this.successful()
        },
        url: '/karel_check',
        error: default_process_project_error_handler,
        success: process_project_result
      });
    }
});


ig.main( '#canvas', MyGame, 60, 480, 480, 1 );

});
