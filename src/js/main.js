import Phaser from 'phaser';
import MainScene from './scenes/Main';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
}

export const game = new Phaser.Game(config);