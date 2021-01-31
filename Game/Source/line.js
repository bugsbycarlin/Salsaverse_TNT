

class Line {
  constructor(x1, y1, x2, y2, allowed = []) {
    if (x2 < x1) {
      this.x1 = x2
      this.y1 = y2
      this.x2 = x1
      this.y2 = y1
    } else {
      this.x1 = x1
      this.y1 = y1
      this.x2 = x2
      this.y2 = y2
    }

    // these are pixel lines, and one pixel off in X is effectively vertical
    if (Math.abs(this.x2 - this.x1) < 2) {
      this.slope = "vertical";
      this.snap_slope = 90;
    } else {
      this.slope = -1 * (this.y2 - this.y1) / (this.x2 - this.x1);
      if (Math.abs(this.slope) < 0.1) this.snap_slope = 0;
      if (this.slope < 0) this.snap_slope = -45;
      if (this.slope > 0) this.snap_slope = 45;
      if (Math.abs(this.slope) > 10) {
        this.slope = "vertical";
        this.snap_slope = 90;
      }
    }
    // console.log("Snap slope is " + this.snap_slope)

    // If it's a vertical line, for convenience, y2 is the higher value
    if (this.slope == "vertical" && this.y1 > this.y2) {
      var temp = this.y1;
      this.y1 = this.y2;
      this.y2 = temp;
    }

    this.allowed = allowed;

    this.color = "#00FF00";
    this.original_color = "#00FF00";

    //this.flashColor("#0000FF", 2000);
  }

  flashColor(color, duration) {
    this.color = color;
    var self = this;
    setTimeout(function() {
      self.color = self.original_color;
    }, duration);
  }

  lineTest(x3, y3, x4, y4) {
    //
    // Return true if line x3,y3 - x4,y4 crosses this line segment.
    //
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    var x1 = this.x1;
    var y1 = this.y1;
    var x2 = this.x2;
    var y2 = this.y2;

    // Determinant denominator will be infinite for parallel lines,
    // In which case we just check whether either point of the line
    // Is really close to this line.
    if (Math.abs((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)) < 0.01) {
      if (this.circleTest(x3, y3, 5.0)) return true;
      if (this.circleTest(x4, y4, 5.0)) return true;
      return false;
    }

    var x5, y5;
    [x5, y5] = [
      Math.floor(((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) 
          / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4))),
      Math.floor(((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4))
          / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)))
    ];

    var in_segment = true;
    var g = 4; // thickness fudge to beat jittering
    if (x5 < x1 - g && x5 < x2 - g) in_segment = false;
    if (x5 > x1 + g && x5 > x2 + g) in_segment = false;
    if (y5 < y1 - g && y5 < y2 - g) in_segment = false;
    if (y5 > y1 + g && y5 > y2 + g) in_segment = false;
    if (x5 < x3 - g && x5 < x4 - g) in_segment = false;
    if (x5 > x3 + g && x5 > x4 + g) in_segment = false;
    if (y5 < y3 - g && y5 < y4 - g) in_segment = false;
    if (y5 > y3 + g && y5 > y4 + g) in_segment = false;

    return in_segment;
  }

  circleTest(x3, y3, r) {
    //
    // Does the circle cross this line?
    //
    var x1 = this.x1;
    var y1 = this.y1;
    var x2 = this.x2;
    var y2 = this.y2;
    if (distance(x3, y3, x1, y1) <= r) return true;
    if (distance(x3, y3, x2, y2) <= r) return true;
    var x4,y4;
    [x4,y4] = closestPoint(x1, y1, x2, y2, x3, y3)
    var in_segment = true;
    if (x4 < x1 && x4 < x2) in_segment = false;
    if (x4 > x1 && x4 > x2) in_segment = false;
    if (y4 < y1 && y4 < y2) in_segment = false;
    if (y4 > y1 && y4 > y2) in_segment = false;
    if (in_segment == false) return false;
    return (distance(x4, y4, x3, y3) <= r);
  }
}

function closestPoint(x1, y1, x2, y2, x3, y3) {
  //
  // Return the closest point on x1,y1-x2,y2 to point x3,y3
  //
  if (Math.abs(x2 - x1) < 2) {
    return [x1, y3];
  } else if (Math.abs(y2 - y1) < 2) {
    return [x3, y1];
  } else {
    var slope = (y2 - y1) / (x2 - x1);
    var perpendicular_slope = -1.0 / slope;
    // Line 1 equation is y1 = slope * x1 + b1
    // So,
    var b1 = y1 - slope * x1;
    // Line 1 equation is y = slope * x + y1 - slope * x1
    // Similarly
    // Line 2 equation is y = perpendicular_slope * x + y3 - perpendicular_slope * x3
    // To find the intersection, set the equations equal and solve for x:
    // slope * x + y1 - slope * x1 = perpendicular_slope * x + y3 - perpendicular_slope * x3
    // So,
    var x = (y3 - perpendicular_slope * x3 - y1 + slope * x1) / (slope - perpendicular_slope);
    var y = slope * x + y1 - slope * x1;
    return [Math.floor(x), Math.floor(y)];
  }
}

function distance(x1, y1, x2, y2) {
  var x_diff = Math.abs(x1 - x2);
  var y_diff = Math.abs(y1 - y2);
  return Math.sqrt(x_diff*x_diff + y_diff*y_diff);
}

function drawLine(context, color, x1, y1, x2, y2) {
  context.strokeStyle = color;
  context.lineWidth = 2;
  
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}