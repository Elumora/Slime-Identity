import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
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

    preload() {
        this.load.image('menu-bg', 'assets/GUI/menu-background-opt.png');
        this.load.image('logo', 'assets/GUI/slime-identity-logo.png');
        this.load.image('slime-bleu', 'assets/GUI/slime-bleu-opacite.png');
        this.load.image('quest-start', 'assets/GUI/quest-start.png');
        this.load.image('button-green', 'assets/GUI/button-green.png');
        this.load.image('button-red', 'assets/GUI/button-red.png');
        this.load.image('button-blue', 'assets/GUI/button-blue.png');
        this.load.audio('jump', 'assets/Audio/GUI/jump.mp3');
        this.load.audio('logo-apparition', 'assets/Audio/GUI/logo-apparition.mp3');
        this.load.audio('menu-music', 'assets/Audio/BGM/menu-music.mp3');

        this.load.image('card-template', 'assets/GUI/card-template.png');
        this.load.image('viscousstrike', 'assets/Cards/frappe-visqueuse.png');
        this.load.image('acidprojection', 'assets/Cards/projection-acide.png');
        this.load.image('gelatinousrush', 'assets/Cards/projection-gelatineuse.png');
        this.load.image('hardening', 'assets/Cards/durcissement.png');
        this.load.image('wall', 'assets/Cards/armure-molle.png');
        this.load.image('manaabsorption', 'assets/Cards/absorbtion-de-mana.png');
        this.load.image('controlleddivision', 'assets/Cards/division-controlee.png');
        this.load.image('slowness', 'assets/Cards/limon-entravant.png');
        this.load.image('fluidcycle', 'assets/Cards/cycle-des-fluides.png');
        this.load.image('assimilation', 'assets/Cards/assimilation.png');
        this.load.image('viscoustransfusion', 'assets/Cards/transfusion-visqueuse.png');
        this.load.image('fatigue', 'assets/Cards/fatigue.png');

        // Monsters
        this.load.image('archer', 'assets/Enemies/archer.png');
        this.load.image('brute', 'assets/Enemies/brute.png');
        this.load.image('firemage', 'assets/Enemies/firemage.png');
        this.load.image('sentinellegivre', 'assets/Enemies/sentinellegivre.png');
        this.load.image('skelettonarcher', 'assets/Enemies/skelettonarcher.png');
        this.load.image('skeletonwarrior', 'assets/Enemies/skeletonwarrior.png');
        this.load.image('thief', 'assets/Enemies/thief.png');
        this.load.image('corruptedgolem', 'assets/Enemies/corruptedgolem.png');


        // Object
        this.load.audio('handleCoin', 'assets/Audio/GUI/handleCoins.ogg');

        // GUI
        this.load.image('attackIcon', 'assets/GUI/attaque.png');
        this.load.image('shieldIcon', 'assets/GUI/défense.png');
        this.load.image('fragileIcon', 'assets/GUI/fragile.png');
        this.load.image('slowIcon', 'assets/GUI/lenteur.png');
        this.load.image('dodgeIcon', 'assets/GUI/esquive.png');
        this.load.image('mana', 'assets/GUI/mana-gui.png');
        this.load.image('deck', 'assets/GUI/deck.png');
        this.load.image('defausse', 'assets/GUI/defausse.png');
        this.load.image('close', 'assets/GUI/close.png');
        this.load.audio('card_play', 'assets/Audio/Card/card-place-1.ogg');
        this.load.audio('card_draw1', 'assets/Audio/Card/card-slide-1.ogg');
        this.load.audio('card_draw2', 'assets/Audio/Card/card-slide-2.ogg');
        this.load.audio('card_draw3', 'assets/Audio/Card/card-slide-3.ogg');
        this.load.audio('card_draw4', 'assets/Audio/Card/card-slide-4.ogg');
        this.load.audio('card_draw5', 'assets/Audio/Card/card-slide-5.ogg');
        this.load.audio('card_slide', 'assets/Audio/Card/card-slide-6.ogg');
        this.load.audio('card_place', 'assets/Audio/Card/card-shove.ogg');
        this.load.audio('click2', 'assets/Audio/GUI/click2.ogg');
        this.load.audio('monster_attack', 'assets/Audio/Card/attack-01.mp3');

        // Background Battle
        this.load.image('battleSpring', 'assets/Background/spring/6.png');


        // Story assets
        this.load.image('story-01', 'assets/Story/story-01.jpeg');
        this.load.image('story-02', 'assets/Story/story-02.jpeg');
        this.load.image('story-03', 'assets/Story/story-03.jpeg');
        this.load.image('story-04', 'assets/Story/story-04.jpeg');
        this.load.audio('narration-intro', 'assets/Audio/Story/01-introduction-fr.mp3');
        this.load.audio('story-music', 'assets/Audio/BGM/story-music.mp3')

        // Effects
        this.load.spritesheet('effect', 'assets/Effects/Retro Impact Effect Pack 5 A.png', { frameWidth: 96, frameHeight: 96 });

        // MAP
        this.load.audio('music-map-01', 'assets/Audio/BGM/Champ-des-ames-Fanees.mp3');
        this.load.audio('battle-music', 'assets/Audio/BGM/battle-music.mp3');

    }

    create() {
        this.scene.start('MainMenu');
    }
}
