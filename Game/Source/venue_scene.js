
class VenueScene {
  constructor(game) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.start_time = Date.now();

    this.scene_name = "Venue";

    this.characters = [];

    this.fade_alpha = 1.0;
  }


  start() {
    var self = this;

    this.level_image = new Image();
    this.level_image.src = "Art/Levels/venue.png";

    this.start_time = Date.now();
    this.mode = "fade_in";

    this.characters.push(new Character(canvas, this, "Gun", "Gun", 970, 230, null, null));
    this.characters.push(new Character(canvas, this, "Tune", "Tune", 1020, 230, null, null));


    // setTimeout(function() {
    //   self.game.gotoScene("Stage", "post_show_start");
    // }, 5000);
  }


  update() {
    if (this.mode == "fade_in" || this.mode == "active") {
      

      for (var i = 0; i < this.characters.length; i++) {
        var character = this.characters[i];
        character.x -= character.walk_speed;
        character.direction = "left";
        character.walkAnimation();
      }
      var self = this;
      if (this.characters[0].x <= 500) {
        self.mode = "fade_out";
        self.fade_alpha = 0;
        setTimeout(function() {
          self.game.gotoScene("Stage");
        }, 800);
      }
    }

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
    }
  }

  
  render() {
    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.context.drawImage(this.level_image, 0, 0);

    for (var i = 0; i < this.characters.length; i++) {
      var character = this.characters[i];
      this.context.drawImage(character.images[character.current_image], character.x, character.y);
    }

    this.context.globalAlpha = Math.max(0,Math.min(1.0,this.fade_alpha));
    this.context.drawImage(black_screen, 0, 0);
    this.context.globalAlpha = 1.0;    
  } 
}


  







