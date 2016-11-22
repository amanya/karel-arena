ig.module(
    'game.entities.karel_dying'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityKarelDying = ig.Entity.extend({
    size: {x: 64, y: 64},
    animSheet: new ig.AnimationSheet('media/megaman_dying.png', 64, 64),
    offset: {x: 0, y: 0},
    flip: false,
    timer: null,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.ACTIVE,


    init: function(x, y, settings) {
        this.timer = ig.Timer();
        this.parent(x, y, settings);
        this.addAnim('idle', 0.1, [5, 4, 5, 4, 5, 4, 3, 2, 1, 0], true);
    },

    update: function() {
        this.parent();
        if(timer.delta() < -1) {
            this.kill();
        }
    }

});

});
