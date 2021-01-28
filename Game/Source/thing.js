

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

  // collisionTest(x2, y2) {
  //   //
  //   // Does x2, y2 come within this.radius of this thing?
  //   //
  //   return (distance(this.x1, this.y1, this.x2, this.y2) <= this.radius);
  // }
}
