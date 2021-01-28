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

    this.gotoScene("TitleCard");
    // this.scenes["TitleCard"] = new TitleCardScene(this);
    // this.scene = this.scenes["TitleCard"];
    // this.scene.start();

    this.team = [];
    this.team.push(new Character(canvas, this, "Gun", "Gun"));
    this.team.push(new Character(canvas, this, "Tune", "Tune"));

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
      } else if (scene_name == "TitleCard") {
        this.scenes["TitleCard"] = new TitleCardScene(this);
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


// function distance(x1, y1, x2, y2) {
//   var x_diff = Math.abs(x1 - x2);
//   var y_diff = Math.abs(y1 - y2);
//   return Math.sqrt(x_diff*x_diff + y_diff*y_diff);
// }

// function insideEllipse(e_x, e_y, e_width, e_height, x, y) {
//   return Math.pow(x - e_x, 2) / Math.pow(e_width, 2) + Math.pow(y - e_y, 2) / Math.pow(e_height, 2) <= 1;
// }

