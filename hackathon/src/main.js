import { Library } from './scenes/library.js';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: Library
};

const game = new Phaser.Game(config);

new Phaser.Game(config);