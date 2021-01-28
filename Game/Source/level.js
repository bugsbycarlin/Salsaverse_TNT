
black_screen = new Image();
black_screen.src = "Art/Extras/black_screen.png";

class Level {
  constructor(game, scene_name) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.team = this.game.team;

    console.log
    this.scene_name = scene_name;
    if (this.scene_name == "Stage") {
      this.loadLevel = this.loadStageLevel;
    } else if (this.scene_name == "Bathroom") {
      this.loadLevel = this.loadBathroomLevel;
    }

    this.fade_alpha = 0;
  }


  start() {
    this.doors = [];
    this.lines = [];
    this.things = [];
    this.npcs = [];

    this.loadLevel();

    this.drawObjects = [];
    for (var i = 0; i < this.team.length; i++) {
      this.drawObjects.push(this.team[i]);
    }
    for (var i = 0; i < this.things.length; i++) {
      this.drawObjects.push(this.things[i]);
    }
    for (var i = 0; i < this.npcs.length; i++) {
      this.drawObjects.push(this.npcs[i]);
    }

    this.mode = "fade_in";
    this.fade_alpha = 1;
  }


  update() {
    console.log(this.mode);
    if (this.mode == "fade_in") {
      this.fade_alpha -= 0.04;
      if (this.fade_alpha <= 0) {
        this.mode = "active";
      }
    } else if (this.mode == "fade_out") {
      this.fade_alpha += 0.04;
      if (this.fade_alpha >= 1) {
        // do a thing
      }
    } else if (this.mode == "active") {
      this.updateTeam();

      for (var i = 0; i < this.npcs.length; i++) {
        // this.drawObjects.push(this.npcs[i]);
        var npc = this.npcs[i];
        if (npc.update != null) {
          npc.update();
        }
      }
    }

    if (this.full_text != null && this.partial_text != null && this.partial_text != this.full_text) {
      this.partial_text = this.full_text.slice(0, this.partial_text.length + 1);
    }

    this.updateCamera();
  }

  
  render() {
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.drawImage(this.level_image, 0, 0);

    // drawImage(tune_images[gun_walk_image], character.x, character.y);
    // for (var i = this.team.length - 1; i >= 0; i--) {
    //   var teammate = this.team[i];
    //   this.drawImage(teammate.images[teammate.current_image], teammate.x, teammate.y);
    // }
    this.drawObjects.sort((a,b) => (a.y >= b.y) ? 1: -1);
    for (var i = 0; i < this.drawObjects.length; i++) {
      var object = this.drawObjects[i];
      this.drawImage(object.images[object.current_image], object.x, object.y);
    }

    this.context.font = '24px Minecraft';
    this.context.fillStyle = 'black';
    this.context.textAlign = "left";
    this.context.textBaseline = 'top';
    this.context.fillText ('A: Action', 23, 720 - 87);
    this.context.fillText ('S: Swap Characters', 23, 720 - 63);
    this.context.fillText ('Up,Down,Left,Right: Move', 23, 720 - 39);
    this.context.fillStyle = 'white';
    this.context.fillText ('A: Action', 24, 720 - 88);
    this.context.fillText ('S: Swap Characters', 24, 720 - 64);
    this.context.fillText ('Up,Down,Left,Right: Move', 24, 720 - 40);

    // Debug lines
    
    // for (var i = 0; i < this.lines.length; i++) {
    //   var line = this.lines[i];
    //   drawLine(
    //     this.context,
    //     line.color,
    //     640 + line.x1 - this.camera_x,
    //     360 + line.y1 - this.camera_y,
    //     640 + line.x2 - this.camera_x,
    //     360 + line.y2 - this.camera_y,
    //   )
    // }

    // for (var i = 0; i < this.doors.length; i++) {
    //   var door = this.doors[i];
    //   drawLine(
    //     this.context,
    //     door.color,
    //     // "FF0000",
    //     640 + door.x1 - this.camera_x,
    //     360 + door.y1 - this.camera_y,
    //     640 + door.x2 - this.camera_x,
    //     360 + door.y2 - this.camera_y,
    //   )
    // }

    if (this.partial_text != null) {
      this.context.font = '40px Minecraft';
      this.context.fillStyle = 'black';
      this.context.textAlign = "left";
      this.context.textBaseline = 'top';
      this.context.fillText (this.partial_text, 23, 23);
      this.context.fillStyle = 'white';
      this.context.fillText (this.partial_text, 24, 24);
    }

    if (this.mode == "fade_in" || this.mode == "fade_out") {
      this.context.globalAlpha = Math.max(0,Math.min(1.0,this.fade_alpha));
      this.context.drawImage(black_screen, 0, 0);
      this.context.globalAlpha = 1.0;
    }
  }


  drawText(text) {
    this.full_text = text
    this.partial_text = "";

  }


  testWalk(character, direction, test_number) {
    var x1 = character.x;
    var y1 = character.y + 40; // footing
    var x2 = character.x;
    var y2 = character.y + 40; // footing

    if (direction == "upright") {
      y2 -= 0.707 * character.walk_speed;
      x2 += 0.707 * character.walk_speed; 
    } else if (direction == "upleft") {
      y2 -= 0.707 * character.walk_speed;
      x2 -= 0.707 * character.walk_speed;
    } else if (direction == "downright") {
      y2 += 0.707 * character.walk_speed;
      x2 += 0.707 * character.walk_speed;
    } else if (direction == "downleft") {
      y2 += 0.707 * character.walk_speed;
      x2 -= 0.707 * character.walk_speed;
    } else if (direction == "down") {
      y2 += character.walk_speed;
    } else if (direction == "up") {
      y2 -= character.walk_speed;
    } else if (direction == "left") {
      x2 -= character.walk_speed;
    } else if (direction == "right") {
      x2 += character.walk_speed;
    }

    if (x2 != x1 || y2 != y1) {

      for (var i = 0; i < this.doors.length; i++) {
        var door = this.doors[i];
        var self = this;
        if (door.lineTest(x1, y1, x2, y2)) {
          console.log("bumping a door");
          console.log(door.allowed_directions);
          console.log(door.action);
          console.log(direction);
          if (door.allowed_directions.includes(direction)) {
            console.log("oh, bumping doors the right way is tight!");
            door.flashColor("#0000FF", 500);
            door.action();
            return null;
          }
        }
      }

      for (var i = 0; i < this.lines.length; i++) {
        var line = this.lines[i];
        if (line.lineTest(x1, y1, x2, y2)) {
          line.flashColor("#0000FF", 500);

          var alt_direction = direction;
          console.log("Crossing a line");
          console.log("Direction " + direction + ", test " + test_number);
          console.log(x1 + "," + y1 + " - " + x2 + "," + y2)
          console.log(line.snap_slope);

          if (line.snap_slope == 0) {
            if (direction == "up" || direction == "down") {
              alt_direction = null;
            } else if (direction == "upleft" || direction == "downleft") {
              alt_direction = "left";
            } else if (direction == "upright" || direction == "downright") {
              alt_direction = "right";
            }
          } else if (line.snap_slope == 90) {
            if (direction == "left" || direction == "right") {
              alt_direction = null;
            } else if (direction == "upleft" || direction == "upright") {
              alt_direction = "up";
            } else if (direction == "downleft" || direction == "downright") {
              alt_direction = "down";
            }
          } else if (line.snap_slope == 45) {
            if (direction == "downright" || direction == "upleft") {
              alt_direction = null;
            } else if (direction == "up" || direction == "right") {
              alt_direction = "upright";
            } else if (direction == "down" || direction == "left") {
              alt_direction = "downleft";
            }
          } else if (line.snap_slope == -45) {
            if (direction == "downleft" || direction == "upright") {
              alt_direction = null;
            } else if (direction == "up" || direction == "left") {
              alt_direction = "upleft";
            } else if (direction == "down" || direction == "right") {
              console.log("Switching to downright");
              alt_direction = "downright";
            }
          }

          if (test_number == 0) return this.testWalk(character, alt_direction, 1);
          if (test_number == 1) return alt_direction;
        }
      }
    }

    return direction;
  }


  updateTeam() {
    var keymap = this.game.keymap;
    var character = this.team[0];

    if (keymap["ArrowUp"] && keymap["ArrowRight"]) {

      character.direction = "upright";
    } else if (keymap["ArrowUp"] && keymap["ArrowLeft"]) {
      character.direction = "upleft";
    } else if (keymap["ArrowDown"] && keymap["ArrowRight"]) {
      character.direction = "downright";
    } else if (keymap["ArrowDown"] && keymap["ArrowLeft"]) {
      character.direction = "downleft";
    } else if (keymap["ArrowDown"]) {
      character.direction = "down";
    } else if (keymap["ArrowUp"]) {
      character.direction = "up";
    } else if (keymap["ArrowLeft"]) {
      character.direction = "left";
    } else if (keymap["ArrowRight"]) {
      character.direction = "right";
    } else {
      character.direction = null;
    }

    character.move();

    this.team[1].follow(character);
  }


  updateCamera() {
    var character = this.team[0];
  
    // Camera bounds
    var max_camera_x = this.level_image.width / 2 - 1280/2 - 5;
    var min_camera_x = -1 * (this.level_image.width / 2 - 1280/2) + 5;
    var max_camera_y = this.level_image.height / 2 - 720/2 - 5;
    var min_camera_y = -1 * (this.level_image.height / 2 - 720/2) + 5;

    // Right scroll
    if (character.x - this.camera_x > 1280 / 4 && this.camera_x < max_camera_x) {
      this.camera_x = Math.min(max_camera_x, character.x - 1280/4)
    }

    // Left scroll
    if (this.camera_x - character.x > 1280 / 4 && this.camera_x > min_camera_x) {
      this.camera_x = Math.max(min_camera_x, character.x + 1280/4)
    }

    // Down scroll
    if (character.y - this.camera_y > 720 / 4 && this.camera_y < max_camera_y) {
      this.camera_y = Math.min(max_camera_y, character.y - 720/4)
    }

    // Up scroll
    if (this.camera_y - character.y > 720 / 4 && this.camera_y > min_camera_y) {
      this.camera_y = Math.max(min_camera_y, character.y + 720/4)
    }
  }


  teamSwap() {
    var new_team = [];
    new_team[1] = this.team[0];
    new_team[0] = this.team[1];
    this.team[0].x = this.team[1].x;
    this.team[0].y = this.team[1].y - 10;
    this.team[0].current_image = this.team[1].current_image;
    this.team[0].history = [];
    this.team[1].history = [];
    this.game.team = new_team;
    this.team = this.game.team;
  }


  drawImage(image, x, y) {
    //
    // Draw as though drawing centered, with 0,0 at 640/360 by default,
    // then adjusting for camera.
    //
    this.context.drawImage(image, 640 + x - image.width / 2 - this.camera_x, 360 + y - image.height / 2 - this.camera_y)
  }



  handleKeyUp(ev) {
    if (ev.key === "s") {
      this.teamSwap();
    }

    // if (ev.key === "b") {
    //   this.game.scenes["Bathroom"] = new LevelScene(this.game, "Bathroom");
    //   this.game.scene = this.game.scenes["Bathroom"];
    //   this.game.scene.start();
    // }
  }
  
}


  







