import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameProgress } from '../systems/GameProgress';

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
                        const idleTween = this.tweens.add({
                            targets: slime,
                            scaleY: `+=${idleScaleChange}`,
                            y: `-=${slime.displayHeight * idleScaleChange / 2}`,
                            duration: 1500,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                            delay: 200
                        });
                        let isJumping = false;
                        let currentIdleTween = idleTween;
                        let jumpCount = 0;
                        slime.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                            if (isJumping) return;
                            isJumping = true;
                            currentIdleTween.stop();
                            const currentX = slime.x;
                            const currentY = slime.y;
                            const currentScale = slime.scaleX;
                            let targetX, targetY, nextScale;
                            const cyclePosition = jumpCount % 6;
                            if (cyclePosition < 4) {
                                targetX = currentX + Math.abs(jumpDistanceX);
                                targetY = currentY + Math.abs(jumpDistanceY);
                                nextScale = currentScale + scaleDecrement;
                            } else if (cyclePosition === 4) {
                                targetX = 1297;
                                targetY = 370;
                                nextScale = currentScale + scaleDecrement;
                            } else {
                                targetX = endX;
                                targetY = endY;
                                nextScale = finalScale;
                            }
                            jumpCount++;
                            this.sound.play('jump');
                            this.tweens.add({
                                targets: slime,
                                x: targetX,
                                y: targetY - 100,
                                scaleX: currentScale * 0.85,
                                scaleY: currentScale * 1.15,
                                duration: 300,
                                ease: 'Quad.easeOut'
                            });
                            this.tweens.add({
                                targets: slime,
                                y: targetY,
                                scaleX: nextScale * 1.15,
                                scaleY: nextScale * 0.85,
                                duration: 300,
                                ease: 'Quad.easeIn',
                                delay: 300,
                                onComplete: () => {
                                    this.tweens.add({
                                        targets: slime,
                                        scaleX: nextScale,
                                        scaleY: nextScale,
                                        duration: 200,
                                        onComplete: () => {
                                            const newIdleScaleChange = nextScale * 0.06;
                                            currentIdleTween = this.tweens.add({
                                                targets: slime,
                                                scaleY: `+=${newIdleScaleChange}`,
                                                y: `-=${slime.displayHeight * newIdleScaleChange / 2}`,
                                                duration: 1500,
                                                yoyo: true,
                                                repeat: -1,
                                                ease: 'Sine.easeInOut'
                                            });
                                            isJumping = false;
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            });
            delay += 600;
        }

        const logo = this.add.image(960, 460, 'logo').setAlpha(0).setScale(0.6).setDepth(2);
        const logoHomeX = 960;
        const logoHomeY = 460;

        this.time.delayedCall(4000, () => this.sound.play('logo-apparition'));

        this.tweens.add({
            targets: logo,
            alpha: 1,
            delay: 4500,
            duration: 800
        });

        const logoFloatTween = this.tweens.add({
            targets: logo,
            y: '+=15',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 5800
        });

        this.time.delayedCall(5800, () => {
            logo.setInteractive({ draggable: true, useHandCursor: true });
            this.input.setDraggable(logo);

            logo.on('dragstart', () => {
                logoFloatTween.pause();
            });

            logo.on('drag', (pointer, dragX, dragY) => {
                logo.x = dragX;
                logo.y = dragY;
                this.particles.setPosition(dragX, dragY);
            });

            logo.on('dragend', () => {
                this.tweens.add({
                    targets: logo,
                    x: logoHomeX,
                    y: logoHomeY,
                    duration: 500,
                    ease: 'Back.easeOut',
                    onUpdate: () => this.particles.setPosition(logo.x, logo.y),
                    onComplete: () => logoFloatTween.resume()
                });
            });
        });

        this.events.on('update', () => {
            this.particles.setPosition(logo.x, logo.y);
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

        const emitZone = new Phaser.Geom.Rectangle(0, 0, 100, 40);
        const buttonParticles = this.add.particles(0, 0, 'particle', {
            speed: { min: 30, max: 60 },
            angle: { min: 0, max: 360 },
            alpha: { start: 0.6, end: 0 },
            scale: { start: 0.3, end: 0.8 },
            lifespan: 800,
            frequency: 30,
            blendMode: 'ADD',
            emitZone: { type: 'random', source: emitZone }
        }).setDepth(0).stop();

        const progress = GameProgress.load();
        const hasGameStarted = progress.currentPathIndex > 0;

        this.continueGame = this.add.text(menuX, menuY - spacing, 'Continuer', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .setVisible(hasGameStarted)
            .on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('MapScene');
            })
            .on('pointerover', () => {
                this.continueGame.setColor('#ffff00');
                emitZone.setSize(this.continueGame.width, this.continueGame.height);
                buttonParticles.setPosition(this.continueGame.x, this.continueGame.y).start();
            })
            .on('pointerout', () => {
                this.continueGame.setColor('#ffffff');
                buttonParticles.stop();
            });

        this.newGame = this.add.text(menuX, menuY, 'Nouvelle Partie', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showQuestModal())
            .on('pointerover', () => {
                this.newGame.setColor('#ffff00');
                emitZone.setSize(this.newGame.width, this.newGame.height);
                buttonParticles.setPosition(this.newGame.x, this.newGame.y).start();
            })
            .on('pointerout', () => {
                this.newGame.setColor('#ffffff');
                buttonParticles.stop();
            });

        this.stats = this.add.text(menuX, menuY + spacing * 1, 'Statistiques', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.stats.setColor('#ffff00');
                emitZone.setSize(this.stats.width, this.stats.height);
                buttonParticles.setPosition(this.stats.x, this.stats.y).start();
            })
            .on('pointerout', () => {
                this.stats.setColor('#ffffff');
                buttonParticles.stop();
            });

        this.settings = this.add.text(menuX, menuY + spacing * 2, 'Paramètres', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.settings.setColor('#ffff00');
                emitZone.setSize(this.settings.width, this.settings.height);
                buttonParticles.setPosition(this.settings.x, this.settings.y).start();
            })
            .on('pointerout', () => {
                this.settings.setColor('#ffffff');
                buttonParticles.stop();
            });

        this.menuButtons = [this.continueGame, this.newGame, this.stats, this.settings];

        this.input.keyboard.on('keydown-C', () => {
            this.sound.stopAll();
            this.scene.start('CardDebugScene');
        });

        EventBus.emit('current-scene-ready', this);
    }

    showQuestModal() {
        const overlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7).setDepth(2).setAlpha(0);

        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 300
        });

        this.menuButtons.forEach(btn => {
            this.tweens.add({
                targets: btn,
                x: -250,
                duration: 300,
                ease: 'Back.easeIn'
            });
        });

        const modal = this.add.image(960, 540, 'quest-start').setDepth(3).setAlpha(0).setScale(0.8);

        this.tweens.add({
            targets: modal,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });

        const text = this.add.text(960, 430, 'Tu ne sais pas encore qui tu es… veux-tu le découvrir ?', {
            fontFamily: 'Arial',
            fontSize: 58,
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 800 },
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0).setDepth(3).setAlpha(0);

        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 400,
            delay: 200
        });

        const closeBtn = this.add.image(1405, 276, 'close')
            .setInteractive({ useHandCursor: true })
            .setScale(0.3)
            .setOrigin(0.5)
            .setDepth(4)
            .setAlpha(0)
            .on('pointerdown', () => this.closeQuestModal(overlay, modal, text, closeBtn, btnYes, txtYes, btnNo, txtNo));

        this.tweens.add({
            targets: closeBtn,
            alpha: 1,
            duration: 400,
            delay: 200
        });


        const yesY = 430 + 250;
        const gap = 100;

        const btnYes = this.add.image(960, yesY, 'button-green').setInteractive({ useHandCursor: true }).setScale(0.8).setDepth(3).setAlpha(0);
        const txtYes = this.add.text(960, yesY, 'oui', {
            fontFamily: 'Arial',
            fontSize: 60,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6).setDepth(3).setAlpha(0);

        this.tweens.add({
            targets: [btnYes, txtYes],
            alpha: 1,
            duration: 400,
            delay: 300
        });

        const btnNo = this.add.image(960, yesY + gap, 'button-red').setInteractive({ useHandCursor: true }).setScale(0.8).setDepth(3).setAlpha(0);
        const txtNo = this.add.text(960, yesY + gap, 'non', {
            fontFamily: 'Arial',
            fontSize: 60,
            color: '#ffffff',
            stroke: '#000000',
            align: 'center',
            strokeThickness: 6
        }).setOrigin(0.5, 0.6).setDepth(3).setAlpha(0);

        this.tweens.add({
            targets: [btnNo, txtNo],
            alpha: 1,
            duration: 400,
            delay: 400
        });

        btnYes.on('pointerdown', () => {
            GameProgress.clear();
            this.sound.stopAll();
            this.scene.start('Narration');
        });
        btnNo.on('pointerdown', () => {
            GameProgress.clear();
            this.sound.stopAll();
            this.scene.start('MapScene');
        });
    }

    closeQuestModal(overlay, modal, text, closeBtn, btnYes, txtYes, btnNo, txtNo) {
        this.tweens.add({
            targets: [modal, text, closeBtn, btnYes, txtYes, btnNo, txtNo],
            alpha: 0,
            scale: 0.8,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                overlay.destroy();
                modal.destroy();
                text.destroy();
                closeBtn.destroy();
                btnYes.destroy();
                txtYes.destroy();
                btnNo.destroy();
                txtNo.destroy();
            }
        });

        this.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 300
        });

        this.menuButtons.forEach(btn => {
            this.tweens.add({
                targets: btn,
                x: 100,
                duration: 400,
                ease: 'Back.easeOut',
                delay: 100
            });
        });
    }
}
