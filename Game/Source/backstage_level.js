
Level.prototype.loadBackstageLevel = function() {
  this.level_image = new Image();
  this.level_image.src = "Art/Levels/backstage.png";

  this.camera_x = 0;
  this.camera_y = 0;

  this.team[0].x = 940 - 640;
  this.team[0].y = 550 - 360;
  this.team[0].level = this;
  this.team[0].history = [];
  this.team[1].x = 970 - 640;
  this.team[1].y = 550 - 360;
  this.team[1].level = this;
  this.team[1].history = [];

  this.game.properties["have_been_backstage"] = 1;

  var self = this;

  if(self.game.properties["recruited_rabbit"] == 1 &&
    self.game.properties["recruited_lady"] == 1 &&
    self.game.properties["recruited_man"] == 1 &&
    self.game.properties["talked_to_the_whole_band"] == 1 &&
    self.game.properties["gun_has_an_idea"] == 1 ) {
    self.game.properties["replacements_recruited"] = 1
  }

  // Verticals
  this.lines.push(new Line(300 - 640, 440 - 360, 980 - 640, 440 - 360, ["down", "downright", "downleft"]));
  this.lines.push(new Line(40 - 640, 700 - 360, 1240 - 640, 700 - 360, ["up", "upright", "upleft"]));

  // Side walls
  this.lines.push(new Line(980 - 640, 440 - 360, 1240 - 640, 700 - 360, ["down", "left", "downleft"]));
  this.lines.push(new Line(40 - 640, 700 - 360, 300 - 640, 440 - 360, ["down", "right", "downright"]));

  // Little lines at acute angles to prevent the automatic direction turn from breaking line rules.
  this.lines.push(new Line(1240 - 640, 690 - 360, 1240 - 640, 710 - 360, ["left", "upleft", "downleft"]));
  this.lines.push(new Line(40 - 640, 690 - 360, 40 - 640, 710 - 360, ["right", "upright", "downright"]));


  this.doors.push(new Door(
    1040 - 640,
    510 - 360,
    1120 - 640,
    590 - 360,
    ["up", "right", "upright"],
    function() {
      self.mode = "fade_out";
      self.fade_alpha = 0;
      setTimeout(function() {
        this.game.gotoScene("Stage", "backstage_start");
      }, 800);
    }
  ));


  idea_conversation = [
    ["So... I have an idea.", "Gun"],
    ["Oh, really?", "TNT_Rance"],
    ["Yeah. So...", "Gun"],
    ["What if you get someone to swap you out?\nTrain up replacements. Then could you retire?", "Gun"],
    ["I... ooh.", "TNT_Vance"],
    ["Oh. Oh, wow, that'll work, won't it, Chance?", "TNT_Lance"],
    ["Your guess is as good as mine, Lance.\nBut I'm not against it.", "TNT_Chance"],
    ["I actually like this idea.", "TNT_Rance"],
    ["I really, really like it.", "TNT_Rance"],
    ["Dork bear, that is a great idea.", "TNT_Vance"],
    ["Do you think you could find them among the fans?", "TNT_Lance"],
    ["Well, I,", "Gun"],
    ["I can do it. I know everyone.", "Tune"],
    ["Okay, I'm convinced. Let's do it!", "TNT_Chance"],
    ["Go find us three replacements,\n and we can come with you.", "TNT_Chance"],
  ]

  end_conversation = [
    ["Yo, bears! We tried out these replacements", "TNT_Chance"],
    ["and they're great!", "TNT_Lance"],
    ["We're ready to go on a magic carpet ride with you.", "TNT_Vance"],
    ["In fact, we'll follow you anywhere.", "TNT_Rance"],
    ["...", "TNT_Greg"],
    ["I won't be going.", "TNT_Greg"],
    ["I love being in a band. I'll stay behind and continue\nto train the new people.", "TNT_Greg"],
    ["*Vibrates*", "Rabbit_2"],
    ["That sobered me right up.", "Walking_Lady"],
    ["I really wish I'd washed my hands.", "Mohawk_Man_Orange"],
    ["Greg! I'll miss you.", "TNT_Rance"],
    ["I'll miss you too, buddy.", "TNT_Greg"],
    ["Goodbye and good luck, Greg. We'll all miss you.\nOkay, T.N.T, let's roll out or whatever you're\nsupposed to say when you make a dramatic exit.", "TNT_Chance"],
    ["Byeeee.", "TNT_Chance"],
  ]

  if (self.game.properties["recruited_rabbit"] == 1) {
    var character = new Character(canvas, this, "Rabbit_2", "Benny", 610 - 640, 580 - 360, null, function() {
      self.shortConversation("*Vibrates*", "Rabbit_2");
    });
    character.current_image = "right_0";
    this.npcs.push(character);
  }

  if (self.game.properties["recruited_lady"] == 1) {
    var character = new Character(canvas, this, "Walking_Lady", "Sharon", 510 - 640, 580 - 360, null, function() {
      self.shortConversation("That sobered me right up.", "Walking_Lady");
    });
    character.current_image = "right_0";
    this.npcs.push(character);
  }

  if (self.game.properties["recruited_man"] == 1) {
    var character = new Character(canvas, this, "Mohawk_Man_Orange", "John", 420 - 640, 580 - 360, null, function() {
      self.shortConversation("I really wish I'd washed my hands.", "Mohawk_Man_Orange");
    });
    character.current_image = "right_0";
    this.npcs.push(character);
  }

  // Yo. Hey. Sup. Why are you here? Hi, I'm Greg. I'm just happy to be here.
  // I don't know what to do.
  // I guess we're just stuck.
  // This is how it's gotta be, I guess.
  // Sigh.
  // These guys are bummed, but it's really just fine.
  this.npcs.push(new Character(canvas, this, "TNT_Chance", "Chance", 760 - 640, 365 - 360, null, function() {
    var game = self.game;
    
    if (self.game.properties["replacements_recruited"] == 1) {
      self.longConversation(end_conversation);
      self.endConversationAction = function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("End");
        }, 800);
      }
    } else if (self.game.team[0].name == "Gun") {
      if (self.game.properties["talked_to_the_whole_band"] == 1) {
        if (self.game.properties["gun_has_an_idea"] == null) {
          // The idea
          self.longConversation(idea_conversation);
          self.game.properties["gun_has_an_idea"] = 1;
        } else {
          self.shortConversation("You have great ideas, bear.\nI'm happy to help you.", "TNT_Chance"); 
        }
      } else {
        self.shortConversation("Yo.", "TNT_Chance");
      }
    } else if (self.game.team[0].name == "Tune") {
      if (self.game.properties["gun_has_an_idea"] == 1) {
        self.shortConversation("Once you get our replacements,\nwe can go find the magic carpet.", "TNT_Chance"); 
      } else if (self.game.properties["talked_to_the_whole_band"] == 1) {
        self.shortConversation("I don't know what to do.", "TNT_Chance");
      } else {
        self.game.properties["talked_to_chance"] = 1;
        if (self.game.properties["talked_to_chance"] == 1
          && self.game.properties["talked_to_lance"] == 1
          && self.game.properties["talked_to_vance"] == 1
          && self.game.properties["talked_to_rance"] == 1
          && self.game.properties["talked_to_greg"] == 1) {
          self.game.properties["talked_to_the_whole_band"] = 1
        }
        self.longConversation([
          ["Whoa, you're Tune! I'm Chance.", "TNT_Chance"],
          ["We heard you want our help.\n", "TNT_Chance"],
          ["To find the flying carpet.", "Tune"],
          ["I wish we could help you, bear.\n", "TNT_Chance"]]);
      }
    }
  }));

  this.npcs.push(new Character(canvas, this, "TNT_Lance", "Lance", 700 - 640, 365 - 360, null, function() {
    var game = self.game;

    if (self.game.properties["replacements_recruited"] == 1) {
      self.longConversation(end_conversation);
      self.endConversationAction = function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("End");
        }, 800);
      }
    } else if (self.game.team[0].name == "Gun") {
      if (self.game.properties["talked_to_the_whole_band"] == 1) {
        if (self.game.properties["gun_has_an_idea"] == null) {
          // The idea
          self.longConversation(idea_conversation);
          self.game.properties["gun_has_an_idea"] = 1;
        } else {
          self.longConversation([["This is a great idea. I can't wait.", "TNT_Lance"],
            ["Well, I can.", "TNT_Lance"]]); 
        }
      } else {
        self.shortConversation("Hey.", "TNT_Lance");
      }
    } else if (self.game.team[0].name == "Tune") {
      if (self.game.properties["gun_has_an_idea"] == 1) {
        self.longConversation([["This is a great idea. I can't wait.", "TNT_Lance"],
            ["Well, I can.", "TNT_Lance"]]); 
      } else if (self.game.properties["talked_to_the_whole_band"] == 1) {
        self.shortConversation("I guess we're just stuck.", "TNT_Lance");
      } else {
        self.game.properties["talked_to_lance"] = 1;
        if (self.game.properties["talked_to_chance"] == 1
          && self.game.properties["talked_to_lance"] == 1
          && self.game.properties["talked_to_vance"] == 1
          && self.game.properties["talked_to_rance"] == 1
          && self.game.properties["talked_to_greg"] == 1) {
          self.game.properties["talked_to_the_whole_band"] = 1
        }
        self.longConversation([
          ["I'm Lance. Are you Tune?", "TNT_Lance"],
          ["Yep yep.", "Tune"],
          ["We can't help you because we're...\n", "TNT_Lance"],
          ["...", "TNT_Lance"],
          ["Too popular.\n", "TNT_Lance"],
          ["It sounds douchey, but I mean it.\nWe're stuck playing in this stupid band.", "TNT_Lance"],]);
      }
    }
  }));

  this.npcs.push(new Character(canvas, this, "TNT_Vance", "Vance", 640 - 640, 365 - 360, null, function() {
    var game = self.game;

    if (self.game.properties["replacements_recruited"] == 1) {
      self.longConversation(end_conversation);
      self.endConversationAction = function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("End");
        }, 800);
      }
    } else if (self.game.team[0].name == "Gun") {
      if (self.game.properties["talked_to_the_whole_band"] == 1) {
        if (self.game.properties["gun_has_an_idea"] == null) {
          // The idea
          self.longConversation(idea_conversation);
          self.game.properties["gun_has_an_idea"] = 1;
        } else {
          self.shortConversation("Oh, thank you, dorky bear. Make haste, make haste.", "TNT_Vance"); 
        }
      } else {
        self.shortConversation("Sup.", "TNT_Vance");
      }
    } else if (self.game.team[0].name == "Tune") {
      if (self.game.properties["gun_has_an_idea"] == 1) {
        self.longConversation([["I was wrong about your brother, cool bear.", "TNT_Vance"],
          ["I'm sorry! I'm just so desperate to be liked.", "TNT_Vance"]]); 
      } else if (self.game.properties["talked_to_the_whole_band"] == 1) {
        self.shortConversation("This is how it's gotta be, I guess.", "TNT_Vance");
      } else {
        self.game.properties["talked_to_vance"] = 1;
        if (self.game.properties["talked_to_chance"] == 1
          && self.game.properties["talked_to_lance"] == 1
          && self.game.properties["talked_to_vance"] == 1
          && self.game.properties["talked_to_rance"] == 1
          && self.game.properties["talked_to_greg"] == 1) {
          self.game.properties["talked_to_the_whole_band"] = 1
        }
        self.longConversation([
          ["I'm Vance.", "TNT_Vance"],
          ["This band started out as an art school joke.", "TNT_Vance"],
          ["We did it for the irony.", "TNT_Vance"],
          ["But we blew up. Before we knew it, we\nwere playing packed shows every night.", "TNT_Vance"],
          ["People really love this fake thing.", "TNT_Vance"],
          ["We can't just walk away from that.", "TNT_Vance"],]);
      }
    }
  }));

  this.npcs.push(new Character(canvas, this, "TNT_Rance", "Rance", 580 - 640, 365 - 360, null, function() {
    var game = self.game;

    if (self.game.properties["replacements_recruited"] == 1) {
      self.longConversation(end_conversation);
      self.endConversationAction = function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("End");
        }, 800);
      }
    } else if (self.game.team[0].name == "Gun") {
      if (self.game.properties["talked_to_the_whole_band"] == 1) {
        if (self.game.properties["gun_has_an_idea"] == null) {
          // The idea
          self.longConversation(idea_conversation);
          self.game.properties["gun_has_an_idea"] = 1;
        } else {
          self.shortConversation("Go get 'em! Literally, go get\nour replacements.", "TNT_Rance"); 
        }
      } else {
        self.shortConversation("Why are *you* here?", "TNT_Rance");
      }
    } else if (self.game.team[0].name == "Tune") {
      if (self.game.properties["gun_has_an_idea"] == 1) {
        self.shortConversation("Go get 'em! Literally, go get\nour replacements.", "TNT_Rance"); 
      } else if (self.game.properties["talked_to_the_whole_band"] == 1) {
        self.shortConversation("Sigh.", "TNT_Rance");
      } else {
        self.game.properties["talked_to_rance"] = 1;
        if (self.game.properties["talked_to_chance"] == 1
          && self.game.properties["talked_to_lance"] == 1
          && self.game.properties["talked_to_vance"] == 1
          && self.game.properties["talked_to_rance"] == 1
          && self.game.properties["talked_to_greg"] == 1) {
          self.game.properties["talked_to_the_whole_band"] = 1
        }
        self.longConversation([
          ["I'm Rance. We all wanted to meet you.\nAnd I guess this other guy? Sure.", "TNT_Rance"],
          ["I heard you want us to take you on \n a magic carpet ride.", "TNT_Rance"],
          ["But we don't know how to stop the band.\nOur managers and our fans won't let us\nget away from it.", "TNT_Rance"],
          ["Stuff this stupid art school joke.\nI'm so tired of being popular.", "TNT_Rance"],]);
      }
    }
  }));

  this.npcs.push(new Character(canvas, this, "TNT_Greg", "Greg", 520 - 640, 365 - 360, null, function() {
    var game = self.game;

    if (self.game.properties["replacements_recruited"] == 1) {
      self.longConversation(end_conversation);
      self.endConversationAction = function() {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("End");
        }, 800);
      }
    } else if (self.game.team[0].name == "Gun") {
      if (self.game.properties["talked_to_the_whole_band"] == 1) {
        if (self.game.properties["gun_has_an_idea"] == null) {
          self.shortConversation("Maybe if you talk to Chance, or Lance, or\nVance or Rance, you'll come up with an idea.", "TNT_Greg");
        } else {
          self.shortConversation("I saw a rabbit, a shroomy lady, and an orange guy\nwho look like they might make good replacements.\nGood luck!", "TNT_Greg"); 
        }
      } else {
        self.shortConversation("Hi, I'm Greg. I'm just happy to be here.", "TNT_Greg");
      }
    } else if (self.game.team[0].name == "Tune") {
      if (self.game.properties["gun_has_an_idea"] == 1) {
        self.shortConversation("I saw a rabbit, a shroomy lady, and an orange guy\nwho look like they might make good replacements.\nGood luck!", "TNT_Greg"); 
      } else if (self.game.properties["talked_to_the_whole_band"] == 1) {
        self.shortConversation("These guys are bummed, but it's really just fine.", "TNT_Greg");
      } else {
        self.game.properties["talked_to_greg"] = 1;
        if (self.game.properties["talked_to_chance"] == 1
          && self.game.properties["talked_to_lance"] == 1
          && self.game.properties["talked_to_vance"] == 1
          && self.game.properties["talked_to_rance"] == 1
          && self.game.properties["talked_to_greg"] == 1) {
          self.game.properties["talked_to_the_whole_band"] = 1
        }
        self.longConversation([
          ["I'm Greg. ", "TNT_Greg"],
          ["Don't tell those other guys, but I'm just\nhappy to be part of a band.", "TNT_Greg"],]);
      }
    }
  }));

  if (this.game.properties["replacements_recruited"] == 1) {
    this.game.stopMusic();
    this.game.setMusic("adventure", "loop");
  }
}
