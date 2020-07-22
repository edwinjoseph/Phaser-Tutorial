import Phaser from 'phaser';
import images from '../../assets/*.png'

class Main extends Phaser.Scene {
  constructor() {
    super({
      key: 'main',
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
  }
}

export default Main;
