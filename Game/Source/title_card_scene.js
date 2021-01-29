
class TitleCardScene {
  constructor(game) {
    this.game = game;
    this.context = game.context;
    this.canvas = game.canvas;

    this.start_time = Date.now();

    this.scene_name = "TitleCard";

    this.cards = [];
    this.cards.push({
      alpha: 0,
      size: 40,
      x: 640,
      y: 100,
      text: "Mattsby"
    })
    this.cards.push({
      alpha: 0,
      size: 40,
      x: 640,
      y: 175,
      text: "Presents"
    })
    this.cards.push({
      alpha: 0,
      size: 80,
      x: 640,
      y: 325,
      text: "TNT"
    })
    this.cards.push({
      alpha: 0,
      size: 40,
      x: 640,
      y: 600,
      text: "A Salsaverse Vignette"
    })
    this.cards.push({
      alpha: 0,
      size: 40,
      x: 640,
      y: 325,
      text: "Click to Start"
    })
  }


  start() {
    this.start_time = Date.now();
    this.mode = "active";
  }


  update() {
    if (this.mode == "active") {
      if (Date.now() - this.start_time > 4000) {
        this.cards[0].alpha -= 0.02
      } else if (Date.now() - this.start_time > 500) {
        this.cards[0].alpha += 0.02
        this.cards[0].alpha = Math.min(1.0, this.cards[0].alpha)
      }

      if (Date.now() - this.start_time > 5000) {
        this.cards[1].alpha -= 0.02
      } else if (Date.now() - this.start_time > 1500) {
        this.cards[1].alpha += 0.02
        this.cards[1].alpha = Math.min(1.0, this.cards[1].alpha)
      }

      if (Date.now() - this.start_time > 6000) {
        this.cards[2].alpha -= 0.02
      } else if (Date.now() - this.start_time > 3000) {
        this.cards[2].alpha += 0.02
        this.cards[2].alpha = Math.min(1.0, this.cards[2].alpha)
      }

      if (Date.now() - this.start_time > 7000) {
        this.cards[3].alpha -= 0.02
      } else if (Date.now() - this.start_time > 5000) {
        this.cards[3].alpha += 0.02
        this.cards[3].alpha = Math.min(1.0, this.cards[3].alpha)
      }


      if (Date.now() - this.start_time > 8000) {
        this.cards[4].alpha += 0.02
        this.cards[4].alpha = Math.min(1.0, this.cards[4].alpha)
      }
    }
  }

  
  render() {
    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

    // drawImage(tune_images[gun_walk_image], character.x, character.y);
    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];
      if (card.alpha >= 0) {
        this.context.globalAlpha = Math.min(1.0,card.alpha);
        this.context.font = card.size + "px Minecraft";
        this.context.fillStyle = "white";
        this.context.textBaseline = "top";
        this.context.textAlign = "center";
        this.context.fillText (card.text, card.x, card.y);
        this.context.globalAlpha = 1.0;
      }
    }
  }


  handleMouse(ev) {
    this.game.gotoScene("Show");
  }
  
}


  







