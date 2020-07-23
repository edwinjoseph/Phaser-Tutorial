import Phaser from 'phaser';

let player;
let background;
let starCollected;
let starsCollected;
let bombBounce;
let death;
let gameOver;

class Main extends Phaser.Scene {
  constructor() {
    super({
      key: 'game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
        }
      },
    });
  }

  preload() {
    background = this.sound.add('background', {
      volume: 0.1,
      loop: true,
    });
    starCollected = this.sound.add('star_collected', {
      volume: 0.06
    });
    starsCollected = this.sound.add('stars_collected', {
      volume: 0.06
    });
    bombBounce = this.sound.add('bomb_bounce', {
      volume: 0.06
    });
    death = this.sound.add('death', {
      volume: 0.3
    });
  }

  create() {
    let platforms;
    let stars;
    let bombs;
    
    let scoreText;
    let score = 0;

    background.play();

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
    this.anims.create({
      key: 'jump_left',
      frames: [{ key: 'player', frame: 3 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'jump_right',
      frames: [{ key: 'player', frame: 6 }],
      frameRate: 20
    });

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    
    stars.children.iterate(child => {
      child.setGravity(0, 10)
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, (_, star) => {
      star.disableBody(true, true);
      starCollected.play();
      score += 10;
      scoreText.setText(`Score: ${score}`);

      if (!stars.countActive()) {
        starCollected.stop();
        starsCollected.play();
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

    this.physics.add.collider(bombs, platforms, () => {
      bombBounce.play();
    });
    this.physics.add.collider(player, bombs, () => {
      starCollected.stop();
      starsCollected.stop();
      death.play();

      this.physics.pause();

      player.setTint(0xFF0000);
      player.anims.play('idle');
      gameOver = true;

      this.time.addEvent({
        delay: 1000,
        callback: () => {
          gameOver = null;
          background.stop();
          this.physics.resume();
          this.scene.restart();
        }
      })
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

      if (!player.body.touching.down) {
        if (left.isDown) {
          player.anims.play('jump_left', true);
        }
        if (right.isDown) {
          player.anims.play('jump_right', true);
        } 
      }
    } else {
      player.setVelocityX(0);
      player.anims.play('idle');
    }
  }
}

export default Main;
