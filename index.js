require('fs').readFile('map.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var lines = data.split("\n");
  var dimensions = lines.shift().split(" ");
  var width = dimensions[0], height = dimensions[1];

  var rows = [], cols = [];
  for (var i = 0; i < width; i++) {
    cols[i] = [];
  }

  lines.forEach(function(element, index, array) {
    if (element.length) {
      rowArray = element.split(" ");
      rows.push(rowArray);

      for (var i = 0; i < rowArray.length; i++) {
        cols[i][index] = rowArray[i];
      }
    }
  });
  
  var start;
  var candidates = [];
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      start = rows[x][y];
      candidates = getCandidates(x, y, rows);
      console.log(candidates);
      break;
    }
    break;
  }
});
function isDefined(data) { return typeof data !== 'undefined'}
function isGreater(first, second) { return second > first; }

function getCandidates(x, y, rows) {
  var initial = rows[x][y];
  var nextX = rows[x+1], nextY = rows[y+1], prevX = rows[x-1], prevY = rows[y-1];
  // top
  if (isDefined(prevY)) {
    if (isGreater(initial, prevY) {
        //code
    }
  }
  var filter = function(init, value) {
    return value > init ? value : false;
  }
  
  return {
    top: isDefined(prevY) &
    right: filter(rows[x][y], rows[x+1][y]) ? rows[x+1][y] : false,
    bottom: filter(rows[x][y], rows[x][y-1]) ? rows[x][y-1] : false,
    left: filter(rows[x][y], rows[x-1][y]) ? rows[x-1][y] : false
  }
}