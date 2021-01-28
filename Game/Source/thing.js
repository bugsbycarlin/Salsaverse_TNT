

class Thing {
  constructor(x, y, radius, picture, update, action) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.update = update;
    this.action = action;

    this.name = picture;
    this.images = [];
    this.images["static"] = new Image();
    this.images["static"].src = "Art/Things/" + picture + ".png";

    this.current_image = "static";
  }

  // circleTest(x3, y3, r) {
  //   //
  //   // Does the circle cross this line?
  //   //
  //   var x1 = this.x1;
  //   var y1 = this.y1;
  //   var x2 = this.x2;
  //   var y2 = this.y2;
  //   if (distance(x3, y3, x1, y1) <= r) return true;
  //   if (distance(x3, y3, x2, y2) <= r) return true;
  //   var x4,y4;
  //   [x4,y4] = closestPoint(x1, y1, x2, y2, x3, y3)
  //   var in_segment = true;
  //   if (x4 < x1 && x4 < x2) in_segment = false;
  //   if (x4 > x1 && x4 > x2) in_segment = false;
  //   if (y4 < y1 && y4 < y2) in_segment = false;
  //   if (y4 > y1 && y4 > y2) in_segment = false;
  //   if (in_segment == false) return false;
  //   return (distance(x4, y4, x3, y3) <= r);
  // }
}
