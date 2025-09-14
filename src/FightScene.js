import Phaser from "phaser";

export default class FightScene extends Phaser.Scene {
  constructor() {
    super("FightScene");
    this.lives = 5; // start with 5 hearts
  }

  preload() {
    // Assets
    this.load.image("block", "assets/sprites/crate32.png");
    this.load.image("ice", "assets/sprites/block-ice.png");
    this.load.spritesheet('be', 'assets/sprites/player_idle.png',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('bedown', 'assets/sprites/player_walking.png',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('beup', 'assets/sprites/player_walk_back.png',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('beleft', 'assets/sprites/player_walk_left.png',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('beright', 'assets/sprites/player_walk_right.png',{frameWidth:32,frameHeight:32});
    this.load.image("goal", "assets/sprites/desk.png");
    this.load.image("traugott", "assets/sprites/professor.png");
    this.load.spritesheet('heart', 'assets/sprites/heart.png',{frameWidth:16,frameHeight:16});
  }

  create() {
    // Player spawn (bottom-left)
    this.player = this.physics.add.sprite(50, 550, 'be').setBodySize(14,25,true).setScale(2.5,2.5);
    
    // Player animations
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('beup', { start: 0, end: 1}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('bedown', { start: 0, end: 1}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('beleft', { start: 0, end: 1}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('beright', { start: 0, end: 1}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'be', frame: 0 } ],
    });
    
    this.player.setCollideWorldBounds(true);
    this.player.setPushable(false);

    // Invincibility at start
    this.invincible = true;
    this.player.setAlpha(0.5);
    this.time.delayedCall(2000, () => {
      this.invincible = false;
      this.player.setAlpha(1);
    });

    // Goal at top-right
    this.physics.add.staticImage(761,40,"traugott").setScale(2.5);
    this.goal = this.physics.add.staticImage(760, 60, "goal").setScale(1.25);

    // Life hearts
    this.hearts = [];
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(30 + i * 40, 30, "heart").setScrollFactor(0);
      heart.setScale(2);
      this.hearts.push(heart);
    }

    // Obstacles group
    this.obstacles = this.physics.add.group();

    // Track classes
    this.classNames = ['SCI130','COMM100','MATH130','ENGL102','CS101','MATH131','PHYS135','CS211','CS201','CS230','CS221','MATH225','STAT316','CS301','CS321','CS311','CS411'];
    this.classesPassed = new Set();
    this.classesMissed = new Set();
    this.iceCubes = [];

    // Safe zone (bottom-left) for spawning
    const safeZone = new Phaser.Geom.Rectangle(0, 500, 150, 100);

    // Add damage crates
    for (let i = 0; i < 10; i++) {
      let x, y; 
      do {
        x = Phaser.Math.Between(50, 750);
        y = Phaser.Math.Between(50, 550);
      } while (safeZone.contains(x, y));

      const box = this.obstacles.create(x, y, "block");
      box.setCollideWorldBounds(true);
      box.setBounce(1);
      box.setVelocity(
        Phaser.Math.Between(-120, 120),
        Phaser.Math.Between(-120, 120)
      );
      box.type = "crate"; // mark type
    }

    // Add ice cubes (classes)
    for (let i = 0; i < this.classNames.length; i++) {
      let x, y;
      do {
        x = Phaser.Math.Between(100, 700);
        y = Phaser.Math.Between(100, 500);
      } while (safeZone.contains(x, y));

      const cube = this.obstacles.create(x, y, "ice").setScale(0.25);
      cube.setCollideWorldBounds(true);
      cube.setBounce(1);
      cube.body.setSize(cube.width * 0.5, cube.height * 0.5);
      cube.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
      cube.type = "class";

      // Add label
      const label = this.add.text(x, y, this.classNames[i], {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#00000080",
        padding: { x: 2, y: 1 },
      }).setOrigin(0.5);

      this.iceCubes.push({ cube, label, name: this.classNames[i] });
    }

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Colliders
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    // Obstacles collide with each other
    this.physics.add.collider(this.obstacles, this.obstacles);

    // Update labels to follow cubes
    this.events.on("update", () => {
      this.iceCubes.forEach(obj => {
        obj.label.setPosition(obj.cube.x, obj.cube.y);
      });
    });


  }

  update() {
    if (!this.player) return;

    this.player.setVelocity(0);

    // Player movement
    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-200);
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(200);
        this.player.anims.play('right', true);
    }

    if (this.cursors.up.isDown)
    {
        this.player.setVelocityY(-200);
        this.player.anims.play('up', true);
    } 
    else if (this.cursors.down.isDown)
    {
        this.player.setVelocityY(200);
        this.player.anims.play('down', true);
    }

    if(this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp)
    {
      this.player.anims.play('idle');
    }
  }

  hitObstacle(player, obstacle) {
    if (this.invincible) return;

    if (obstacle.type === "crate") {
      // Damage only from crates
      this.takeDamage(obstacle);
    } else if (obstacle.type === "class") {
      // Passing class
      const classObj = this.iceCubes.find(obj => obj.cube === obstacle);
      if (classObj && !this.classesPassed.has(classObj.name)) {
        this.classesPassed.add(classObj.name);
        classObj.label.setColor("#00ff00"); // turn green
        this.add.text(10, 30 + this.classesPassed.size*30, `✅ ${classObj.name}`, { //Shows completed course on the left
        fontSize: "18px",
        color: "#ffffff"
      });
      }
    }
  }

  takeDamage(obstacle) {
    this.invincible = true;
    this.player.setAlpha(0.5);
    this.time.delayedCall(1000, () => {
      this.invincible = false;
      this.player.setAlpha(1);
    });

    obstacle.setTint(0xff0000);
    this.time.delayedCall(200, () => obstacle.clearTint());

    this.lives -= 1;
    this.hearts[this.lives].setVisible(false);

    if (this.lives <= 0) {
      
      this.scene.start("GameOverScene");
    }
  }

  reachGoal() {
    if (this.classesPassed.size >= this.classNames.length) {
      this.scene.start("WinScene");
    } else {
      this.add.text(300, 20, "Finish all classes first!", {
        fontSize: "16px",
        color: "#ff0000"
      }).setScrollFactor(0).setDepth(10);
    }
  }
}
