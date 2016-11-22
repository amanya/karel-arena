ig.module(
    'game.entities.tray'
)
.requires(
    'impact.entity',
    'plugins.joncom.font-sugar.font'
)
.defines(function() {

EntityTray = ig.Entity.extend({
    size: {x: 24, y: 24},
    animSheet: new ig.AnimationSheet('media/tray.png', 24, 24),
    offset: {x: 0, y: 0},
    flip: false,
    collides: ig.Entity.COLLIDES.NEVER,
    zIndex: -1,
    beepers: 0,
    capacity: -1,
    required: -1,
    font_red: new ig.Font('media/font.png', { fontColor: '#F00', borderColor: '#000' }),
    font_green: new ig.Font('media/font.png', { fontColor: '#0F0', borderColor: '#000' }),

    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim('idle', 1, [0]);
        this.beepers = this.initialBeepers || 0;
    },
    update: function() {
        this.parent();
    },
    draw: function() {
        this.parent();
        if (this.capacity >= 0) {
            this.font_red.draw(this.capacity, this.pos.x+16, this.pos.y-4, ig.Font.ALIGN_RIGHT);
        }
        if (this.beepers >= 0) {
            this.font_green.draw(this.beepers, this.pos.x, this.pos.y-4, ig.Font.ALIGN_LEFT);
        }
    },

});

});
