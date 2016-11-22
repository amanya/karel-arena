/**
 * Class: KarelModel
 * -----------------
 * The KarelModel class is in charge of storing and updating
 * the underlying representation of Karel and her world. 
 * Supports deep copy.
 */
function KarelModel() {

   var that = {};

   that.dir = Const.KAREL_EAST;
   that.karelRow = 0;
   that.karelCol = 0;
   that.beepers = null;
   that.trays = null;
   that.exits = null;
   that.walls = null;
   that.squareColors = null;
   that.rows = 0;
   that.cols = 0;
   that.bag = 0;

   that.deepCopy = function() {
      var newModel = KarelModel();
      newModel.dir = that.dir;
      newModel.karelRow = that.karelRow;
      newModel.karelCol = that.karelCol;
      newModel.beepers = that.beepers.deepCopy();
      newModel.trays = that.trays.deepCopy();
      newModel.exits = that.exits.deepCopy();
      newModel.walls = that.walls.deepCopy();
      newModel.squareColors = that.squareColors.deepCopy();
      newModel.rows = that.rows;
      newModel.cols = that.cols;
      newModel.bag = that.bag;
      return newModel;
   }

   that.equals = function(otherModel) {
      if (that.dir != otherModel.dir) return false;
      if (that.karelRow != otherModel.karelRow) return false;
      if (that.karelCol != otherModel.karelCol) return false;
      if (!that.beepers.equals(otherModel.beepers)) return false;
      if (!that.trays.equals(otherModel.trays)) return false;
      if (!that.exits.equals(otherModel.exits)) return false;
      if (!that.squareColors.equals(otherModel.squareColors)) return false;
      if (!that.bag != otherModel.bag) return false;
      return true;
   }

    that.exit = function() {
        if(that.exits.exitPresent(that.karelRow, that.karelCol)) {
            return true;
        }
        return false;
    }

    that.move = function() {
        var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newCol = newCol + 1; break;
			case Const.KAREL_WEST: newCol = newCol - 1; break;
			case Const.KAREL_NORTH: newRow = newRow - 1; break;
			case Const.KAREL_SOUTH: newRow = newRow + 1; break;
		}
		if(that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol)) {
			that.karelRow = newRow;
			that.karelCol = newCol;
            window.console.log("row: "+newRow+" col: "+newCol);
		} else {
		   error('Front Is Blocked');
           return false;
		}
        return true;
   }

   that.turnLeft = function() {
      var newD = that.dir;
		switch(that.dir) {
            case Const.KAREL_EAST:  newD = Const.KAREL_NORTH; console.log('dir:'+newD); break;
            case Const.KAREL_WEST:  newD = Const.KAREL_SOUTH; console.log('dir:'+newD); break;
            case Const.KAREL_NORTH: newD = Const.KAREL_WEST; console.log('dir:'+newD); break;
            case Const.KAREL_SOUTH: newD = Const.KAREL_EAST; console.log('dir:'+newD); break;	
			default: alert("invalid that.dir: " + that.dir); break;	
		}
		that.dir = newD;
   }

   that.turnRight = function() {
      var newD = that.dir;
		switch(that.dir) {
			case Const.KAREL_EAST:  newD = Const.KAREL_SOUTH; break;
			case Const.KAREL_WEST:  newD = Const.KAREL_NORTH; break;
			case Const.KAREL_NORTH: newD = Const.KAREL_EAST; break;
			case Const.KAREL_SOUTH: newD = Const.KAREL_WEST; break;	
			default: alert("invalid that.dir: " + that.dir); break;	
		}
		that.dir = newD;
   }

   that.pickBeeper = function() {
      if (that.beepers.beeperPresent(that.karelRow, that.karelCol)) {
         that.beepers.pickBeeper(that.karelRow, that.karelCol);
         that.bag++;
      } else {
         error('No Beepers Present');
         return false;
      }
      return true;
   }

    that.putBeeper = function() {
        if (that.bag > 0) {
            that.beepers.putBeeper(that.karelRow, that.karelCol);
            that.bag--;
        } else {
            error('Not carying any beeper');
            return false;
        }
        return true;
    }

    that.putBeeperInTray = function() {
        if (that.bag <= 0) {
            error('Not carying any beeper');
            return false;
        }
        if (that.trays.trayPresent(that.karelRow, that.karelCol)) {
            var numBeepers = that.beepers.numBeepers(that.karelRow, that.karelCol);
            if (that.trays.trayCapacity(that.karelRow, that.karelCol) > numBeepers) {
                that.beepers.putBeeper(that.karelRow, that.karelCol);
            } else {
                error('Tray is full');
                return false;
            }
        } else {
            error('No Tray Present');
            return false;
        }
        return true;
    }

    that.pickBeeperFromTray = function() {
        if (that.trays.trayPresent(that.karelRow, that.karelCol)) {
            var numBeepers = that.beepers.numBeepers(that.karelRow, that.karelCol);
            if (numBeepers > 0) {
                that.beepers.pickBeeper(that.karelRow, that.karelCol);
            } else {
                error('Tray is empty');
                return false;
            }
        } else {
            error('No Tray Present');
            return false;
        }
        return true;
    }

   that.turnAround = function() {
      var newD = that.dir;
		switch(that.dir) {
			case Const.KAREL_EAST:  newD = Const.KAREL_WEST; break;
			case Const.KAREL_WEST:  newD = Const.KAREL_EAST; break;
			case Const.KAREL_NORTH: newD = Const.KAREL_SOUTH; break;
			case Const.KAREL_SOUTH: newD = Const.KAREL_NORTH; break;	
			default: alert("invalid that.dir: " + that.dir); break;	
		}
		that.dir = newD;
   }

   that.paintCorner = function(color) {
      that.squareColors.paintCorner(that.karelRow, that.karelCol, color);
   }

   that.getDirection = function() {
      return that.dir;
   }

   that.getNumRows = function() {
      return that.rows;
   }

   that.getNumCols = function() {
      return that.cols;
   }

   that.getKarelRow = function() {
      return that.karelRow;
   }

   that.getKarelCol = function() {
      return that.karelCol;
   }

   that.getSquareColor = function(r, c) {
      return that.squareColors.getColor(r, c);
   }

   that.getNumBeepers = function(r, c) {
      return that.beepers.getNumBeepers(r, c);
   }

   that.getNumBeepersInTray = function(r, c) {
      if (that.trays.trayPresent(that.karelRow, that.karelCol)) {
          return that.beepers.getNumBeepers(r, c);
      } else {
         error('No Trays Present');
         return false;
      }
      return true;
   }

   that.hasWall = function(r, c) {
      return that.walls.wall(r, c);
   }

	that.beeperPresent = function() {
		return that.beepers.beeperPresent(that.karelRow, that.karelCol);
	}

	that.trayPresent = function() {
		return that.trays.trayPresent(that.karelRow, that.karelCol);
	}

    that.exitPresent = function() {
		return that.exits.exitPresent(that.karelRow, that.karelCol);
    }

    that.trayFull = function() {
        return that.trays.trayCapacity(that.karelRow, that.karelCol) <= that.getNumBeepers(that.karelRow, that.karelCol);
    }

   that.frontIsClear = function() {
      var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newCol = newCol + 1; break;
			case Const.KAREL_WEST: newCol = newCol - 1; break;
			case Const.KAREL_NORTH: newRow = newRow - 1; break;
			case Const.KAREL_SOUTH: newRow = newRow + 1; break;
			default: alert("invalid that.dir: " + that.dir); break;		
		}
		var ret = that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
        return ret;
	}

	that.rightIsClear = function() {
		var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newRow = newRow + 1; break;
			case Const.KAREL_WEST: newRow = newRow - 1; break;
			case Const.KAREL_NORTH: newCol = newCol + 1; break;
			case Const.KAREL_SOUTH: newCol = newCol - 1; break;
			default: alert("invalid that.dir: " + that.dir); break;		
		}
		return that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
	}

	that.leftIsClear = function() {
		var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newRow = newRow - 1; break;
			case Const.KAREL_WEST: newRow = newRow + 1; break;
			case Const.KAREL_NORTH: newCol = newCol - 1; break;
			case Const.KAREL_SOUTH: newCol = newCol + 1; break;
			default: alert("invalid that.dir: " + that.dir); break;		
		}
		return that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
	}

	that.facingNorth = function() {
		return virtualDirection == KAREL_NORTH;	
	}

	that.facingSouth = function() {
		return virtualDirection == KAREL_SOUTH;	
	}

	that.facingEast = function() {
		return virtualDirection == KAREL_EAST;	
	}

	that.facingWest = function() {
		return virtualDirection == KAREL_WEST;	
	}

   that.loadWorld = function(worldText) {
      var lines = worldText.split("\n");

		// get world dimension
		loadDimensionLine(lines[0]);
		
		that.beepers = Beepers(that.rows, that.cols);
        that.trays = Trays(that.rows, that.cols);
        that.exits = Exits(that.rows, that.cols);
		that.walls = Walls(that.rows, that.cols);
      that.squareColors = SquareColors(that.rows, that.cols);

      that.dir = Const.KAREL_EAST;

		// load world details
		for (var i = 1; i < lines.length; i++) {
		   if (lines[i] != '') {
			   loadLine(lines[i]);
		   }
		}
   }

   function extractCoord(coordString) {
      var rParenIndex = coordString.indexOf('(');
      var lParenIndex = coordString.indexOf(')');
      coordString = coordString.substring(rParenIndex + 1, lParenIndex);
      coordStrings = coordString.split(',');
      var row = parseInt(coordStrings[0]);
      var col = parseInt(coordStrings[1]);
      return [row, col];
   }

   function extractCapacity(coordString) {
      var rParenIndex = coordString.indexOf('(');
      var lParenIndex = coordString.indexOf(')');
      coordString = coordString.substring(rParenIndex + 1, lParenIndex);
      coordStrings = coordString.split(',');
      var cap = parseInt(coordStrings[2]);
      return cap;
   }

   function loadDimensionLine(line) {
		var dimensionStrings = line.split(":");

      assert(dimensionStrings[0] == 'Dimension', 'World file malformed');
      var coord = extractCoord(dimensionStrings[1]);

		that.rows = coord[0];
		that.cols = coord[1];
   }

   function error(msg) {
      window.console.log(msg);
   }

   function placeKarel(row, col) {
      that.karelRow = row;
      that.karelCol = col;
   }
   
   function loadWallLine(line) {
       var coord = extractCoord(line);
       var row = coord[1];
       var col = coord[0];
       if (col >= 0 && row >= 0 && col<that.cols && row<that.rows) {
           that.walls.addWall(row, col);
       }
   }

   function loadBeeperLine(line) {
      var coord = extractCoord(line);
      var row = coord[0];
      var col = coord[1];
      that.beepers.putBeeper(row, col)
   }

   function loadTrayLine(line) {
      var coord = extractCoord(line);
      var row = coord[0];
      var col = coord[1];
      var capacity = extractCapacity(line);
      that.trays.putTray(row, col, capacity)
   }

   function loadExitLine(line) {
       var coord = extractCoord(line);
       var row = coord[0];
       var col = coord[1];
       that.exits.putExit(row, col)
   }

   function loadKarelLine(line) {
      var coord = extractCoord(line);
      var row = coord[0];
      var col = coord[1];
      placeKarel(row, col);
      if (line.indexOf('west') != -1) {
         that.dir = Const.KAREL_WEST;
      }
      if (line.indexOf('south') != -1) {
         that.dir = Const.KAREL_SOUTH;
      }
      if (line.indexOf('north') != -1) {
         that.dir = Const.KAREL_NORTH;
      }
   }

   function loadLine(line) {
		var elements = line.split(":");
		assert(elements.length == 2, line + 'World file missing :');
		var key = elements[0];

		if (key == "Karel")  {
			loadKarelLine(elements[1]);
		} else if (key == "Wall")  {
			loadWallLine(elements[1]);
		} else if (key == "Beeper") {
			loadBeeperLine(elements[1]);
		} else if (key == "Tray") {
			loadTrayLine(elements[1]);
		} else if (key == "Exit") {
			loadExitLine(elements[1]);
		} 
	}

   return that;

}
