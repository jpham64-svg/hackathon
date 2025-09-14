export class Library extends Phaser.Scene
{   
    constructor() {
        super('Library');
    }
    
    preload ()
    {
        // this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.image('block', 'assets/crate32.png');
        this.load.image('ice', 'assets/block-ice.png');
        this.load.spritesheet('be', 'assets/hackathon_idle.png',{frameWidth:15,frameHeight:25});
        this.load.spritesheet('bedown', 'assets/hackathon_walkdown.png',{frameWidth:15,frameHeight:25});
    }

    create ()
    {   
        this.player = this.physics.add.sprite(400, 300, 'be').setScale(2.0125,2.0125);
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('bedown', { start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'be', frame: 0 } ],
        });

        this.player.setCollideWorldBounds(true);
        this.player.setPushable(false);

        const boxes = [];

        for (let i = 0; i < 16; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            const box = this.physics.add.image(x, y, 'block');

            box.setCollideWorldBounds(true);
           // box.setDrag(1000);
            box.body.slideFactor.set(0, 0);

            boxes.push(box);
        }

        for (let i = 0; i < 16; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            const box = this.physics.add.image(x, y, 'ice').setScale(0.125);

            box.setCollideWorldBounds(true);
            box.setDrag(100);
            box.setBounce(1);

            boxes.push(box);
        }
        
        let playerIsNPC = false;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, boxes, null, (player, box) => {

            if (playerIsNPC)
            {
                box.setPushable(false);
            }
            else
            {
                box.setPushable(true);
            }

            return true;

        });

        this.input.on('pointerdown', () => {

            playerIsNPC = !playerIsNPC;

            if (playerIsNPC)
            {
                this.player.setTint(0xff0000);
            }
            else
            {
                this.player.clearTint();
            }

        });
    }

    update ()
    {
        this.player.setVelocity(0, 0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200);
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-200);
        } 
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(200);
            this.player.anims.play('down', true);
        }
        else {
            this.player.anims.play('idle');
        }
    }
}
