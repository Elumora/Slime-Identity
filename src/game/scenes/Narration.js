import { Scene } from 'phaser';

export class Narration extends Scene {
    constructor() {
        super('Narration');
    }

    create() {
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000);
        const image = this.add.image(960, 540, 'story-01').setAlpha(0).setScale(1);

        this.time.delayedCall(500, () => this.sound.play('narration-intro'));

        this.tweens.add({
            targets: bg,
            alpha: 0,
            duration: 1500,
            delay: 500
        });

        this.tweens.add({
            targets: image,
            alpha: 1,
            duration: 1500,
            delay: 500
        });

        this.tweens.add({
            targets: image,
            scale: 1.2,
            duration: 13000,
            ease: 'Sine.easeInOut'
        });

        this.time.delayedCall(14000, () => {
            this.tweens.add({
                targets: image,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    image.setTexture('story-02').setAlpha(1).setScale(1.2);
                    this.tweens.add({
                        targets: image,
                        scale: 1,
                        duration: 13000,
                        ease: 'Sine.easeInOut'
                    });
                }
            });
        });

        this.time.delayedCall(28000, () => {
            this.tweens.add({
                targets: image,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    image.setTexture('story-03').setAlpha(1).setScale(1);
                    this.tweens.add({
                        targets: image,
                        scale: 1.2,
                        duration: 13000,
                        ease: 'Sine.easeInOut'
                    });
                }
            });
        });

        this.time.delayedCall(42000, () => {
            this.tweens.add({
                targets: image,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    image.setTexture('story-04').setAlpha(1).setScale(1.2);
                    this.tweens.add({
                        targets: image,
                        scale: 1,
                        duration: 10000,
                        ease: 'Sine.easeInOut'
                    });
                }
            });
        });

        this.time.delayedCall(52500, () => {
            this.tweens.add({
                targets: image,
                alpha: 0,
                duration: 1500,
                onComplete: () => {
                    bg.setAlpha(1);
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
                            onStart: () => this.sound.play('jump').sound.setVolume(0.5)
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
                                    this.time.delayedCall(8000, () => this.scene.start('Game'));
                                }
                            }
                        });
                        delay += 600;
                    }
                }
            });
        });
    }
}
