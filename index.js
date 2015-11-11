// define some globals
var rows = [];
var slopes = {};
var startingElevation;
var startTime = new Date();

// read the map
require('fs').readFile('map.txt', 'utf8', function(err, data) {
  if (err) throw err;
  
  // get the width and height of the map
  var lines = data.split("\n");
  var dimensions = lines.shift().split(" ");
  var width = dimensions[0], height = dimensions[1]; //
  
  // put this map into a 2-dimensional array
  lines.forEach(function(element, index, array) {
    if (element.length) {
      // make sure each element in this array is a number so we can do math on it
      rowArray = element.split(" ").map(function(number) { return Number(number); });
      rows.push(rowArray);
    }
  });
  
  // explore all possible routes at each potential starting point on the map
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      startingElevation = getElevation(x, y);
      rideTheSlope(x, y, 0, startingElevation);
    }
  }
  
  // we now have an object that has kept track of the best slopes, with the keys of the
  // object being the length of the slope, and the value being an array of objects
  // that describe each slope of that length
  var longestSlopeLength = Math.max.apply(this, Object.keys(slopes));
  var bestSlope = slopes[longestSlopeLength].pop();
  console.log("\nThe best slope has a length of " + bestSlope.length + " with a drop of " + bestSlope.drop + ".");
  
  // for fun, let's see how long this took
  var endTime = new Date();
  var calculationTime = endTime - startTime;
  console.log("Calculated in " + calculationTime/1000 + " seconds.");
});

/**
 * Starting at a certain point on the map, and examine all possible points around it and determine is there is
 * another place to go. First calculate the current elevation, then compare it with the elevation of surrounding
 * points. When there is nowhere else to go, we have reached the end of the slope, so we can record the length
 * and drop of that slope.
 * 
 * @param {Number} currentX The x-coordinate to investigate.
 * @param {Number} currentY The y-coordinate to investigate.
 * @param {Number} currentSlopeLength The length of the current slope being tracked.
 * @param {Number} currentElevation The elevation of the current point.
 */
function rideTheSlope(currentX, currentY, currentSlopeLength, currentElevation) {
    currentSlopeLength++; // if we are here, it means we have encountered a new part of the slope
    var directions = ['north', 'east', 'south', 'west'];
    var nextX;
    var nextY;
    var validCandidates = 0; // keep track of the number of possible directions to go
    // for all possible directions, check if the eleveation goes down, if not, do nothing
    for (var i = 0; i < directions.length; i++) {
      switch(directions[i]) {
        case 'north':
          nextX = currentX;
          nextY = currentY-1;
          break;
        case 'east':
          nextX = currentX+1;
          nextY = currentY;
          break;
        case 'south':
          nextX = currentX;
          nextY = currentY+1;
          break;
        case 'west':
          nextX = currentX-1;
          nextY = currentY;
          break;
      }
      var nextElevation = getElevation(nextX, nextY);
      if (nextElevation !== false) {
        // this direction has a defined height. i.e. we are not going to move off the edge of the map
        if (nextElevation < currentElevation) {
          // the elevation of this candidate is lower than the current one
          // so, let's make note of the fact that we found another place to go from
          // the current point, and then explore further in that direction
          validCandidates++;
          rideTheSlope(nextX, nextY, currentSlopeLength, nextElevation); // go!
        }
      }
    }
    if (!validCandidates) {
      // we have checked all possible directions and we didn't find any other places to go.
      // so, this is the end of the slope. let's record how long it was and what the drop was.
      if (!isDefined(slopes[currentSlopeLength])) slopes[currentSlopeLength] = [];
      slopes[currentSlopeLength].push({
        start: startingElevation,
        end: currentElevation,
        drop: startingElevation - currentElevation,
        length: currentSlopeLength
      });
    }
  //}
}

/**
 * Retrieves the elevation at any given point.
 * 
 * @param {Number} x Horizontal coordinate of the map.
 * @param {Number} y Vertical coordinate of the map.
 * 
 * @return {Number|Boolean} The elevation of the given point, or false if one doesn't exist.
 */
function getElevation(x, y) {
  if (isDefined(rows[y])) {
    if (isDefined(rows[y][x])) {
      return rows[y][x];
    }
  }
  
  return false;
}

function isDefined(data) { return typeof data !== 'undefined'}