
Level.prototype.loadBathroomLevel = function() {
  this.level_image = new Image();
  this.level_image.src = "Art/Levels/bathroom.png";

  this.camera_x = 0;
  this.camera_y = 0;

  this.characterBounds = [420 - 640, 860 - 640, 400 - 360, 550 - 360];

  this.team[0].x = 830 - 640;
  this.team[0].y = 430 - 360;
  this.team[0].level = this;
  this.team[0].history = [];
  this.team[1].x = 850 - 640;
  this.team[1].y = 425 - 360;
  this.team[1].level = this;
  this.team[1].history = [];

  var self = this;

  this.things.push(new Thing(477 - 640, 345 - 360, 40, "toilet", null, function() {
    self.game.properties["use_toilet_without_washing"] = 1;
    self.game.soundEffect("flush");
  }));
  this.things.push(new Thing(650 - 640, 345 - 360, 40, "toilet", null, function() {
    self.game.properties["use_toilet_without_washing"] = 1;
    self.game.soundEffect("flush");
  }));
  this.things.push(new Thing(300 - 640, 420 - 360, 40, "sink", null, function() {
    self.game.properties["use_toilet_without_washing"] = null;
    self.game.soundEffect("sink");
  }));
  this.things.push(new Thing(250 - 640, 470 - 360, 40, "sink", null, function() {
    self.game.properties["use_toilet_without_washing"] = null;
    self.game.soundEffect("sink");
  }));
  // this.things.push(new Thing(750 - 640, 365 - 360, 40, "bathroom_guy", null, null));
  this.things.push(new Thing(985 - 640, 510 - 360, 40, "toilet_paper", null, null));

  // Verticals
  this.lines.push(new Line(380 - 640, 400 - 360, 890 - 640, 400 - 360));
  this.lines.push(new Line(160 - 640, 580 - 360, 1110 - 640, 580 - 360));

  // Side walls
  this.lines.push(new Line(860 - 640, 385 - 360, 1070 - 640, 595 - 360));
  this.lines.push(new Line(415 - 640, 385 - 360, 205 - 640, 595 - 360));

  this.doors.push(new Door(
    870 - 640,
    400 - 360,
    955 - 640,
    485 - 360,
    ["up", "right", "upright"],
    function() {
      if (self.game.properties["use_toilet_without_washing"] != null) {
        self.shortConversation("Hey! Wash your hands before you go!", "Bathroom_Guy");
      } else {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          this.game.gotoScene("Stage", "bathroom_start");
        }, 800);
      }
    }
  ));

    // NPCs
  this.npcs.push(new Character(canvas, this, "Bathroom_Guy", "Bathroom_Guy", 750 - 640, 365 - 360,
    // update
    null,
    // action
    function() {
      self.shortConversation("If you use the toilet, please wash your hands when\nyou finish.", "Bathroom_Guy");
  }));

  if (self.game.properties["have_seen_show"] != null) {
    this.makeStockCharacter("Mohawk_Man", "Eldridge", "updownleftright", [["Oh man, now I can go get my keys.", "Mohawk_Man"]], null);
    this.makeStockCharacter("Mohawk_Man_Orange", "John", "updownleftright", [["THAT WAS AWESOME!", "Mohawk_Man_Orange"]], null);
    this.makeStockCharacter("Mohawk_Man_Ice", "Carl", "updownleftright", [["Yeah! WOOO! T.N.T.! (Whew, I got through it okay).", "Mohawk_Man_Ice"]], null);
  }

  }
