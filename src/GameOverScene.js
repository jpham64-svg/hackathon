import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    // Get classes that were not completed
    this.missedClasses = data?.missedClasses || [];
  }

  preload() {
    // Use any asset you want for a "failure" icon
    this.load.image("brokenCup", "assets/sprites/skull.png"); // placeholder, replace with a broken cup sprite
  }

  create() {
    this.cameras.main.setBackgroundColor("#111");

    // Big fail text
    this.add.text(400, 100, "💀 You Failed! 💀", {
      fontSize: "40px",
      color: "#ff3333",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Broken cup / fail icon
    this.add.image(400, 200, "brokenCup").setScale(0.6);

    // Subtitle
    this.add.text(400, 280, "You couldn’t graduate...", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Missed courses list
    this.add.text(150, 340, "Courses NOT Completed:", {
      fontSize: "20px",
      color: "#ff5555",
      fontStyle: "bold"
    });

    if (this.missedClasses.length === 0) {
      this.add.text(180, 380, "All courses attempted but lives lost!", {
        fontSize: "18px",
        color: "#ffaaaa"
      });
    } else {
      this.missedClasses.forEach((course, index) => {
        this.add.text(180, 380 + index * 30, `❌ ${course}`, {
          fontSize: "18px",
          color: "#ffffff"
        });
      });
    }

    // Restart instructions
    this.add.text(400, 550, "Press R to Try Again", {
      fontSize: "18px",
      color: "#ff4444"
    }).setOrigin(0.5);

    // Restart key
    this.input.keyboard.on("keydown-R", () => {
      this.scene.start("StartScene");
    });
  }
}
