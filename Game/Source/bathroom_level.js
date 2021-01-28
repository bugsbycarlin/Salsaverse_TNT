
Level.prototype.loadBathroomLevel = function() {
    this.level_image = new Image();
    this.level_image.src = "Art/Levels/bathroom.png";

    this.camera_x = 0;
    this.camera_y = 0;

    this.team[0].x = 830 - 640;
    this.team[0].y = 430 - 360;
    this.team[0].level = this;
    this.team[0].history = [];
    this.team[1].x = 850 - 640;
    this.team[1].y = 425 - 360;
    this.team[1].level = this;
    this.team[1].history = [];

    this.things.push(new Thing(477 - 640, 345 - 360, 30, "toilet", null, null));
    this.things.push(new Thing(650 - 640, 345 - 360, 30, "toilet", null, null));
    this.things.push(new Thing(750 - 640, 365 - 360, 30, "bathroom_guy", null, null));
    this.things.push(new Thing(300 - 640, 420 - 360, 30, "sink", null, null));
    this.things.push(new Thing(250 - 640, 470 - 360, 30, "sink", null, null));
    this.things.push(new Thing(995 - 640, 545 - 360, 30, "toilet_paper", null, null));

    // Verticals
    this.lines.push(new Line(380 - 640, 400 - 360, 890 - 640, 400 - 360));
    this.lines.push(new Line(160 - 640, 580 - 360, 1110 - 640, 580 - 360));

    // Side walls
    this.lines.push(new Line(860 - 640, 385 - 360, 1070 - 640, 595 - 360));
    this.lines.push(new Line(415 - 640, 385 - 360, 205 - 640, 595 - 360));

    var self = this;
    this.doors.push(new Door(
      870 - 640,
      400 - 360,
      955 - 640,
      485 - 360,
      ["up", "right", "upright"],
      function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          this.game.gotoScene("Stage", "bathroom_start");
        }, 800);
      }
    ));

  }
