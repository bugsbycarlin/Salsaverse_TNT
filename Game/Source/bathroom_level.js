
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

  // Verticals
  this.lines.push(new Line(380 - 640, 400 - 360, 890 - 640, 400 - 360, ["down", "downleft", "downright"]));
  this.lines.push(new Line(160 - 640, 580 - 360, 1110 - 640, 580 - 360, ["up", "upleft", "upright"]));

  // Side walls
  this.lines.push(new Line(860 - 640, 385 - 360, 1070 - 640, 595 - 360, ["down", "left", "downleft"]));
  this.lines.push(new Line(415 - 640, 385 - 360, 205 - 640, 595 - 360, ["down", "right", "downright"]));

  // Little lines at acute angles to prevent the automatic direction turn from breaking line rules.
  this.lines.push(new Line(1055 - 640, 570 - 360, 1055 - 640, 590 - 360, ["left", "upleft", "downleft"]));
  this.lines.push(new Line(220 - 640, 570 - 360, 220 - 640, 590 - 360, ["right", "upright", "downright"]));

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

  // Things
  this.things.push(new Thing(985 - 640, 510 - 360, 40, "toilet_paper", null, null));
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
    // this.makeStockCharacter("Mohawk_Man_Orange", "John", "updownleftright", [["THAT WAS AWESOME!", "Mohawk_Man_Orange"]], null);
    this.makeStockCharacter("Mohawk_Man_Ice", "Carl", "updownleftright", [["Yeah! WOOO! T.N.T.! ( Whew, I got through it okay ).", "Mohawk_Man_Ice"]], null);
    this.makeStockCharacter("Punk_Lady_2", "Jenn", "updown", [["You know it's a good show when you hold it\nthe whole time.", "Punk_Lady_2"]], null);
  
    if (self.game.properties["recruited_man"] == null) {
      this.makeStockCharacter("Mohawk_Man_Orange", "John", "updownleftright", null, function() {
        if (self.game.properties["gun_has_an_idea"] == null) {
          if (self.game.team[0].name == "Gun") {
            self.shortConversation("THAT WAS AWESOME!", "Mohawk_Man_Orange");
          } else if (self.game.team[0].name == "Tune") {
            self.shortConversation("You really know your dances. THAT WAS AWESOME!", "Mohawk_Man_Orange");
          }
        } else {
          if (self.game.team[0].name == "Gun") {
            self.shortConversation("Hey, let me speak to Tune.", "Mohawk_Man_Orange");
          } else if (self.game.team[0].name == "Tune") {
            self.game.properties["recruited_man"] = 1;
            this.walk_frame_time *= 0.5;
            this.update = function() { this.x -= this.walk_speed * 4; this.direction = "left"; this.walkAnimation(); }
            queue = [
              ["My friend, T.N.T. wants to retire, and they need\nnew recruits for the band.", "Tune"],
              ["Oh, everyone on the forum will be STOKED.", "Mohawk_Man_Orange"],
              ["No, they want you. Today. Get backstage.", "Tune"],
              ["Really?", "Mohawk_Man_Orange"],
              ["WOOOOO!", "Mohawk_Man_Orange"],
              ["I'M NOT EVEN GONNA WASH MY HANDS!", "Mohawk_Man_Orange"]
            ];
            self.longConversation(queue);
          }
        }
      });
    }
  }
}
