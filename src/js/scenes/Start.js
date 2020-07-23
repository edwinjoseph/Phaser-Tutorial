import Phaser from 'phaser';
import images from '../../assets/*.png';
import sounds from '../../assets/*.mp3';

class Start extends Phaser.Scene {
  constructor() {
    super({
      key: 'start',
    })
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const centeredHorizontily = width / 2;
    const centeredVertically = height / 2;


    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(centeredHorizontily - 160, centeredVertically - 30, 320, 50);

    const loadingText = this.make.text({
      x: centeredHorizontily,
      y: centeredVertically - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: centeredHorizontily,
      y: centeredVertically - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: centeredHorizontily,
      y: centeredVertically + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);


    this.load.image('phaser', images.phaser);
    this.load.image('zapsplat', images.zapsplat);

    this.load.image('sky', images.sky);
    this.load.image('ground', images.platform);
    this.load.image('star', images.star);
    this.load.image('bomb', images.bomb);
    this.load.spritesheet('player', images.dude, {
      frameWidth: 32,
      frameHeight: 48,
    });

    console.log(images, sounds);

    this.load.audio('background', sounds.background);
    this.load.audio('star_collected', sounds.star_collected);
    this.load.audio('stars_collected', sounds.stars_collected);
    this.load.audio('death', sounds.death);
    this.load.audio('bomb_bounce', sounds.bomb_bounce);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(centeredHorizontily - 150, centeredVertically - 20, 300 * value, 30);

      percentText.setText(`${parseInt(value * 100, 10)}%`);
    });            
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }
  
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const centeredHorizontily = width / 2;
    const centeredVertically = height / 2;

    const logoText = this.make.text({
      x: centeredHorizontily,
      y: centeredVertically - 50,
      text: 'Made with',
      style: {
        fill: '#ffffff'
      }
    });
    logoText.setOrigin(0.5, 0.5);

    const phaserImage = this.add.image(centeredHorizontily, centeredVertically, 'phaser');
    
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        phaserImage.destroy();
        logoText.setText('Sounds from');
        this.add.image(centeredHorizontily, centeredVertically, 'zapsplat');

        this.time.addEvent({
          delay: 2000,
          callback: () => {
            this.scene.start('game')
          }
        })
      }
    })
  }
}

export default Start;
