ig.module(
    'game.entities.karel'
)
.requires(
    'plugins.gridmovement',
    'plugins.rotationmovement',
    'impact.entity'
)
.defines(function() {

EntityKarel = ig.Entity.extend({
    name: 'karel-pink',
    initial_pos: {x: 0, y: 0},
    initial_dir: null,
    size: {x: 24, y: 24},
    animSheet: new ig.AnimationSheet('media/megaman_anim.png', 24, 24),
    offset: {x: 0, y: 0},
    flip: false,
    justBorn: true,
    justBornTimer: null,
    maxVel: {x: 150, y: 150},
    type: ig.Entity.TYPE.A,
    checkAgainst: null,
    collides: ig.Entity.COLLIDES.NEVER,
    action: '',


    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.initial_pos = {x: x, y: y};
        this.movement = new GridMovement(this);
        this.movement.speed = {x: 150, y: 150};
        this.rotation = new RotationMovement();
        this.addAnim('idle', 1, [0]);
        this.addAnim('start', 0.1, [0, -1]);
        this.addAnim('run', 0.05, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        this.rotation.addAnim(this.anims.idle);
        this.rotation.addAnim(this.anims.run);
        this.rotation.addAnim(this.anims.start);
        this.justBornTimer = new ig.Timer(1.5);
        this.fixRotation();
    },

    fixRotation: function() {
        switch (this.facing) {
            case 'EAST':
                this.direction = GridMovement.moveType.RIGHT;
                this.rotation.destination = RotationMovement.moveType.EAST;
                break;;
            case 'WEST':
                this.direction = GridMovement.moveType.LEFT;
                this.rotation.destination = RotationMovement.moveType.WEST;
                break;;
            case 'NORTH':
                this.direction = GridMovement.moveType.UP;
                this.rotation.destination = RotationMovement.moveType.NORTH;
                break;;
            case 'SOUTH':
                this.direction = GridMovement.moveType.DOWN;
                this.rotation.destination = RotationMovement.moveType.SOUTH;
                break;;
        }
        this.initial_dir = this.direction;
        //this.rotation.setCurrentAngle();
    },

    kill: function() {
        this.parent();
    },

    update: function() {
        this.parent();
        this.movement.update();
        this.rotation.update();

        if (this.action == 'turnLeft') {
            this.action = '';
            switch (this.direction) {
                case GridMovement.moveType.RIGHT:
                    this.rotation.destination = RotationMovement.moveType.NORTH;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.UP;
                    break;
                case GridMovement.moveType.UP:
                    this.rotation.destination = RotationMovement.moveType.WEST;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.LEFT;
                    break;
                case GridMovement.moveType.LEFT:
                    this.rotation.destination = RotationMovement.moveType.SOUTH;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.DOWN;
                    break;
                case GridMovement.moveType.DOWN:
                    this.rotation.destination = RotationMovement.moveType.EAST;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.RIGHT;
                    break;
            }
        }
        else if (this.action == 'turnRight') {
            this.action = '';
            switch (this.direction) {
                case GridMovement.moveType.LEFT:
                    this.rotation.destination = RotationMovement.moveType.NORTH;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.UP;
                    break;
                case GridMovement.moveType.DOWN:
                    this.rotation.destination = RotationMovement.moveType.WEST;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.LEFT;
                    break;
                case GridMovement.moveType.RIGHT:
                    this.rotation.destination = RotationMovement.moveType.SOUTH;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.DOWN;
                    break;
                case GridMovement.moveType.UP:
                    this.rotation.destination = RotationMovement.moveType.EAST;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.RIGHT;
                    break;
            }
        }
        else if (this.action == 'move') {
            var position = this.name + " -> " + " x: " + this.pos.x + " y: " + this.pos.y;
            $("#" + this.name + "-pos").text(position);
            this.movement.direction = this.direction;
            this.currentAnim = this.anims.run.rewind();
            this.action = '';
        }
        else if (this.action == 'die') {
            this.action = '';
            GameInfo.command_buffer[this.name] = [];
            this.pos.x = this.initial_pos.x;
            this.pos.y = this.initial_pos.y;
            this.fixRotation();
            this.justBorn = true;
            this.justBornTimer = new ig.Timer(1.5);
        }
        else if (this.action == 'exit') {
            this.action = '';
            var exits = ig.game.getEntitiesByType('EntityExit');
            for (var n = 0; n < exits.length; n++) {
                var distance = this.distanceTo(exits[n]);
                if (distance < 30) {
                    var trays = ig.game.getEntitiesByType('EntityTray');
                    for (var n = 0; n < trays.length; n++) {
                        if (trays[n].required != -1 && trays[n].beepers < trays[n].required) {
                            GameInfo.traysFullAchieved = false;
                        }
                    }
                    ig.system.setGame(LevelEnd);
                    break;
                }
            }
        }
        else if (this.action == 'pickBeeper') {
            this.action = '';
            var beepers = ig.game.getEntitiesByType('EntityBeeper');
            for (var n = 0; n < beepers.length; n++) {
                var distance = this.distanceTo(beepers[n]);
                if (distance < 15) {
                    GameInfo.beepers++;
                    beepers[n].kill();
                    break;
                }
            }
        }
        else if (this.action == 'putBeeper') {
            this.action = '';
            if (GameInfo.beepers > 0) {
                GameInfo.beepers--;
                ig.game.spawnEntity('EntityBeeper', this.pos.x, this.pos.y);
            }
        }
        else if (this.action == 'spawnBeeper') {
            this.action = '';
            GameInfo.beepers--;
            ig.game.spawnEntity('EntityBeeper', this.params.y, this.params.x);
            this.params = '';
        }
        else if (this.action == 'putBeeperInTray') {
            this.action = '';
            var trays = ig.game.getEntitiesByType('EntityTray');
            for (var n = 0; n < trays.length; n++) {
                var distance = this.distanceTo(trays[n]);
                if (distance < 15) {
                    if (trays[n].capacity == -1 ||
                        trays[n].beepers < trays[n].capacity) {
                        if (GameInfo.beepers > 0) {
                            GameInfo.beepers--;
                            trays[n].beepers++;
                        }
                    }
                    break;
                }
            }
        }
        else if (this.action == 'pickBeeperFromTray') {
            this.action = '';
            var trays = ig.game.getEntitiesByType('EntityTray');
            for (var n = 0; n < trays.length; n++) {
                var distance = this.distanceTo(trays[n]);
                if (distance < 15) {
                    if (trays[n].beepers > 0) {
                        GameInfo.beepers++;
                        trays[n].beepers--;
                    }
                    break;
                }
            }
        }
        else if (this.justBorn) {
            this.currentAnim = this.anims.start;
            if (this.justBornTimer.delta() > 0) {
                this.justBorn = false;
            }
        }
        else if (!this.movement.isMoving()) {
            this.currentAnim = this.anims.idle;
        }
        var msg = this.name + " -> " + " bag: " + GameInfo.beepers;
        $("#" + this.name + "-bag").text(msg);
    },

    check: function(other) {
        this.movement.collision();
        this.parent.other();
    }
});

});
