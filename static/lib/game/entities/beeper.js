ig.module(
    'game.entities.beeper'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityBeeper = ig.Entity.extend({
    size: {x: 24, y: 24},
    animSheet: new ig.AnimationSheet('media/beeper.png', 24, 24),
    offset: {x: 0, y: 0},
    flip: false,
    collides: ig.Entity.COLLIDES.NEVER,
    zIndex: -1,
    taken: false,

    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 1, [0]);
    },
    update: function() {
        this.parent();
    },
});

});
