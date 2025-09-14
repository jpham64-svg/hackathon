import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    // Load assets (background, buttons, etc.)
    
  }

  create() {
    this.add.text(200, 150, "STEM Fighting Game", { fontSize: "32px", fill: "#fff" });
    this.add.text(200, 250, "Press SPACE to Start", { fontSize: "20px", fill: "#fff" });

    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("FightScene");
    });
  }
}
