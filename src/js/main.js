import Phaser from 'phaser';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';

import Start from './scenes/Start';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'main',
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  dom: {
    createContainer: true
  },
  plugins: {
    global: [{
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true
    }],
  },
  scene: [Start, Game],
}

export const game = new Phaser.Game(config);