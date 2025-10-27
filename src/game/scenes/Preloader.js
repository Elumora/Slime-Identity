import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(960, 540, 'loading-bg').setDisplaySize(1920, 1080);

        const barWidth = 600;
        const barHeight = 30;
        const barX = 960;
        const barY = 900;

        this.add.rectangle(barX, barY, barWidth, barHeight).setStrokeStyle(2, 0xffffff);
        const bar = this.add.rectangle(barX - barWidth / 2, barY, 0, barHeight - 4, 0xffffff).setOrigin(0, 0.5);

        this.load.on('progress', (progress) => {
            bar.width = (barWidth - 4) * progress;
        });
    }

    preload ()
    {
        this.load.image('menu-bg', 'assets/GUI/menu-background-opt.png');
        this.load.image('logo', 'assets/GUI/slime-identity-logo.png');
        this.load.image('slime-bleu', 'assets/GUI/slime-bleu-opacite.png');
        this.load.image('quest-start', 'assets/GUI/quest-start.png');
        this.load.image('button-green', 'assets/GUI/button-green.png');
        this.load.image('button-red', 'assets/GUI/button-red.png');
        this.load.audio('jump', 'assets/Audio/GUI/jump.mp3');
        this.load.audio('menu-music', 'assets/Audio/BGM/menu-music.mp3');
        
        this.load.image('card-template', 'assets/GUI/card-template.png');
        this.load.image('card-absorbtion', 'assets/Cards/absorbtion-de-mana.png');
        this.load.image('card-armure', 'assets/Cards/armure-molle.png');
        this.load.image('card-assimilation', 'assets/Cards/assimilation.png');
        this.load.image('card-cycle', 'assets/Cards/cycle-des-fluides.png');
        this.load.image('card-division', 'assets/Cards/division-controlee.png');
        this.load.image('card-durcissement', 'assets/Cards/durcissement.png');
        this.load.image('card-frappe', 'assets/Cards/frappe-visqueuse.png');
        this.load.image('card-limon', 'assets/Cards/limon-entravant.png');
        this.load.image('card-acide', 'assets/Cards/projection-acide.png');
        this.load.image('card-gelatineuse', 'assets/Cards/projection-gelatineuse.png');
        this.load.image('card-transfusion', 'assets/Cards/transfusion-visqueuse.png');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
