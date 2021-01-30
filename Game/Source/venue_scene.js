
class VenueScene {
  constructor(game) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.start_time = Date.now();
    this.pulse_time = this.start_time;

    this.scene_name = "Show";

    this.characters = [];
    this.bouncers = [];
    this.dancers = [];

    this.bpm = 105;
    this.period = 2.0 * 60000.0 / 105.0;

    this.fade_alpha = 1.0;
    this.exit_alpha = 0.01;

    this.phase = 1;

    this.dance = "right";
  }


  start() {
    this.makeCharacters();
    this.buildScene();

    this.start_time = Date.now();
    this.mode = "active";

    var self = this;

    this.game.stopMusic();
    this.game.setMusic("adventure", function() {
      self.game.gotoScene("Stage", "post_show_start");
    });

    // setTimeout(function() {
    //   self.game.gotoScene("Stage", "post_show_start");
    // }, 5000);
  }


  makeCharacter(archetype) {
    var x = Math.floor(Math.random() * (this.floor_x2 - this.floor_x1)) + this.floor_x1;
    var y = Math.floor(Math.random() * (this.floor_y2 - this.floor_y1)) + this.floor_y1;
    
    var self = this;
    var character = new Character(canvas, this, archetype, "", x, y, null, null);
    character.current_image = "up_0";
    this.characters.push(character);
  }


  makeCharacters() {
    this.floor_x1 = 480 - 960;
    this.floor_x2 = 1400 - 960;
    this.floor_y1 = 520 - 540;
    this.floor_y2 = 820 - 540;

    this.makeCharacter("Gun");
    this.makeCharacter("Tune");
    this.makeCharacter("Bat_Girl");
    if (self.game.properties["rabbit_wigged_out"] != null) {
      this.makeCharacter("Rabbit");
    }

    var chars = [
    "Mohawk_Man",
    "Mohawk_Man_Ice",
    "Mohawk_Man_Orange",
    "Punk_Lady",
    "Punk_Lady_2",
    "Walking_Guy",
    "Walking_Guy_Red",
    "Horse",
    "Walking_Lady",
    "Rabbit_2"];
    for (const element of chars) {
      for (var i = 0; i < 5; i++) {
        this.makeCharacter(element);
      }
    }

    this.characters.sort((a,b) => (a.y >= b.y) ? 1: -1);

    for (var i = 0; i < this.characters.length; i++) {
      var character = this.characters[i];
      character.vy = 0;
      character.vx = 0;
      character.floor_y = character.y;
    }

    this.bouncers.push(new Character(canvas, this, "Bathroom_Guy", "Bathroom_Guy", 680 - 960, 470 - 540, null, null));
    this.bouncers.push(new Character(canvas, this, "Bathroom_Guy", "Bathroom_Guy", 1210 - 960, 470 - 540, null, null));
  
    this.dancers.push(new Character(canvas, this, "TNT_Chance", "Chance", 710 - 960, 310 - 540, null, null));
    this.dancers.push(new Character(canvas, this, "TNT_Lance", "Lance", 835 - 960, 310 - 540, null, null));
    this.dancers.push(new Character(canvas, this, "TNT_Rance", "Rance", 960 - 960, 310 - 540, null, null));
    this.dancers.push(new Character(canvas, this, "TNT_Vance", "Vance", 1085 - 960, 310 - 540, null, null));
    this.dancers.push(new Character(canvas, this, "TNT_Greg", "Greg", 1210 - 960, 310 - 540, null, null));
    for (var i = 0; i < 5; i++) {
      this.dancers[i].vy = 0;
      this.dancers[i].vx = 0;
      this.dancers[i].floor_y = this.dancers[i].y;
    }
  }


  buildScene() {
    this.level_image = new Image();
    this.level_image.src = "Art/Levels/theater_stage.png";

    this.lit_stage = new Image();
    this.lit_stage.src = "Art/Levels/lit_stage.png";

    this.tnt_1 = new Image();
    this.tnt_1.src = "Art/Extras/tnt_1.png";
    this.tnt_2 = new Image();
    this.tnt_2.src = "Art/Extras/tnt_2.png";
    this.tnt_3 = new Image()
    this.tnt_3.src = "Art/Extras/tnt_3.png";
    this.tnt_1_grey = new Image();
    this.tnt_1_grey.src = "Art/Extras/tnt_1_grey.png";
    this.tnt_2_grey = new Image();
    this.tnt_2_grey.src = "Art/Extras/tnt_2_grey.png";
    this.tnt_3_grey = new Image();
    this.tnt_3_grey.src = "Art/Extras/tnt_3_grey.png";

    this.wires = new Image();
    this.wires.src = "Art/Extras/wires.png";

    this.camera_x = 0;
    this.camera_y = 180;

    this.lights = [];
    this.lights["teal"] = new Image();
    this.lights["teal"].src = "Art/Extras/wheel_teal.png";
    this.lights["pink"] = new Image();
    this.lights["pink"].src = "Art/Extras/wheel_pink.png";
    this.lights["yellow"] = new Image();
    this.lights["yellow"].src = "Art/Extras/wheel_yellow.png";
    this.lights["green"] = new Image();
    this.lights["green"].src = "Art/Extras/wheel_green.png";

  }


  update() {
    if (this.camera_y > -180) {
      this.camera_y -= 2;
    }

    if (Date.now() - this.start_time > 9430) {
      this.phase = 2
    }

    if (this.phase == 1) {
      if (this.fade_alpha > 0.5) {
        this.fade_alpha -= 0.02;
      }
    } else if (this.phase == 2) {
      this.fade_alpha = 0.83;
    }

    if (Date.now() - this.start_time > 45400) {
      this.exit_alpha += 0.02;
      if (this.exit_alpha > 1.0) this.exit_alpha = 1.0;
    }

    if (Date.now() - this.pulse_time >= 571) {
      this.pulse_time = Date.now();
    
      for (var i = 0; i < this.characters.length; i++) {
        var character = this.characters[i];
        var dice = Math.floor(Math.random() * 100);
        if (dice < 10) {
          character.vy = 0;
          character.vx = 0;
        } else if (dice < 55) {

          character.vy = -5;
          character.vx = 0.5;
        } else {
          character.vy = -5;
          character.vx = -0.5;
        }
      }

      for (var i = 0; i < 5; i++) {
        var image = "down_0";
        var shift = 1;
        if (this.dance == "left") {
          shift = -1;
          image = "down_1";
        } 
        this.dancers[i].vx += shift;
        this.dancers[i].current_image = image;

        if (Date.now() - this.start_time > 9430) {
          this.dancers[i].vy = Math.floor(Math.random() * 9) - 4;
          if (this.dancers[i].y < -400) {
            this.dancers[i].vy = 2;
          }
          if (this.dancers[i].y > 0) {
            this.dancers[i].vy = -2;
          }
        }
      }
      if (this.dance == "right") {
        this.dance = "left";
      } else {
        this.dance = "right";
      }
    }

    if (Date.now() - this.start_time > 45400) {
      for (var i = 0; i < 5; i++) {
        this.dancers[i].vy -= (1.0 + 0.2 * i);
      }
    }

    for (var i = 0; i < this.characters.length; i++) {
      var character = this.characters[i];
      character.y += character.vy;
      character.x += character.vx;
      character.vx *= 0.9;
      character.vy += 1.2;
      if (character.y > character.floor_y) {
        character.y = character.floor_y;
      }
    }

    for (var i = 0; i < 5; i++) {
      this.dancers[i].x += this.dancers[i].vx;
      this.dancers[i].vx *= 0.9;
      this.dancers[i].y += this.dancers[i].vy;
    }
  }

  
  render() {
    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.drawImage(this.level_image, 0, 0, "level");

    this.drawImage(this.bouncers[0].images[this.bouncers[0].current_image], this.bouncers[0].x, this.bouncers[0].y);
    this.drawImage(this.bouncers[1].images[this.bouncers[1].current_image], this.bouncers[1].x, this.bouncers[1].y)

    for (var i = 0; i < this.characters.length; i++) {
      var character = this.characters[i];
      this.drawImage(character.images[character.current_image], character.x, character.y);
    }


    // this.context.font = "60px Minecraft";
    // this.context.fillStyle = "white";
    // this.context.textBaseline = "top";
    // this.context.textAlign = "center";
    // this.context.fillText ("NOW THERE IS SHOW", 640, 325);
    this.context.globalAlpha = Math.max(0,Math.min(1.0,this.fade_alpha));
    this.context.drawImage(black_screen, 0, 0);
    this.context.globalAlpha = 1.0;

    this.drawImage(this.lit_stage, 0, 0);

    var current_time = Date.now() - this.start_time;

    this.drawImage(this.wires, 920 - 960, 70 - 540);

    if (current_time <= 9430 - 571 * 2) {
      this.drawImage(this.tnt_1_grey, 820 - 960, 40 - 540);
    } else {
      this.drawImage(this.tnt_1, 820 - 960, 40 - 540);
    }
    if (current_time <= 9430 - 571) {
      this.drawImage(this.tnt_2_grey, 1020 - 960, 50 - 540);
    } else {
      this.drawImage(this.tnt_2, 1020 - 960, 50 - 540);
    }
    if (current_time <= 9430) {
      this.drawImage(this.tnt_3_grey, 930 - 960, 120 - 540);
    } else {
      this.drawImage(this.tnt_3, 930 - 960, 120 - 540);
    }

    for (var i = 0; i < 5; i++) {
      var image = this.dancers[i].images[this.dancers[i].current_image]
      drawLine(
        this.context,
        "#000000",
        640 + this.dancers[i].x - this.camera_x,
        -10,
        640 + this.dancers[i].x - this.camera_x,
        360 + this.dancers[i].y - this.camera_y,
      )
      this.drawImage(image, this.dancers[i].x, this.dancers[i].y);
    }

    if (this.phase == 1) {

      var period_portion = (current_time / this.period - Math.floor(current_time / this.period));
      var angle = period_portion * 2 * Math.PI;

      this.context.translate(-20, 180);
      this.context.rotate(angle);
      
      this.context.drawImage(this.lights["teal"], -1600, -1600);  
      
      this.context.rotate(-angle);
      this.context.translate(20, -180);


      var period_portion_2 = ((current_time + this.period / 2.0) / this.period - Math.floor(current_time / this.period));
      var angle_2 = period_portion_2 * 2 * Math.PI;

      this.context.translate(1300, 180);
      this.context.rotate(-angle_2);
      
      this.context.drawImage(this.lights["yellow"], -1600, -1600);  
      
      this.context.rotate(angle_2);
      this.context.translate(-1300, -180);
    } else if (this.phase == 2) {
      var color_1 = "teal";
      var color_2 = "yellow";
      if (Math.floor(current_time / (this.period / 2.0)) % 2 == 1) {
        color_1 = "pink";
        color_2 = "green";
      }

      var period_portion = ((2.0 * current_time) / this.period - Math.floor(current_time / this.period));
      var angle = period_portion * 2 * Math.PI;

      this.context.translate(-20, 180);
      this.context.rotate(angle);
      
      this.context.drawImage(this.lights[color_1], -1600, -1600);  
      
      this.context.rotate(-angle);
      this.context.translate(20, -180);

      var period_portion_2 = (2.0 * (current_time + this.period / 2.0) / this.period - Math.floor(current_time / this.period));
      var angle_2 = period_portion_2 * 2 * Math.PI;

      this.context.translate(1300, 180);
      this.context.rotate(-angle_2);
      
      this.context.drawImage(this.lights[color_2], -1600, -1600);  
      
      this.context.rotate(angle_2);
      this.context.translate(-1300, -180);
    }

    if (current_time >= 45400) {
      this.context.globalAlpha = Math.max(0,Math.min(1.0,this.exit_alpha));
      this.context.drawImage(black_screen, 0, 0);
      this.context.globalAlpha = 1.0;
    }
    
  } 

  drawImage(image, x, y, debug_string = "") {
    //
    // Draw as though drawing centered, with 0,0 at 640/360 by default,
    // then adjusting for camera.
    //
    try {
      this.context.drawImage(image, 640 + x - image.width / 2 - this.camera_x, 360 + y - image.height / 2 - this.camera_y)
    } catch(error) {
      console.log("ERROR: failed to draw " + debug_string);
    }
  } 
}


  







