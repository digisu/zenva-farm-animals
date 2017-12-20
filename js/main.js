var game = new Phaser.Game(640, 360, Phaser.AUTO);

var GameState = {
  preload: function(){
    this.load.image('bg', 'assets/images/background.png');
    this.load.image('chicken', 'assets/images/chicken.png');
    this.load.image('horse', 'assets/images/horse.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('sheep', 'assets/images/sheep.png');
  },
  create: function(){
    this.background = this.game.add.sprite(0, 0, 'bg');
    this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'chicken');
    this.chicken.anchor.setTo(0.5);
    this.chicken.scale.setTo(0.5);

    this.pig = this.game.add.sprite(150, 100, 'pig');
    this.pig.anchor.setTo(0.5);
    this.pig.scale.setTo(-1, 1);
  },
  update: function(){

  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');