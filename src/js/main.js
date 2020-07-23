import Phaser from 'phaser';
import Start from './scenes/Start';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Start, Game],
}

export const game = new Phaser.Game(config);