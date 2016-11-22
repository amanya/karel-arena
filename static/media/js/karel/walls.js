
// Walls class	
function Walls(rows, cols) {

   var that = {};

   that.walls = new Array();
   for (var i = 0; i < rows; i++) {
       that.walls[i] = new Array();
       for (var j = 0; j < cols; j++) {
           that.walls[i][j] = 0;
        }
   }

	that.addWall = function(r, c) {
		that.walls[r][c] = 1;
	}

	that.wall = function(r, c) {
		return that.walls[r][c] != 0;
	}

	that.isMoveValid = function(startR, startC, endR, endC) {
	   if(endC < 0 || endC >= cols) return false;
		if(endR < 0 || endR >= rows) return false;

		var dRow = Math.abs(endR - startR);
		var dCol = Math.abs(endC - startC);
		if (dRow + dCol != 1) return false; 
		
		if(startC + 1 == endC && that.walls[endR][endC]) return false;
		if(startC - 1 == endC && that.walls[endR][endC]) return false;

		if(startR + 1 == endR && that.walls[endR][endC]) return false;
		if(startR - 1 == endR && that.walls[endR][endC]) return false;

		return true;
	}

	that.deepCopy = function() {
      var newModel = Walls(rows, cols);
      newModel.walls = deepCopyUtil(that.walls);
      return newModel;
	}

	return that;

}
