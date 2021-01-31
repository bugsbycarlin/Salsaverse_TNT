class Game {
  constructor() {
    $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.context = canvas.getContext('2d');
    this.canvas.style.visibility = 'visible';
    this.loadingdiv = document.getElementById('loadingdiv');
    this.loadingdiv.style.visibility = 'hidden';

    var self = this;

    document.addEventListener("keydown", function(ev) {self.handleKeyDown(ev)}, false);
    document.addEventListener("keyup", function(ev) {self.handleKeyUp(ev)}, false);
    document.addEventListener("click", function(ev) {self.handleMouse(ev)}, false);
    this.keymap = {}

    this.scenes = {};

    this.properties = {};

    this.gotoScene("TitleCard");
    // this.scenes["TitleCard"] = new TitleCardScene(this);
    // this.scene = this.scenes["TitleCard"];
    // this.scene.start();

    this.conversation = new Image();
    this.conversation.src = "Art/Extras/conversation.png";
    this.marker = new Image();
    this.marker.src = "Art/Extras/marker.png";
    this.side_marker = new Image();
    this.side_marker.src = "Art/Extras/side_marker.png";

    this.team = [];
    this.team.push(new Character(canvas, this, "Gun", "Gun"));
    this.team.push(new Character(canvas, this, "Tune", "Tune"));
    this.team[0].team = "team";
    this.team[1].team = "team";

    setInterval(function() {self.update()},33);
  }


  update() {
    if (this.scene != null) {
      this.scene.update();
      this.scene.render();
    }
  }


  gotoScene(scene_name, additional_command = "") {
    // Make it if it doesn't exist
    if (this.scenes["scene_name"] == null) {
      if (scene_name == "Stage") {
        this.scenes["Stage"] = new Level(this, "Stage");
      } else if (scene_name == "Bathroom") {
        this.scenes["Bathroom"] = new Level(this, "Bathroom");
      } else if (scene_name == "Backstage") {
        this.scenes["Backstage"] = new Level(this, "Backstage");
      } else if (scene_name == "End") {
        this.scenes["End"] = new EndScene(this);
      } else if (scene_name == "TitleCard") {
        this.scenes["TitleCard"] = new TitleCardScene(this);
      } else if (scene_name == "Venue") {
        this.scenes["Venue"] = new VenueScene(this);
      } else if (scene_name == "Show") {
        this.scenes["Show"] = new ShowScene(this);
      }
    }

    // Set it as the current scene
    this.scene = this.scenes[scene_name];

    // Load or reset the scene
    this.scene.start();

    // Potentially do an additional thing
    if (scene_name == "Stage" && additional_command == "bathroom_start") {
      this.team[0].x = 150 - 960;
      this.team[0].y = 630 - 540;
      this.team[1].x = 130 - 960;
      this.team[1].y = 628 - 540;
    } else if (scene_name == "Stage" && additional_command == "post_show_start") {
      this.team[0].x = 0;
      this.team[0].y = 0;
      this.team[1].x = 30;
      this.team[1].y = -5;
    } else if (scene_name == "Stage" && additional_command == "backstage_start") {
      this.team[0].x = 260 - 960;
      this.team[0].y = 520 - 540;
      this.team[1].x = 270 - 960;
      this.team[1].y = 515 - 540;
    }
  }


  soundEffect(effect_name) {
    if (this.properties["sound_effect"] == null) {
      var sound_effect = "#" + effect_name;
      $(sound_effect).prop("volume", 0.6);
      $(sound_effect).trigger("play");
      var self = this;
      setTimeout(function() {
        self.properties["sound_effect"] = null;
      }, 800);
    }
  }


  setMusic(music_name, second_param) {
    if (this.music_name == null || this.music_name != music_name) {
      this.music_name = music_name
      this.music = $("#" + this.music_name);
      this.music.load();
      this.music.prop("volume", 0.3);
      var self = this;

      if (second_param == "loop") {
        this.music.bind("ended", function(){
          self.music.trigger("play");
        });
      } else if (second_param != null) {
        this.music.bind("ended", function(){
          second_param();
        });
      }

      this.music.trigger("play");
    }
  }


  stopMusic() {
    if (this.music != null) {
      this.music.trigger("pause");
      this.music_name = null;
    }
  }


  handleKeyUp(ev) {
    this.keymap[ev.key] = null;

    if (this.scene.handleKeyUp != null) {
      this.scene.handleKeyUp(ev);
    }
  }


  handleKeyDown(ev) {
    this.keymap[ev.key] = true;

    if (this.scene.handleKeyDown != null) {
      this.scene.handleKeyDown(ev);
    }
  }

  handleMouse(ev) {
    if (this.scene.handleMouse != null) {
      this.scene.handleMouse(ev);
    }
  }
}

game = null;
function initialize() {
  game = new Game();
}


