
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

  this.characterBounds = [300 - 960, 1630 - 960, 500 - 540, 1040 - 540];

  var self = this;
  
  // The world's most public toilet
  if (self.game.properties["have_seen_show"] == null) {
    this.things.push(new Thing(380 - 960, 830 - 540, 40, "toilet", null, function() {
        self.longConversation([["No.", "Gun"], ["No?", "Tune"], ["No! Just no.", "Gun"]]);
    }));
  }

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
        this.game.gotoScene("Bathroom");
      }, 800);
    }
  ));

  // Backstage door
  var self = this;
  this.doors.push(new Door(
    170 - 960,
    565 - 540,
    250 - 960,
    485 - 540,
    ["up", "left", "upleft"],
    function() {
      if (self.game.properties["have_seen_show"] == null) {
        self.shortConversation("Can't go backstage before the show.", "Bathroom_Guy");
      }
    }
  ));

  // Exit door
  var self = this;
  this.doors.push(new Door(
    1700 - 960,
    550 - 540,
    1860 - 960,
    710 - 540,
    ["up", "right", "upright"],
    function() {
      self.shortConversation("Hey! We don't want to leave without T.N.T.", "Gun");
    }
  ));

  if (self.game.properties["have_seen_show"] == null) {
    this.npcs.push(new Character(canvas, this, "Bathroom_Guy", "Bathroom_Guy", 760 - 960, 230 - 540, null, null));
  }
  for (var i = 0; i < 2; i++) {
    this.npcs.push(new Character(canvas, this, "Bathroom_Guy", "Bathroom_Guy", 700 + 490*i - 960, 490 - 540,
      // update
      null,
      // action
      function() {
        var queue = [];

        if (self.game.properties["have_seen_show"] == null) {
          queue.push(["Are you ready to start the show?", "Bathroom_Guy"]);

          if (self.game.properties["asked_first_guy"] == null) {
            queue.push([
              "_interactive_", "Gun", 
              "Yes", "No",
              function() {
                self.addMoreConversation([["Well, it's not my job to start anything.\nAsk the other guy.", "Bathroom_Guy"]]);
                self.game.properties["asked_first_guy"] = 1
              },
              function() {
                self.addMoreConversation([["Okay.", "Bathroom_Guy"]]);
            }]);
          } else if (self.game.properties["asked_first_guy"] == 1) {
            queue.push([
              "_interactive_", "Tune", 
              "Yes", "No",
              function() {
                self.addMoreConversation([["Are you the boss or something?\nWell, okay, let's start the show.", "Bathroom_Guy"]]);
                self.game.properties["have_seen_show"] = 1;
                self.game.gotoScene("Show")
              },
              function() {
                self.addMoreConversation([["Okay.", "Bathroom_Guy"]]);
            }]);
          }
        } else {
          queue = [
            ["Well, that was a doozie, eh?", "Bathroom_Guy"],
            ["Run along home, k?", "Bathroom_Guy"]
          ];
        }

        self.longConversation(queue);
    }));
  }

  this.makeStockCharacter("Bat_Girl", "Nell", "updown", [
    ["My daddy swings the biggest bat in Eagleland.", "Bat_Girl", "Nell"],
    ["But he does strike out a lot.", "Bat_Girl", "Nell"]
  ]);

  if (self.game.properties["have_seen_show"] == null) {
    this.makeStockCharacter("Mohawk_Man", "Eldridge", "updownleftright", [["BROOOOOoohhhh wait I left my keys in the car.", "Mohawk_Man"]], null);
    this.makeStockCharacter("Mohawk_Man_Orange", "John", "updownleftright", [["T.N.T. PARTY!", "Mohawk_Man_Orange"]], null);
    this.makeStockCharacter("Mohawk_Man_Ice", "Carl", "updownleftright", [
      ["WOOO HAAAAA! T.N.T. CONCERT! I am so psyched!", "Mohawk_Man_Ice"],
      ["So psyched.", "Mohawk_Man_Ice"],
      ["So psyched...", "Mohawk_Man_Ice"],
      ["... I think I psyched myself out.", "Mohawk_Man_Ice"]], null);
  }

  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);

  this.makeStockCharacter("Horse", "Studs", "updown", [
    ["Study, study, study. That's all I ever do.", "Horse"],
    ["Well, not tonight.", "Horse"],
    ["Tonight...", "Horse"],
    ["This horse is gonna PARTYYYYY!", "Horse"]], null);

  this.makeStockCharacter("Walking_Guy", "Jones", "updown", null, function() {
      var game = self.game;
      if (self.game.properties["met_dog_proofin_jones"] == null) {
        self.shortConversation("I'm Dog Proofin' Jones! Make sure to close all your\ncabinets so your dog can't root around in em\nlooking for food.", "Walking_Guy");
        self.game.properties["met_dog_proofin_jones"] = 1
      } else {
        dice = Math.floor(Math.random() * 100);
        if (dice < 20) {
          self.shortConversation("Clean up spills on the stove so your dog doesn't\naccidentally set the house on fire tryin' to\nlick the food off the dials.", "Walking_Guy");
        } else if (dice < 40) {
          self.shortConversation("Close your bathroom doors so your dog can't go\ndigging around in the bathroom trash. It's gross\nwhen they do that.", "Walking_Guy");
        } else if (dice < 60) {
          self.shortConversation("Don't leave Cliff bars in your backpack, or your\ndog might rip it open looking for 'em.", "Walking_Guy");
        } else if (dice < 80) {
          self.shortConversation("Don't put chairs near the fridge. You don't want\nyour dog jumpin' up on top of the fridge and eatin'\nwhatever food you have up there.", "Walking_Guy");
        } else {
          self.shortConversation("Make sure you take your dog on a short walk before\nyou leave the house, so they don't go poopin' and\npeein' everywhere.", "Walking_Guy");
        }
      }
  });

  this.makeStockCharacter("Rabbit", "Sacky", "leftright", null, function() {
    self.longConversation([
      ["Look at these ears! I'm gonna hear every little\nbit of this show.", "Rabbit"],
      ["Except... I'm suddenly worried I'm gonna damage\nmy hearing.", "Rabbit"],
      ["Um.", "Rabbit"],
      ["Um...", "Rabbit"],
      ["Bye.", "Rabbit"],
    ]);
    self.game.properties["rabbit_wigged_out"] = 1;
    this.walk_frame_time *= 0.5;
    this.update = function() { this.x += this.walk_speed * 4; this.direction = "right"; this.walkAnimation(); }
  });

  this.makeStockCharacter("Rabbit_2", "Benny", "leftright", null, function() {
    var queue = [];
    if (self.game.team[0].name == "Tune" && self.game.properties["met_fact_rabbit"] == 1) {
      queue.push(["Oh man, you're so cool. Do you...think I could\nbe a pop rocker singer someday?", "Rabbit_2"]);
      queue.push([
        "_interactive_", "Tune", 
        "Yeah, absolutely!", "Oh, um... Maybe stick to your skills.",
        function() {
          self.addMoreConversation([["Really? Mister, you just about double made my day!", "Rabbit_2"]]);
        },
        function() {
          self.addMoreConversation([["Yeah, you're... you're probably right.", "Rabbit_2"]]);
      }]);
    } else {
      if (self.game.properties["met_fact_rabbit"] == null) {
        self.game.properties["met_fact_rabbit"] = 1;
        queue.push(["Buster, I'm not cool. In fact I'm a dork.\nBut I do know everything about T.N.T.\nDo you want to hear some T.N.T. facts?", "Rabbit_2"]);
      } else {
        queue.push(["Do you still want to hear more T.N.T. facts from this\ndorky rabbit? Really?", "Rabbit_2"]);
      }

      queue.push([
        "_interactive_", "Gun", 
        "Sure", "No thanks.",
        function() {
          dice = Math.floor(Math.random() * 100);
          if (dice < 20) {
            self.addMoreConversation([["Fact 1", "Rabbit_2"]]);
          } else if (dice < 40) {
            self.addMoreConversation([["Fact 2", "Rabbit_2"]]);
          } else if (dice < 60) {[]
            self.addMoreConversation([["Fact 3", "Rabbit_2"]]);
          } else if (dice < 80) {
            self.addMoreConversation([["Fact 4", "Rabbit_2"]]);
          } else {
            self.addMoreConversation([["Fact 5", "Rabbit_2"]]);
          }
        },
        function() {
          self.addMoreConversation([["Okay, no worries! Facts aren't everyone's thing.", "Rabbit_2"]]);
      }]);
    }
    self.longConversation(queue);
  });



  this.makeStockCharacter("Walking_Guy_Red", "Cleat", "updown", null, function() {
      var game = self.game;
      if (self.game.team[0].name == "Gun") {
        self.shortConversation("Who are you, bear? I don't know you.", "Walking_Guy_Red");
      } else if (self.game.team[0].name == "Tune") {
        self.shortConversation("Yo, Tune! Long time no see! You here to see TNT?\nAren't they just balls to the wall? Pedal to the\nmetal? Yes, you agree that they are. I know it, bro.", "Walking_Guy_Red");
      }
  });

  this.makeStockCharacter("Walking_Guy_Red", "Dave G", "updown", null, function() {
      var queue = [
        ["Can't you see the ocean?!", "Walking_Guy_Red"]
      ];

      if (self.game.team[0].name == "Gun") {
        queue.push([
          "_interactive_", "Gun", 
          "Yes?", "... No.",
          function() {
            self.addMoreConversation([["Yes? No! That's not right at all.", "Walking_Guy_Red"]]);
          },
          function() {
            self.addMoreConversation([["No? No, no no. I'm tryin' to engage you \nin an exchange of lyrics, my bear.", "Walking_Guy_Red"]]);
        }]);
      } else if (self.game.team[0].name == "Tune") {
        queue.push([
          "_interactive_", "Tune", 
          "Filled with all the faith and grace!", "Filled with colors of the wind!",
          function() {
            self.addMoreConversation([["Yeah, dude! You know it! *PSI Rockin*", "Walking_Guy_Red"]]);
          },
          function() {
            self.addMoreConversation([["That's not right.", "Walking_Guy_Red"]]);
        }]);
      }

      self.longConversation(queue);
  });

  this.game.setMusic("deep_rough");

  // This won't work because the mode is switched to "fade in", and from there to "active".
  // this.shortConversation("It already happened. It is what it is. Please accept it.Anyway, we've got work to do, right? This is a very   very long sentence, but it'll fit, I think.", "Gun")
}
