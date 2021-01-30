
Level.prototype.loadStageLevel = function() {
  var self = this;

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

  // this.game.properties["have_seen_show"] = 1

  this.characterBounds = [300 - 960, 1630 - 960, 500 - 540, 1040 - 540];
  
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
      } else {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          this.game.gotoScene("Backstage");
        }, 800);
      }
    }
  ));

  if (this.game.properties["have_seen_show"] != null && this.game.properties["have_been_backstage"] == null) {
    for (i = 0; i < 4; i++) {
      this.npcs.push(new Character(canvas, this, "Bathroom_Guy", "Special_Guard", 190 + 25 * i - 960, 570 - 25 * i - 540, null, function() {
        var game = self.game;
        if (self.game.team[0].name == "Gun") {
          self.shortConversation("I'm sorry, sir. You're not allowed backstage.", "Bathroom_Guy");
        } else if (self.game.team[0].name == "Tune") {
          self.shortConversation("Ah, are you Tune?\nThe band is eager to meet you.\nPlease, come on in.", "Bathroom_Guy");
          for (var i = 0; i < self.npcs.length; i++) {
            if (self.npcs[i].name == "Special_Guard") {
              self.npcs[i].update = function() {
                this.y = this.y - 5;
              }
              self.npcs[i].action = null;
            }
          }
        }
      }));
    }
  }


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
                // self.game.gotoScene("Show")
                self.endConversationAction = function() {
                  self.mode = "fade_out";
                  self.fade_alpha = 0;
                  setTimeout(function() {
                    self.game.gotoScene("Show");
                  }, 800);
                }
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
    this.makeStockCharacter("Punk_Lady_2", "Jenn", "updown", [["I've seen these guys three times already.\nI'm expecting a really good show.", "Punk_Lady_2"]], null);
  }

  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);
  this.makeStockCharacter("Walking_Lady", "Sharon", "leftright", [["I took a lot of shrooms, and now I feel like\nI'm in four places at once.", "Walking_Lady"], ["I bet all four of me would make excellent\nbackup dancers.", "Walking_Lady"]], null);

  this.makeStockCharacter("Walking_Guy_Red", "TimmyTim", "updown", [
    ["Our father, six foot eleven,", "Walking_Guy_Red"],
    ["Power be thy name.", "Walking_Guy_Red"],
    ["Balhalla come", "Gun"],
    ["For champions", "Walking_Guy_Red"],
    ["Who practice the fundamentals.", "Gun"],
    ["Give us this day", "Walking_Guy_Red"],
    ["The clutchest plays", "Gun"],
    ["And forgive us for goaltending,", "Walking_Guy_Red"],
    ["As we forgive those who goaltend way,\n way more than us even though they\n totally should have been called on it.", "Gun"],
    ["And lead us not into technicals", "Walking_Guy_Red"],
    ["But deliver our free throws.", "Gun"],
    ["For yours are the Kingdome, Cow Palace\nand Hemisfair, now and forever.", "Walking_Guy_Red"],
    ["*Amen*", "Gun"],

  ], null);

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
            self.addMoreConversation([["T.N.T. insists on using 100% renewable energy\nat every show. I don't know what that\nmeans, but it sure sounds good!", "Rabbit_2"]]);
          } else if (dice < 40) {
            self.addMoreConversation([["T.N.T. used to use smoke effects at their shows,\nbut Rance has a smoke allergy, so they\nswitched to using laser lights.", "Rabbit_2"]]);
          } else if (dice < 60) {[]
            self.addMoreConversation([["Chance and Lance were roommates at art school.", "Rabbit_2"]]);
          } else if (dice < 80) {
            self.addMoreConversation([["Vance used to have a job painting cars.\nChance and Lance worked at the same\nconvenience store.", "Rabbit_2"],
              ["Vance met Rance at a record shop where\nRance worked. Greg was a pastor.", "Rabbit_2"]]);
          } else {
            self.addMoreConversation([["T.N.T. has had seven chart topping\nsingles so far.", "Rabbit_2"]]);
          }
        },
        function() {
          self.addMoreConversation([["Okay, no worries! Facts aren't everyone's thing.", "Rabbit_2"]]);
      }]);
    }
    self.longConversation(queue);
  });

  this.makeStockCharacter("Punk_Lady", "Danica", "updown", null, function() {
    var praises = [
      "Yeah! I love it!",
      "Yes! Number six at Radiohead trivia in the tri-state.",
      "Woo! I saw Thom Yorke at a Foo Fighters concert\n once. Don't ask what I was doing there.",
      "I know it's the T.N.T. concert,\n but I'm feelin' Radiohead today.",
      "Thanks, now I have everything\n in its right place\n right place.",
      "Whew. For a minute there\n I lost myself.",
      "You pass! Judge and jury, executioner\n Judge and jury, executioner\n Judge and jury, executioner",
      "Good job! I wish *I* was special.",
      "I've got to praise you! I've got to\n praise you like I should\n no wait wrong band.",
    ];
    var disappointments = [
      "What? No!",
      "Uh... never feel bad for not knowing\n the lyrics of a popular song.",
      "Boo. You probably don't even listen to music.",
      "Ugh. Hail to the thief. Get it.",
      "Nope. Now we separate\n Like ripples on a blank shore.",
      "... it's making me feel ill. You crashed my party.",
      "Broken bears\n trip me as I speak.",
      "Don't reach out.\n We'd be a walking disaster.",
      "Aww, YOU have not been payin' attention.",
      "You try to sing along\n but the music's all wrong.",
      "You don't remember, you don't remember.",
    ];
    var gun_struggles = [
      "Um...",
      "No... that's",
      "Let's see",
      "La la la la la",
      "It. Dang it.",
      "Dang. Tune played that one for me once.",
      "Think!",
    ]

    var puzzles = [
      ["I'll lay down the tracks", 
        "Sandbag and hide", "Sandbag and ride",
        "January has April's Showers",
        "And two and two always makes up five", "And two and two always makes five"],
      ["Shell smashed, juices flowing",
        "Wings twitch legs are going", "Wings twitch legs are growing",
        "Don't get sentimental",
        "It always ends up drivel", "It all ends up drivel"],
      ["Karma police",
        "Arrest this man", "Arrest the man",
        "He talks in maths",
        "He buzzes like a fridge", "And buzzes like the fridge"],
      ["This is what you'll get",
        "This is what you'll get", "This is what you get", 
        "This is what you'll get",
        "When you mess with us", "When you mess with the"],
      ["Yesterday I woke up",
        "sucking on a lemon", "stuck on a lemon",
        "Yesterday I woke up",
        "sucking on a lemon", "sucking on lemons"],
      ["You are not to blame for",
        "Bittersweet distractors", "Bittersweet detractors",
        "Dare not speak its name",
        "Dedicated to all human beings", "Dictated to all human beings"],
      ["When I am king",
        "You will be first against the wall", "You'll be the first against the wall",
        "With your opinion",
        "Which is of no consequence at all", "It is of no consequence at all"],
      ["Ambition makes you",
        "look pretty ugly", "look very ugly",
        "Kicking and squealing",
        "Gucci little piggy", "Look little piggy"],
      ["This machine will, will not communicate",
        "These thoughts and the strain I am under", "These thoughts a train I am under",
        "Be a world child, form a circle",
        "Before we all go under", "So we can all go under"],
      ["It slipped my mind, and for a time",
        "I felt completely free", "I was completely free", 
        "Oh, what a troubled silent poor boy",
        "A pawn into a queen", "A pawn became a queen"],
      ["But I'm a creep",
        "I'm a weirdo", "I'm a willow",
        "What the hell am I doin' here?",
        "I don't belong here", "I feel so wrong here",],
       ["When you were here before",
        "Couldn't look you in the eye", "Couldn't look me in the eye",
        "You're just like an angel",
        "Your skin makes me cry", "Your soul makes me cry"],
    ];

    var queue = [];
    var puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    if (self.game.team[0].name == "Gun") {
      queue.push([puzzle[0], "Punk_Lady"]);

      var answers = ["_interactive_", "Gun", 
        gun_struggles[Math.floor(Math.random() * gun_struggles.length)],
        puzzle[2],
        function() {
          self.addMoreConversation([[disappointments[Math.floor(Math.random() * disappointments.length)], "Punk_Lady"]]);
        },
        function() {
          self.addMoreConversation([[disappointments[Math.floor(Math.random() * disappointments.length)], "Punk_Lady"]]);
        }
      ];
      if (Math.floor(Math.random() * 10) > 5) {
        answers[2] = puzzle[2];
        answers[3] = gun_struggles[Math.floor(Math.random() * gun_struggles.length)];
      }

      queue.push(answers);
    } else if (self.game.team[0].name == "Tune") {
      queue.push([puzzle[0], "Punk_Lady"]);

      var answers = ["_interactive_", "Tune", 
        puzzle[1],
        puzzle[2],
        function() {
          var second_queue = [];
          second_queue.push([puzzle[3], "Punk_Lady"]);
          var second_answers = ["_interactive_", "Tune", 
            puzzle[4],
            puzzle[5],
            function() {
              self.addMoreConversation([[praises[Math.floor(Math.random() * praises.length)], "Punk_Lady"]]);
            },
            function() {
              self.addMoreConversation([[disappointments[Math.floor(Math.random() * disappointments.length)], "Punk_Lady"]]);
            }
          ];
          if (Math.floor(Math.random() * 100) >= 50) {
            second_answers[2] = puzzle[5];
            second_answers[3] = puzzle[4];
            [second_answers[4], second_answers[5]] = [second_answers[5], second_answers[4]];
          }
          second_queue.push(second_answers);
          self.addMoreConversation(second_queue);
        },
        function() {
          self.addMoreConversation([[disappointments[Math.floor(Math.random() * disappointments.length)], "Punk_Lady"]]);
        }
      ];
      if (Math.floor(Math.random() * 100) >= 50) {
        answers[2] = puzzle[2];
        answers[3] = puzzle[1];
        [answers[4], answers[5]] = [answers[5], answers[4]];
      }

      queue.push(answers);
    }




    self.longConversation(queue);
  });

  this.game.setMusic("deep_rough", "loop");
  // this.game.setMusic("adventure", function() {
  //   self.game.gotoScene("Bathroom");
  // });

  // This won't work because the mode is switched to "fade in", and from there to "active".
  // this.shortConversation("It already happened. It is what it is. Please accept it.Anyway, we've got work to do, right? This is a very   very long sentence, but it'll fit, I think.", "Gun")
}
