
Level.prototype.loadStageLevel = function() {
  this.level_image = new Image();
  this.level_image.src = "Art/Levels/theater_stage.png";

  this.camera_x = 0;
  this.camera_y = 0;

  this.team[0].x = 1680 - 960;
  this.team[0].y = 580 - 540;
  this.team[0].level = this;
  this.team[0].history = [];
  this.team[1].x = 1700 - 960;
  this.team[1].y = 577 - 540;
  this.team[1].level = this;
  this.team[1].history = [];

  // NPCs
  this.npcs.push(new Character(canvas, this, "Walking_Guy", "Steve", 870 - 960, 680 - 540,
    function() {
      if (this.last_walk_change == null) {
        this.last_walk_change = Date.now();
        this.direction = null;
        this.walk_speed = 3;
      }

      if (Date.now() - this.last_walk_change > 500) {
        this.last_walk_change = Date.now();
        var dice = Math.floor(Math.random() * 100);
        if (dice < 60) {
          this.direction = null;
        } else if (dice < 80) {
          this.direction = "up"
        } else {
          this.direction = "down";
        }
      }

      this.move();
  }));
  
  // The world's most public toilet
  this.things.push(new Thing(430 - 960, 860 - 540, 30, "toilet", null, null));

  //Stage verticals
  this.lines.push(new Line(750 - 960, 520 - 540, 1145 - 960, 520 - 540));
  this.lines.push(new Line(1165 - 960, 480 - 540, 1655 - 960, 480 - 540));
  this.lines.push(new Line(235 - 960, 480 - 540, 730 - 960, 480 - 540));

  //Stage flanges at 45 degrees
  this.lines.push(new Line(1145 - 960, 520 - 540, 1185 - 960, 480 - 540));
  this.lines.push(new Line(750 - 960, 520 - 540, 705 - 960, 475 - 540));

  //Side walls at 45 degrees
  this.lines.push(new Line(0 - 960, 725 - 540, 255 - 960, 480 - 540, "dingus"));
  this.lines.push(new Line(1635 - 960, 480 - 540, 1920 - 960, 765 - 540));

  // Verticals at bottom
  this.lines.push(new Line(30 - 960, 695 - 540, 30 - 960, 1150 - 540));
  this.lines.push(new Line(1890 - 960, 730 - 540, 1890 - 960, 1150 - 540));

  // Horizontal at bottom
  this.lines.push(new Line(0 - 960, 1050 - 540, 1920 - 960, 1050 - 540));

  // Bathroom door
  var self = this;
  this.doors.push(new Door(
    45 - 960,
    685 - 540,
    115 - 960,
    615 - 540,
    ["up", "left", "upleft"],
    function() {
      self.mode = "fade_out";
      self.fade_alpha = 0;
      setTimeout(function() {
        // if (this.game.scenes["Bathroom"] == null) {
        //   this.game.scenes["Bathroom"] = new Level(this.game, "Bathroom");
        // }
        // this.game.scene = this.game.scenes["Bathroom"];
        // this.game.scene.start();
        this.game.gotoScene("Bathroom");
      }, 800);
    }
  ));

  var stage_sound = "#deep_rough";
  $(stage_sound).prop("volume", 0.3);
  $(stage_sound).trigger("play");

  this.drawText("It already happened. It is what it is. Please accept it. Okay? - - - Okay.")
}
