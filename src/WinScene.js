import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  init(data) {
    // Get passed classes from FightScene
    this.passedClasses = data?.passedClasses || ['SCI130','COMM100','MATH130','ENGL102','CS101','MATH131','PHYS135','CS211','CS201','CS230','CS221','MATH225','STAT316','CS301','CS321','CS311','CS411'];
  }

  preload() {
    // Trophy or cup asset (use any sprite, replace with your asset path)
    this.load.image("cup", "assets/sprites/trophy.png");
  }

  create() {
    // Background color / overlay
    this.cameras.main.setBackgroundColor("#222");

    // Big congratulation text
    this.add.text(400, 100, "🎉 Congratulations! 🎉", {
      fontSize: "40px",
      color: "#FFD700",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Cup sprite
    this.add.image(400, 200, "cup").setScale(0.5);

    // Subtitle
    this.add.text(400, 280, "You Graduated Successfully!", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Table of passed courses
    this.add.text(150, 340, "Courses Completed:", {
      fontSize: "20px",
      color: "#00ff00",
      fontStyle: "bold"
    });

    this.passedClasses.forEach((course, index) => {
      this.add.text(10, 30 + index * 30, `✅ ${course}`, {
        fontSize: "18px",
        color: "#ffffff"
      });
    });

    // Restart instructions
    this.add.text(400, 550, "Press R to Restart", {
      fontSize: "18px",
      color: "#ff4444"
    }).setOrigin(0.5);

    // Key listener
    this.input.keyboard.on("keydown-R", () => {
      this.scene.start("StartScene");
    });
  }
}
