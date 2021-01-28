
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

  var self = this;
  
  // The world's most public toilet
  this.things.push(new Thing(380 - 960, 830 - 540, 40, "toilet", null, function() {
      self.shortConversation("No.", "Gun");
  }));

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

  // NPCs
  this.npcs.push(new Character(canvas, this, "Walking_Guy", "Dog_Proofin_Jones", 870 - 960, 680 - 540,
    // update
    function() {
      this.randomWalk("updown");
    },
    // action
    function() {
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
  }));

  this.npcs.push(new Character(canvas, this, "Walking_Guy_Red", "Some Guy", 1070 - 960, 730 - 540,
    // update
    function() {
      this.randomWalk("updown");
    },
    // action
    function() {
      var game = self.game;
      if (self.game.team[0].name == "Gun") {
        self.shortConversation("Who are you, bear? I don't know you.", "Walking_Guy_Red");
      } else if (self.game.team[0].name == "Tune") {
        self.shortConversation("Yo, Tune! Long time no see! You here to see TNT?\nAren't they just the balls to the wall? The pedal to the\nmetal? Yes, you agree that they are. I know it, bro.", "Walking_Guy_Red");
      }
  }));

  this.npcs.push(new Character(canvas, this, "Bat_Girl", "Bat Girl", 560 - 960, 490 - 540,
    // update
    function() {
      this.randomWalk("updown");
    },
    // action
    function() {
      var game = self.game;
      self.longConversation([
        ["My daddy swings the biggest bat in Eagleland.", "Bat_Girl"],
        ["But he does strike out a lot.", "Bat_Girl"]
      ]);

  }));


  this.npcs.push(new Character(canvas, this, "Walking_Guy_Red", "Some Guy", 1570 - 960, 730 - 540,
    // update
    function() {
      this.randomWalk("updown");
    },
    // action
    function() {
      var game = self.game;
      var queue = [
        ["Can't you see the ocean?!", "Walking_Guy_Red"]
      ];

      if (self.game.team[0].name == "Gun") {
        queue.push([
          "_interactive_",
          "Gun", 
          "Yes?",
          "... No.",
          function() {
            self.addMoreConversation([["Yes? No! That's not right at all.", "Walking_Guy_Red"]]);
          },
          function() {
            self.addMoreConversation([["No? No, no no. I'm tryin' to engage you \nin an exchange of lyrics, my bear.", "Walking_Guy_Red"]]);
        }]);
      } else if (self.game.team[0].name == "Tune") {
        queue.push([
          "_interactive_",
          "Tune", 
          "Filled with all the faith and grace!",
          "Filled with colors of the wind!",
          function() {
            self.addMoreConversation([["Yeah, dude! You know it! *PSI Rockin*", "Walking_Guy_Red"]]);
          },
          function() {
            self.addMoreConversation([["That's not right.", "Walking_Guy_Red"]]);
        }]);
      }

      self.longConversation(queue);
  }));

  this.game.setMusic("deep_rough");

  // This won't work because the mode is switched to "fade in", and from there to "active".
  // this.shortConversation("It already happened. It is what it is. Please accept it.Anyway, we've got work to do, right? This is a very   very long sentence, but it'll fit, I think.", "Gun")
}
