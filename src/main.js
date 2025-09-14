

import Phaser from "phaser";
import StartScene from "./StartScene.js";
import FightScene from "./FightScene.js";
import WinScene from "./WinScene.js";
import GameOverScene from './GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [StartScene, FightScene, WinScene,GameOverScene],
  parent: "game"
};

new Phaser.Game(config);
