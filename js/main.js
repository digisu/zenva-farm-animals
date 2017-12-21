var GameState = {
  preload: function(){
    this.load.image('bg', 'assets/images/background.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    // this.load.image('chicken', 'assets/images/chicken.png');
    // this.load.image('horse', 'assets/images/horse.png');
    // this.load.image('pig', 'assets/images/pig.png');
    // this.load.image('sheep', 'assets/images/sheep.png');

    this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
    this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);

    this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
    this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
    this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
    this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);

  },
  create: function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.background = this.game.add.sprite(0, 0, 'bg');

    var animalData = [
      {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
      {key: 'horse', text: 'HORSE', audio: 'horseSound'},
      {key: 'pig', text: 'PIG', audio: 'pigSound'},
      {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'}
    ];

    this.animals = this.game.add.group();

    var animal;

    animalData.forEach((element)=>{
      animal = this.animals.create(-1000, this.game.world.centerY, element.key, 0);
      animal.customParams = {text: element.text, sound: this.game.add.audio(element.audio)};
      animal.anchor.setTo(0.5);
      animal.animations.add('animate', [0,1,2,1,0,1], 6, false);
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(this.animateAnimal, this);
    });

    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.x = this.game.world.centerX;

    this.showText(this.currentAnimal);

    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: 'left'};

    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
    this.leftArrow.events.onInputUp.add(this.animateArrow, this);

    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 'right'};

    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

  },
  update: function(){
    
  },

  switchAnimal: function(sprite, event){

    this.animateArrow(sprite, event);

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;

    this.animalText.visible = false;

    var newAnimal, endX;

    if(sprite.customParams.direction == 'right'){
      newAnimal = this.animals.next();
      newAnimal.position.x = -newAnimal.width/2;
      endX = 640 + this.currentAnimal.width/2;
    } else {
      newAnimal = this.animals.previous();
      newAnimal.position.x = 640 + newAnimal.width/2;
      endX =  -this.currentAnimal.width/2;
    }

    var newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({x: this.game.world.centerX}, 1000);
    newAnimalMovement.onComplete.add(()=>{
      this.isMoving = false;
      this.showText(newAnimal);
    }, this)
    newAnimalMovement.start();
    var currentAnimalMovement = this.game.add.tween(this.currentAnimal)
    currentAnimalMovement.to({x: endX});
    currentAnimalMovement.start();

    this.currentAnimal = newAnimal;
  },

  animateAnimal: function(sprite, event){
    sprite.animations.play('animate');
    sprite.customParams.sound.play();
  },

  animateArrow: function(sprite, event){

    if(this.isArrowAnimate){
      return false;
    }
    this.isArrowAnimate = true;

    var arrowScaleX = sprite.scale.x;
    var arrowScaleY = sprite.scale.y;

    var arrowAnimation1 = this.game.add.tween(sprite.scale);
    arrowAnimation1.to({x: arrowScaleX*1.1, y: arrowScaleY*1.1}, 100);
    arrowAnimation1.start();
    var arrowAnimation2 = this.game.add.tween(sprite.scale);
    arrowAnimation2.to({x: arrowScaleX, y: arrowScaleY}, 100);
    arrowAnimation1.onComplete.add(()=>{
      arrowAnimation2.start();
    });
    arrowAnimation2.onComplete.add(()=>{
      this.isArrowAnimate = false;
    });
  },

  showText: function(animal){
    if(!this.animalText){
      var style = {
        font: 'bold 30px Arial',
        fill: '#d0171b',
        align: 'center'
      };
      this.animalText = this.game.add.text(this.game.width/2, this.game.height*0.90, '', style);
      this.animalText.anchor.setTo(0.5);
    }
    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }

};

var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');