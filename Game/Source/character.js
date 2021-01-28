
var default_walk_speed = 6;
var walk_frame_time = 175;

class Character {
  constructor(canvas, level, sprite_name, name, x=0, y=0, update=null) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.x = x;
    this.y = y;

    this.name = name;
    this.sprite_name = sprite_name;

    this.direction = "down";

    if (update != null) {
      this.update = update;
    }

    this.images = [];
    for (const element of ["down", "up", "left", "right", "downleft", "downright", "upleft", "upright"]) {
      for (const val of ["0", "1"]) {
        this.images[element + "_" + val] = new Image();
        this.images[element + "_" + val].src = "Art/" + this.sprite_name + "/" + element + "_" + val + ".png";
      }
    }

    this.current_image = "down_0";
    this.last_image_time = null;

    this.history = [];

    this.level = level;

    this.walk_speed = default_walk_speed;
  }


  move() {

    this.direction = this.level.testWalk(this, this.direction, 0);

    if (this.direction != null) {
      this.history.push([this.x, this.y, this.direction]);
      if (this.history.length > 10) {
        this.history.shift();
      }
    }

    if (this.direction == "upright") {
      this.y -= 0.707 * this.walk_speed;
      this.x += 0.707 * this.walk_speed; 
    } else if (this.direction == "upleft") {
      this.y -= 0.707 * this.walk_speed;
      this.x -= 0.707 * this.walk_speed;
    } else if (this.direction == "downright") {
      this.y += 0.707 * this.walk_speed;
      this.x += 0.707 * this.walk_speed;
    } else if (this.direction == "downleft") {
      this.y += 0.707 * this.walk_speed;
      this.x -= 0.707 * this.walk_speed;
    } else if (this.direction == "down") {
      this.y += this.walk_speed;
    } else if (this.direction == "up") {
      this.y -= this.walk_speed;
    } else if (this.direction == "left") {
      this.x -= this.walk_speed;
    } else if (this.direction == "right") {
      this.x += this.walk_speed;
    }

    if (this.direction != null) {
      this.walkAnimation();
    }
  }


  follow(character) {
    if (character.history.length >= 10) {
      var element = character.history[0];
      this.x = element[0];
      this.y = element[1];
      this.direction = element[2];
      if (character.direction != null) {
        this.walkAnimation();
      }
    }
  }


  walkAnimation() {
    var f0 = this.direction + "_0";
    var f1 = this.direction + "_1";
    if (this.current_image != f0 && this.current_image != f1) {
      this.current_image = f0
      this.last_image_time = Date.now();
    } else if (this.last_image_time == null) {
      this.last_image_time = Date.now();
    } else if (Date.now() - this.last_image_time > walk_frame_time) {
      if (this.current_image == f0) {
        this.current_image = f1;
      } else {
        this.current_image = f0;
      }
      this.last_image_time = Date.now();
    }
  }
}