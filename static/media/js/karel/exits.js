

// that.exits class	
function Exits(rows, cols) {

   var that = {};
	
	that.exits = new Array();
	for (var i = 0; i < rows; i++) {
		that.exits[i] = new Array();
		for (var j = 0; j < cols; j++) {
			that.exits[i][j] = 0;	
		}
	}	

	that.equals = function(other) {
      for (var i = 0; i < rows; i++) {
		   for (var j = 0; j < cols; j++) {
			   if(that.exits[i][j] != other.exits[i][j]) {
			      return false;
		      }	
		   }
	   }	
      return true;
	}

	that.exitPresent = function(r, c) {
		return that.exits[r][c] > 0;
	}

	that.putExit = function(r, c) {
		that.exits[r][c] = 1;
	}

	that.deepCopy = function() {
      var newModel = Exits(rows, cols);
      newModel.exits = deepCopyUtil(that.exits);
      return newModel;
	}

	return that;
}

