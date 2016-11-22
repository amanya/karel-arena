/**
 * Class: Karel
 * ------------
 * The Karel class is the controller (as in MVC) of Karel and
 * Karel's world. Karel is implemented using an underlying
 * KarelModel which is rendered using a static KarelView
 * draw method.
 */
function Karel() {

   var that = {};

   var karelModel = KarelModel();

	that.draw = function(c) {
	   KarelView.draw(canvasModel, karelModel, c);
	}

	that.move = function() {
        if(karelModel.move()) {
            ig.input.trigger('move');
            window.console.log('move');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
	}

    that.exit = function() {
        if(karelModel.exit()) {
            ig.input.trigger('exit');
            window.console.log('exit');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
    }

	that.turnLeft = function() {
        karelModel.turnLeft();
        ig.input.trigger('turnLeft');
        window.console.log('turnLeft');
	}

	that.turnRight = function() {
        window.console.log('turnRight');
        karelModel.turnRight();
        ig.input.trigger('turnRight');
	}

	that.turnAround = function() {
      karelModel.turnAround();
	}

	that.paintCorner = function(color) {
      karelModel.paintCorner(color);
	}

	that.putBeeper = function() {
        if(karelModel.putBeeper()) {
            ig.input.trigger('putBeeper');
            window.console.log('putBeeper');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
	}

    that.putBeeperInTray = function() {
        if(karelModel.putBeeperInTray()) {
            ig.input.trigger('putBeeperInTray');
            window.console.log('putBeeperInTray');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
    }

	that.pickBeeperFromTray = function() {
        if(karelModel.pickBeeperFromTray()) {
            window.console.log('pickBeeperFromTray');
            ig.input.trigger('pickBeeperFromTray');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
	}

    that.pickBeeper = function() {
        if(karelModel.pickBeeper()) {
            window.console.log('pickBeeper');
            ig.input.trigger('pickBeeper');
        } else {
            ig.game.getEntitiesByType('EntityKarel')[0].kill();
        }
	}

   that.turnAround = function() {
      karelModel.turnAround();
   }

   that.paintCorner = function(color) {
      karelModel.paintCorner(color);
   }

	that.beepersPresent = function() {
		return karelModel.beeperPresent();
	}

	that.noBeepersPresent = function() {
		return !karelModel.beeperPresent();
	}

	that.trayPresent = function() {
		return karelModel.trayPresent();
	}

	that.noTrayPresent = function() {
		return !karelModel.trayPresent();
	}

    that.exitPresent = function() {
        return karelModel.exitPresent();
    }

    that.noExitPresent = function() {
        return !karelModel.exitPresent();
    }

    that.trayFull = function() {
        return karelModel.trayFull();
    }

    that.trayNotFull = function() {
        return !karelModel.trayFull();
    }

   that.frontIsClear = function() {
      return karelModel.frontIsClear();
	}

	that.frontIsBlocked = function() {
      return !karelModel.frontIsClear();
	}

	that.random = function(p) {
      var prob = 0.5;
      if (p != undefined) {
         prob = p;
      }
      return Math.random() > prob;
	}

	that.rightIsClear = function() {
		return karelModel.rightIsClear();
	}

	that.rightIsBlocked = function() {
		return !karelModel.rightIsClear();
	}

	that.leftIsClear = function() {
		return karelModel.leftIsClear();
	}

   that.leftIsBlocked = function() {
		return !karelModel.leftIsClear();
	}

	that.facingNorth = function() {
		return karelModel.facingNorth();
	}

	that.notFacingNorth = function() {
		return !karelModel.facingNorth();
	}

	that.facingSouth = function() {
		return karelModel.facingSouth();
	}

	that.notFacingSouth = function() {
		return !karelModel.facingSouth();
	}

	that.facingEast = function() {
		return karelModel.facingEast();
	}

	that.notFacingEast = function() {
		return !karelModel.facingEast();
	}

	that.facingWest = function() {
		return karelModel.facingWest();
	}

	that.notFacingWest = function() {
		return !karelModel.facingWest();
	}

   that.loadWorld = function(text) {
      karelModel.loadWorld(text);
   }

   that.getModel = function() {
      return karelModel;
   }

	return that;
}

Karel.instructions = {
   move: 1, turnLeft: 1, putBeeper: 1, pickBeeper: 1,
   turnRight: 2, turnAround: 2, paintCorner: 2,
   putBeeperInTray: 1, pickBeeperFromTray: 1,
   exit: 1
};

Karel.predicates = {
   frontIsClear:1, frontIsBlocked:1,
   leftIsClear:1, leftIsBlocked:1,
   rightIsClear:1, rightIsBlocked:1,
   beepersPresent:1, noBeepersPresent:1,
   beepersInBag:1, noBeepersInBag:1,
   trayPresent:1, noTrayPresent:1,
   trayFull:1, trayNotFull:1,
   exitPresent:1, noExitPresent:1,
   facingNorth:1, notFacingNorth:1,
   facingEast:1, notFacingEast:1,
   facingSouth:1, notFacingSouth:1,
   facingWest:1, notFacingWest:1,
   cornerColorIs:2, random:2
};





