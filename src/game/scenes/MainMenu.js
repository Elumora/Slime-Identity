import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.scene.launch('DevGrid');

        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(8, 8, 8);
        particleGraphics.generateTexture('particle', 16, 16);
        particleGraphics.destroy();

        this.particles = this.add.particles(953, 511, 'particle', {
            speed: { min: 20, max: 80 },
            angle: { min: 0, max: 360 },
            alpha: { start: 0.3, end: 0 },
            scale: { start: 0.5, end: 1.5 },
            lifespan: 10_000,
            frequency: 50,
            blendMode: 'ADD'
        }).setDepth(1).stop();

        this.time.delayedCall(5000, () => this.particles.start());

        this.add.image(960, 540, 'menu-bg').setDisplaySize(1920, 1080).setDepth(0);

        this.sound.play('menu-music', { loop: true, volume: 0.5 });

        const sizeReductionPercent = 0.20; // 15%
        const initialScale = 0.32 * 1.10;
        const finalScale = 0.32 * 0.85 * (1 - sizeReductionPercent);
        const slime = this.add.image(1087, 1066, 'slime-bleu').setScale(initialScale).setDepth(1);

        const jumps = 5;
        const startX = 1087;
        const startY = 1066;
        const endX = 502;
        const endY = 625;
        const jumpDistanceX = (endX - startX) / jumps;
        const jumpDistanceY = (endY - startY) / jumps;
        const scaleDecrement = (initialScale - finalScale) / jumps;
        let delay = 0;

        for (let i = 0; i < jumps; i++) {
            const targetX = startX + jumpDistanceX * (i + 1);
            const targetY = startY + jumpDistanceY * (i + 1);
            const currentScale = initialScale - scaleDecrement * i;
            const nextScale = initialScale - scaleDecrement * (i + 1);

            this.tweens.add({
                targets: slime,
                x: targetX,
                y: targetY - 100,
                scaleX: currentScale * 0.85,
                scaleY: currentScale * 1.15,
                duration: 300,
                ease: 'Quad.easeOut',
                delay,
                onStart: () => this.sound.play('jump')
            });
            this.tweens.add({
                targets: slime,
                y: targetY,
                scaleX: nextScale * 1.15,
                scaleY: nextScale * 0.85,
                duration: 300,
                ease: 'Quad.easeIn',
                delay: delay + 300,
                onComplete: () => {
                    if (i === jumps - 1) {
                        this.tweens.add({
                            targets: slime,
                            scaleX: finalScale,
                            scaleY: finalScale,
                            duration: 200
                        });
                        const idleScaleChange = finalScale * 0.06;
                        this.tweens.add({
                            targets: slime,
                            scaleY: `+=${idleScaleChange}`,
                            y: `-=${slime.displayHeight * idleScaleChange / 2}`,
                            duration: 1500,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                            delay: 200
                        });
                    }
                }
            });
            delay += 600;
        }

        const logo = this.add.image(960, 460, 'logo').setAlpha(0).setScale(0.6).setDepth(2);

        this.tweens.add({
            targets: logo,
            alpha: 1,
            delay: 4500,
            duration: 800
        });

        this.tweens.add({
            targets: logo,
            y: '+=15',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 5800
        });


        const menuX = 100;
        const menuY = 800;
        const spacing = 70;

        const buttonStyle = {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        const newGame = this.add.text(menuX, menuY, 'Nouvelle Partie', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showQuestModal())
            .on('pointerover', () => newGame.setColor('#ffff00'))
            .on('pointerout', () => newGame.setColor('#ffffff'));

        // const continueGame = this.add.text(menuX, menuY + spacing, 'Continuer', buttonStyle)
        //     .setInteractive({ useHandCursor: true })
        //     .on('pointerover', () => continueGame.setColor('#ffff00'))
        //     .on('pointerout', () => continueGame.setColor('#ffffff'));

        const stats = this.add.text(menuX, menuY + spacing * 1, 'Statistiques', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => stats.setColor('#ffff00'))
            .on('pointerout', () => stats.setColor('#ffffff'));

        const settings = this.add.text(menuX, menuY + spacing * 2, 'Paramètres', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => settings.setColor('#ffff00'))
            .on('pointerout', () => settings.setColor('#ffffff'));

        EventBus.emit('current-scene-ready', this);
    }

    showQuestModal() {
        const modal = this.add.image(960, 540, 'quest-start').setDepth(3);

        const text = this.add.text(960, 430, 'Tu ne sais pas encore qui tu es… veux-tu le découvrir ?', {
            fontFamily: 'Arial',
            fontSize: 58,
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 800 },
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0).setDepth(3);


        const yesY = 430 + 250
        const gap = 100;

        const btnYes = this.add.image(960, yesY, 'button-green').setInteractive({ useHandCursor: true }).setScale(0.8).setDepth(3);
        const txtYes = this.add.text(960, yesY, 'oui', {
            fontFamily: 'Arial',
            fontSize: 60,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6).setDepth(3);

        const btnNo = this.add.image(960, yesY + gap, 'button-red').setInteractive({ useHandCursor: true }).setScale(0.8).setDepth(3);
        const txtNo = this.add.text(960, yesY + gap, 'non', {
            fontFamily: 'Arial',
            fontSize: 60,
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6).setDepth(3);

        btnYes.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('Narration');
        });
        btnNo.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MapScene');
        });
    }
}
