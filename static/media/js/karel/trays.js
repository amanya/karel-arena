

// that.trays class	
function Trays(rows, cols) {

   var that = {};
	
	that.trays = new Array();
	for (var i = 0; i < rows; i++) {
		that.trays[i] = new Array();
		for (var j = 0; j < cols; j++) {
			that.trays[i][j] = 0;	
		}
	}	

	that.equals = function(other) {
      for (var i = 0; i < rows; i++) {
		   for (var j = 0; j < cols; j++) {
			   if(that.trays[i][j] != other.trays[i][j]) {
			      return false;
		      }	
		   }
	   }	
      return true;
	}

	that.trayPresent = function(r, c) {
		return that.trays[r][c] > 0;
	}

    that.trayCapacity = function(r, c) {
        return that.trays[r][c];
    }

	that.putTray = function(r, c, cap) {
		that.trays[r][c] = cap;
	}

	that.deepCopy = function() {
      var newModel = Trays(rows, cols);
      newModel.trays = deepCopyUtil(that.trays);
      return newModel;
	}

	return that;
}


