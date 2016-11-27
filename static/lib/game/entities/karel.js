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
    name: 'karel-blue',
    size: {x: 24, y: 24},
    animSheet: new ig.AnimationSheet('media/megaman_anim.png', 24, 24),
    offset: {x: 0, y: 0},
    flip: false,
    justBorn: true,
    justBornTimer: null,
    maxVel: {x: 150, y: 150},
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.ACTIVE,
    action: '',


    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.movement = new GridMovement(this);
        this.movement.speed = {x: 150, y: 150};
        this.rotation = new RotationMovement();
        this.direction = GridMovement.moveType.RIGHT;
        //this.movement.direction = GridMovement.moveType.RIGHT;
        this.addAnim('idle', 1, [0]);
        this.addAnim('start', 0.1, [0, -1]);
        this.addAnim('run', 0.05, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        this.rotation.addAnim(this.anims.idle);
        this.rotation.addAnim(this.anims.run);
        this.justBornTimer = new ig.Timer(1.5);
    },

    kill: function() {
        //ig.game.spawnEntity('EntityKarelDying', this.pos.x-8, this.pos.y-8);
        ig.game.animating = false;
        if (ig.game.compileEngine !== null) {
            ig.game.compileEngine.vm.cf = null;
            var done = false;
            while(!done) {
                done = ig.game.compileEngine.executeStep();
            }
        }
        ig.game.init();
        this.parent();
    },

    update: function() {
        this.parent();
        if (GameInfo.maxTimeTimer && GameInfo.maxTimeTimer.delta() > -1) {
            GameInfo.timeOut = true;
            ig.system.setGame(LevelEnd);
        }
        this.movement.update();
        this.rotation.update();

        if (this.action == 'turnLeft') {
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
                    this.currentAnim = this.anims.down;
                    this.direction = GridMovement.moveType.DOWN;
                    break;
                case GridMovement.moveType.DOWN:
                    this.rotation.destination = RotationMovement.moveType.EAST;
                    this.currentAnim = this.anims.idle;
                    this.direction = GridMovement.moveType.RIGHT;
                    break;
            }
            this.action = '';
        }
        if (ig.input.pressed('turnRight')) {
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
                    this.currentAnim = this.anims.down;
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
            this.movement.direction = this.direction;
            this.currentAnim = this.anims.run.rewind();
            this.action = '';
        }
        else if (ig.input.pressed('exit')) {
            var exits = ig.game.getEntitiesByType('EntityExit');
            for (var n = 0; n < exits.length; n++) {
                var distance = this.distanceTo(exits[n]);
                if (distance < 15) {
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
        else if (ig.input.pressed('pickBeeper')) {
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
        else if (ig.input.pressed('putBeeper')) {
            if (GameInfo.beepers > 0) {
                GameInfo.beepers--;
                ig.game.spawnEntity('EntityBeeper', this.pos.x, this.pos.y);
            }

        }
        else if (ig.input.pressed('putBeeperInTray')) {
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
        else if (ig.input.pressed('pickBeeperFromTray')) {
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
    },

    check: function(other) {
        this.movement.collision();
        this.parent.other();
    }
});

});
