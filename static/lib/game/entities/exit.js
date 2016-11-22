ig.module(
    'game.entities.exit'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityExit = ig.Entity.extend({
    size: {x: 24, y: 24},
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
    target: null,
    wait: -1,
    waitTimer: null,
    canFire: true,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,

    init: function(x, y, settings) {
        this.parent(x, y, settings);
    },
    update: function() {
    },
});

});
