
var default_walk_speed = 6;
var walk_frame_time = 175;

var load_sprites = {}
load_sprites["Gun"] = ["down", "up", "left", "right", "downleft", "downright", "upleft", "upright"];
load_sprites["Tune"] = ["down", "up", "left", "right", "downleft", "downright", "upleft", "upright"];
load_sprites["Mohawk_Man"] = ["down", "up", "left", "right"];
load_sprites["Mohawk_Man_Ice"] = ["down", "up", "left", "right"];
load_sprites["Mohawk_Man_Orange"] = ["down", "up", "left", "right"];
load_sprites["Punk_Lady"] = ["down", "up"];
load_sprites["Punk_Lady_2"] = ["down", "up"];
load_sprites["Bat_Girl"] = ["down", "up"];
load_sprites["Walking_Guy"] = ["down", "up"];
load_sprites["Walking_Guy_Red"] = ["down", "up"];
load_sprites["Horse"] = ["down", "up"];
load_sprites["Walking_Lady"] = ["left", "right", "up"];
load_sprites["Rabbit"] = ["left", "right", "up"];
load_sprites["Rabbit_2"] = ["left", "right", "up"];
load_sprites["Bathroom_Guy"] = ["down"];


class Character {
  constructor(canvas, level, sprite_name, name, x=0, y=0, update=null, action=null) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.x = x;
    this.y = y;

    this.name = name;
    this.sprite_name = sprite_name;

    this.radius = 40;

    this.direction = "down";

    this.walk_frame_time = walk_frame_time;

    this.update = update;
    this.action = action;

    this.images = [];
    for (const element of load_sprites[sprite_name]) {
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


  move(testwalk_number = 0) {

    this.direction = this.level.testWalk(this, this.direction, testwalk_number);

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


  randomWalk(direction_set) {
    if (this.last_walk_change == null) {
      this.last_walk_change = Date.now();
      this.direction = null;
      this.walk_speed = 3;
    }

    if (Date.now() - this.last_walk_change > 500) {
      this.last_walk_change = Date.now();
      var dice = Math.floor(Math.random() * 100);

      if (direction_set == "updown") {
        if (dice < 60) {
          this.direction = null;
        } else if (dice < 80) {
          this.direction = "up"
        } else {
          this.direction = "down";
        }
      } else if (direction_set == "leftright") {
        if (dice < 60) {
          this.direction = null;
        } else if (dice < 80) {
          this.direction = "left"
        } else {
          this.direction = "right";
        }
      } else if (direction_set == "updownleftright") {
        if (dice < 60) {
          this.direction = null;
        } else if (dice < 70) {
          this.direction = "up"
        } else if (dice < 80) {
          this.direction = "down";
        } else if (dice < 90) {
          this.direction = "left";
        } else {
          this.direction = "right";
        }
      }
    }

    this.move(1);
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
    } else if (Date.now() - this.last_image_time > this.walk_frame_time) {
      if (this.current_image == f0) {
        this.current_image = f1;
      } else {
        this.current_image = f0;
      }
      this.last_image_time = Date.now();
    }
  }
}