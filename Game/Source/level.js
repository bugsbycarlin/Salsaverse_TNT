
black_screen = new Image();
black_screen.src = "Art/Extras/black_screen.png";

class Level {
  constructor(game, scene_name) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.team = this.game.team;

    console.log("i am here");
    this.scene_name = scene_name;
    console.log(this.scene_name);
    if (this.scene_name == "Stage") {
      this.loadLevel = this.loadStageLevel;
    } else if (this.scene_name == "Bathroom") {
      this.loadLevel = this.loadBathroomLevel;
    } else if (this.scene_name == "Backstage") {
      this.loadLevel = this.loadBackstageLevel;
    }
    console.log("level loaded");
    console.log(this);

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

    this.shuffleStockCharacters();

    this.mode = "fade_in";
    this.fade_alpha = 1;
  }


  update() {
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
      this.partial_text = this.full_text.slice(0, this.partial_text.length + 2);
    }

    this.updateCamera();
  }

  
  render() {
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.drawImage(this.level_image, 0, 0, "level");

    this.drawObjects.sort((a,b) => (a.y >= b.y) ? 1: -1);
    for (var i = 0; i < this.drawObjects.length; i++) {
      var object = this.drawObjects[i];
      this.drawImage(object.images[object.current_image], object.x, object.y, object.current_image);
    }

    if (this.mode == "active") {
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
    } else if (this.mode == "conversation") {
      // this.context.font = '24px Minecraft';
      // this.context.fillStyle = 'black';
      // this.context.textAlign = "left";
      // this.context.textBaseline = 'top';
      // this.context.fillText ('A: Conversation', 23, 720 - 39);
      // this.context.fillStyle = 'white';
      // this.context.fillText ('A: Conversation', 24, 720 - 40);
    }

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

    this.renderConversation();

    if (this.mode == "fade_in" || this.mode == "fade_out") {
      this.context.globalAlpha = Math.max(0,Math.min(1.0,this.fade_alpha));
      this.context.drawImage(black_screen, 0, 0);
      this.context.globalAlpha = 1.0;
    }
  }

  renderConversation() {
    if (this.partial_text != null) {
      this.context.drawImage(this.game.conversation, 0, 0);

      this.context.font = '40px Minecraft';
      this.context.textAlign = "left";
      this.context.textBaseline = 'top';

      if (this.full_text != "_interactive_") {
        if (this.full_text.length <= 56) {
          this.context.fillStyle = 'black';
          this.context.fillText (this.partial_text, 39, 86);
          this.context.fillStyle = 'white';
          this.context.fillText (this.partial_text, 40, 87);
        } else {
          var text1, text2, text3;
          [text1, text2, text3] = this.partial_text.split(/\n/);
          if (text1 != null) {
            this.context.fillStyle = 'black';
            this.context.fillText (text1, 39, 36);
            this.context.fillStyle = 'white';
            this.context.fillText (text1, 40, 37);
          }
          if (text2 != null) {
            this.context.fillStyle = 'black';
            this.context.fillText (text2, 39, 93);
            this.context.fillStyle = 'white';
            this.context.fillText (text2, 40, 94);
          }
          if (text3 != null) {
            this.context.fillStyle = 'black';
            this.context.fillText (text3, 39, 150);
            this.context.fillStyle = 'white';
            this.context.fillText (text3, 40, 151);
          }
        }

        if (this.conversation_queue.length > 0 && this.full_text == this.partial_text) {
          if (this.marker_blink == null) {
            this.marker_blink = Date.now();
          }
          if (Date.now() - this.marker_blink <= 400) {
              this.context.drawImage(this.game.marker, 1040, 170);
          }
          if (Date.now() - this.marker_blink >= 800) {
            this.marker_blink = Date.now();
          } 
        }
      } else if (this.full_text == "_interactive_") {
        this.context.fillStyle = 'black';
        this.context.fillText (this.interactive_1, 69, 51);
        this.context.fillStyle = 'white';
        this.context.fillText (this.interactive_1, 70, 52);

        this.context.fillStyle = 'black';
        this.context.fillText (this.interactive_2, 69, 125);
        this.context.fillStyle = 'white';
        this.context.fillText (this.interactive_2, 70, 126);

        this.context.drawImage(this.game.side_marker, 30, 56 + 75 * this.interactive_choice);
      }

      if (this.speaker_image != null) {
        this.context.drawImage(this.speaker_image, this.game.canvas.width - 153, 20);
      }
      // if (this.speaker_name != null) {
      //   this.context.font = '24px Minecraft';
      //   this.context.textAlign = "center";
      //   this.context.fillStyle = 'black';
      //   this.context.fillText (this.speaker_name, this.game.canvas.width - 88, 165);
      // }
    }
  }


  makeStockCharacter(archetype, name, motion, linear_conversation, conversation_function=null) {
    var x = Math.floor(Math.random() * (this.characterBounds[1] - this.characterBounds[0])) + this.characterBounds[0];
    var y = Math.floor(Math.random() * (this.characterBounds[3] - this.characterBounds[2])) + this.characterBounds[2];
    
    var self = this;
    var action = function() {
      console.log("just making");
      console.log(linear_conversation);
      self.longConversation(linear_conversation);
    };
    if (conversation_function != null) {
      action = conversation_function
    }
    var character = new Character(canvas, this, archetype, name, x, y,
      // update
      function() { this.randomWalk(motion); },
      // action
      action
    );
    if (motion == "leftright") {
      character.direction = "right";
      character.current_image = "right_0";
    }
    this.npcs.push(character);
  }


  shuffleStockCharacters() {

  }


  longConversation(conversation_queue) {
    if (conversation_queue == null) {
      return;
    }

    this.conversation_queue = []
    for (var i = 0; i < conversation_queue.length; i++) {
      this.conversation_queue.push(conversation_queue[i]);
    }
    this.mode = "conversation";
    this.conversationStep();
  }


  shortConversation(text, speaker = null) {
    this.longConversation(
      [[text, speaker]]
    );
  }


  addMoreConversation(more_queue) {
    for (var i = 0; i < more_queue.length; i++) {
      this.conversation_queue.push(more_queue[i]);
    }
  }


  conversationStep() {
    if (this.conversation_queue == null || this.conversation_queue.length < 1) {
      return;
    }

    var item = this.conversation_queue.shift()

    if (item[0] == "_interactive_") {
      // Oh! Interactive!

      this.full_text = "_interactive_";

      if (item[1] != null) {
        this.speaker_image = new Image();
        this.speaker_image.src = "Art/" + item[1] + "/headshot.png";
      }
      // if (item[2] != null) {
      //   this.speaker_name = item[2];
      // }

      this.interactive_1 = item[2];
      this.interactive_2 = item[3];
      this.action_1 = item[4];
      this.action_2 = item[5];
      this.interactive_choice = 0;

      this.marker_blink = Date.now();

      // var sound_effect = "#interactive";
      // $(sound_effect).prop("volume", 0.4);
      // $(sound_effect).trigger("play");
    } else {
      this.full_text = item[0]
      this.partial_text = "";

      if (item[1] != null) {
        this.speaker_image = new Image();
        this.speaker_image.src = "Art/" + item[1] + "/headshot.png";
      }
      // if (item[2] != null) {
      //   this.speaker_name = item[2];
      // }

      var sound_effect = "#conversation";
      $(sound_effect).prop("volume", 0.4);
      $(sound_effect).trigger("play");
    }
  }


  conversationAction() {
    if (this.game.properties["last_action"] == null || Date.now() - this.game.properties["last_action"] > 100) {
      this.game.properties["last_action"] = Date.now();
    } else {
      return;
    }

    if (this.partial_text != this.full_text) {
      this.partial_text = this.full_text;
    } else {
      if (this.full_text != "_interactive_") {
        if (this.conversation_queue.length > 0) {
          this.conversationStep();
        } else {
          if (this.endConversationAction != null) {
            this.endConversationAction();
            this.endConversationAction = null;
          }
          this.full_text = null;
          this.partial_text = null;
          if (this.mode == "conversation") {
            this.mode = "active";
          }
        }
      } else {
        if (this.interactive_choice == 0) {
          console.log("choice 0");
          this.action_1();
        } else {
          console.log("choice 1");
          this.action_2();
        }
        console.log(this.conversation_queue);
        if (this.conversation_queue.length > 0) {
          this.conversationStep();
        } else {
          if (this.endConversationAction != null) {
            this.endConversationAction();
            this.endConversationAction = null;
          }
          this.full_text = null;
          this.partial_text = null;
          this.mode = "active";
        }
      }
    }
  }


  testWalk(character, direction, test_number) {
    var x1 = character.x;
    var y1 = character.y + 40; // footing
    var x2 = character.x;
    var y2 = character.y + 40; // footing

    // Calculate the future walk position; we'll be using
    // Both the old and new positions in calculations below.
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

    // Check all the other draw objects (npcs, characters, things).
    // If they're not too close, OR they're the same name character,
    // OR they're on the same team, or moving would take you further
    // away from them, it's okay to proceed. Otherwise return null.
    for (var i = 0; i < this.drawObjects.length; i++) {
      var object = this.drawObjects[i];
      if (object.name != character.name && object.team != character.team) {
        var x3 = object.x;
        var y3 = object.y + 40;
        if (distance(x2, y2, x3, y3) <= object.radius && distance(x2, y2, x3, y3) < distance(x1, y1, x3, y3)) {
          return null;
        }
      }
    }

    if (x2 != x1 || y2 != y1) {

      // Check all the doors
      if (character.name == "Gun" || character.name == "Tune") {
        for (var i = 0; i < this.doors.length; i++) {
          var door = this.doors[i];
          var self = this;
          if (door.lineTest(x1, y1, x2, y2)) {
            if (door.allowed_directions.includes(direction)) {
              door.flashColor("#0000FF", 500);
              door.action();
              return null;
            }
          }
        }
      }

      // Two times, check all the walls, and potentially either change the direction
      // or set it to null. We do this two times to account for A changes which could
      // need nullification by B, and vice versa.
      var alt_direction = direction;
      var line_collision = false;
      for (var twice = 0; twice < 2; twice++) {
        for (var i = 0; i < this.lines.length; i++) {
          var line = this.lines[i];
          if (line.lineTest(x1, y1, x2, y2)) {
            line_collision = true;
            line.flashColor("#0000FF", 500);

            // if we're already stopped, don't keep going.
            // never stop never stopping, Matthew.
            // What I mean is, if the direction has already been changed to null,
            // There's no point in re-investigating and accidentally changing it back.
            if (alt_direction != null) {
              if (line.allowed.includes(alt_direction)) {
                console.log("Ref: I'll allow it because it's away from the line.");
              } else {
                if (line.snap_slope == 0) {
                  if (alt_direction == "up" || alt_direction == "down") {
                    alt_direction = null;
                  } else if (alt_direction == "upleft" || alt_direction == "downleft") {
                    alt_direction = "left";
                  } else if (alt_direction == "upright" || alt_direction == "downright") {
                    alt_direction = "right";
                  }
                } else if (line.snap_slope == 90) {
                  if (alt_direction == "left" || alt_direction == "right") {
                    alt_direction = null;
                  } else if (alt_direction == "upleft" || alt_direction == "upright") {
                    alt_direction = "up";
                  } else if (alt_direction == "downleft" || alt_direction == "downright") {
                    alt_direction = "down";
                  }
                } else if (line.snap_slope == 45) {
                  if (alt_direction == "downright" || alt_direction == "upleft") {
                    alt_direction = null;
                  } else if (alt_direction == "up" || alt_direction == "right") {
                    alt_direction = "upright";
                  } else if (alt_direction == "down" || alt_direction == "left") {
                    alt_direction = "downleft";
                  }
                } else if (line.snap_slope == -45) {
                  if (alt_direction == "downleft" || alt_direction == "upright") {
                    alt_direction = null;
                  } else if (alt_direction == "up" || alt_direction == "left") {
                    alt_direction = "upleft";
                  } else if (alt_direction == "down" || alt_direction == "right") {
                    alt_direction = "downright";
                  }
                }
              }
            }
          }
        }
      }

      if (line_collision) {
        // finally, return the chance of direction if and only if we can draw it
        if (load_sprites[character.sprite_name].includes(alt_direction)) {
          return alt_direction;
        } else {
          // otherwise return null
          return null;
        }
      }
    }

    // if nothing change or was returned, return the original direction as safe
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


  action(character) {
    if (this.game.properties["last_action"] == null || Date.now() - this.game.properties["last_action"] > 100) {
      this.game.properties["last_action"] = Date.now();
    } else {
      return;
    }

    // Determine closest action
    var closest_object = null;
    var closest_distance = -1;

    var x1 = character.x;
    var y1 = character.y + 40; // footing

    for (var i = 0; i < this.drawObjects.length; i++) {
      var object = this.drawObjects[i];
      if (object.name != character.name && object.team != character.team) {
        var x3 = object.x;
        var y3 = object.y + 40;
        if (distance(x2, y2, x3, y3) <= object.radius) {
          return null;
        }
      }
    }

    for (var i = 0; i < this.things.length; i++) {
      var thing = this.things[i];
      if (thing.action == null) continue;
      var x2 = thing.x;
      var y2 = thing.y + 40;
      var dist = distance(x1, y1, x2, y2);
      if (dist < (thing.radius + 10) && (closest_distance == -1 || dist < closest_distance)) {
        closest_object = thing;
        closest_distance = dist;
      }
    }
    for (var i = 0; i < this.npcs.length; i++) {
      var npc = this.npcs[i];
      if (npc.action == null) continue;
      var x2 = npc.x;
      var y2 = npc.y + 40;
      var dist = distance(x1, y1, x2, y2);
      if (dist < (npc.radius + 10) && (closest_distance == -1 || dist < closest_distance)) {
        closest_object = npc;
        closest_distance = dist;
      }
    }

    if (closest_object != null) {
      closest_object.action();
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



  handleKeyUp(ev) {
    if (this.mode == "active") {
      if (ev.key === "s") {
        this.teamSwap();
      }

      if (ev.key === "a") {
        this.action(this.team[0]);
      }
    } else if (this.mode == "conversation") {
      if (ev.key === "a") {
        this.conversationAction();
      }

      if (this.full_text == "_interactive_") {
        if (ev.key === "ArrowUp" || ev.key == "ArrowDown") {
          if (this.game.properties["last_action"] == null || Date.now() - this.game.properties["last_action"] > 100) {
            this.game.properties["last_action"] = Date.now();
          } else {
            return;
          }

          this.interactive_choice = (this.interactive_choice + 1) % 2;

          // TO DO sound here
          var sound_effect = "#down";
          if (ev.key == "ArrowUp") sound_effect = "#up";
          $(sound_effect).load();
          $(sound_effect).prop("volume", 0.4);
          $(sound_effect).trigger("play");
        }
      }
    }

    if (ev.key == "p") {
      this.game.properties["have_seen_show"] = 1;
      this.game.gotoScene("Show")
    }
  }
  
}


  







