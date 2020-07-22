import Phaser from 'phaser';
import images from '../../assets/*.png'

let platforms;
let player;
let stars;

class Main extends Phaser.Scene {
  constructor() {
    super({
      key: 'main',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
    });
  }

  preload() {
    this.load.image('sky', images.sky);
    this.load.image('ground', images.platform);
    this.load.image('star', images.star);
    this.load.image('bomb', images.bomb);
    this.load.spritesheet('player', images.dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, 'ground')
      .setScale(2)
      .refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'player');

    player.setBounce(0.2);
    player.setCollideWorldBounds();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, (_, star) => {
      star.disableBody(true, true);
    });
  }

  update() {
    const { left, right, up } = this.input.keyboard.createCursorKeys();

    if (left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
}

export default Main;
