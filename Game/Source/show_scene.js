
class ShowScene {
  constructor(game) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.start_time = Date.now();

    this.scene_name = "Show";
  }


  start() {
    this.start_time = Date.now();
    this.mode = "active";

    var self = this;
    setTimeout(function() {
      self.game.gotoScene("Stage", "post_show_start");
    }, 5000);
  }


  update() {
    
  }

  
  render() {
    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);


    this.context.font = "60px Minecraft";
    this.context.fillStyle = "white";
    this.context.textBaseline = "top";
    this.context.textAlign = "center";
    this.context.fillText ("NOW THERE IS SHOW", 640, 325);
  }  
}


  







