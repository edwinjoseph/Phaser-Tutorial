import Phaser from 'phaser';
import images from '../../assets/*.png'

let platforms;
let player;
let stars;
let bombs;

let scoreText;
let score = 0;

let gameOver;

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
      key: 'idle',
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

      score += 10;
      scoreText.setText(`Score: ${score}`);

      if (!stars.countActive()) {
        stars.children.iterate(child => {
          child.enableBody(true, child.x, 0, true, true);
        });

        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = bombs.create(x, 16, 'bomb');

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, () => {
      this.physics.pause();
      player.setTint(0xFF0000);
      player.anims.play('idle');
      gameOver = true;
    }, null);

    scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    });    
  }

  update() {
    const { left, right, up } = this.input.keyboard.createCursorKeys();

    if (!gameOver) {
      if (left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      } else if (right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
      } else {
        player.setVelocityX(0);
        player.anims.play('idle');
      }

      if (up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }
    } else {
      player.setVelocityX(0);
      player.anims.play('idle');
    }
  }
}

export default Main;
