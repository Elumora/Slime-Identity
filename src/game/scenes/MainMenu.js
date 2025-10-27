import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.scene.launch('DevGrid');

        this.add.image(960, 540, 'menu-bg').setDisplaySize(1920, 1080);

        this.sound.play('menu-music', { loop: true, volume: 0.5 });

        const slime = this.add.image(-200, 540, 'slime-bleu').setScale(0.32);

        const jumps = 5;
        const jumpDistance = 1160 / jumps;
        let delay = 0;

        for (let i = 0; i < jumps; i++) {
            const targetX = -200 + jumpDistance * (i + 1);
            this.tweens.add({
                targets: slime,
                x: targetX,
                y: 400,
                scaleX: 0.28,
                scaleY: 0.36,
                duration: 300,
                ease: 'Quad.easeOut',
                delay,
                onStart: () => this.sound.play('jump')
            });
            this.tweens.add({
                targets: slime,
                y: 540,
                scaleX: 0.36,
                scaleY: 0.28,
                duration: 300,
                ease: 'Quad.easeIn',
                delay: delay + 300,
                onComplete: () => {
                    if (i === jumps - 1) {
                        this.tweens.add({
                            targets: slime,
                            scaleX: 0.32,
                            scaleY: 0.32,
                            duration: 200
                        });
                        this.tweens.add({
                            targets: slime,
                            scaleY: '+=0.02',
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

        const logo = this.add.image(960, 460, 'logo').setAlpha(0).setScale(0.6);

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
        const modal = this.add.image(960, 540, 'quest-start');

        const text = this.add.text(960, 430, 'Tu ne sais pas encore qui tu es… veux-tu le découvrir ?', {
            fontFamily: 'Arial',
            fontSize: 58,
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 800 },
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0);


        const yesY = 430 + 250
        const gap = 100;

        const btnYes = this.add.image(960, yesY, 'button-green').setInteractive({ useHandCursor: true }).setScale(0.8);
        const txtYes = this.add.text(960, yesY, 'oui', {
            fontFamily: 'Arial',
            fontSize: 60,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6);

        const btnNo = this.add.image(960, yesY + gap, 'button-red').setInteractive({ useHandCursor: true }).setScale(0.8);
        const txtNo = this.add.text(960, yesY + gap, 'non', {
            fontFamily: 'Arial',
            fontSize: 60,
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6);

        btnYes.on('pointerdown', () => this.scene.start('Game'));
        btnNo.on('pointerdown', () => {
            modal.destroy();
            text.destroy();
            btnYes.destroy();
            txtYes.destroy();
            btnNo.destroy();
            txtNo.destroy();
        });
    }
}
