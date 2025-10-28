import { Scene } from 'phaser';

export class Narration extends Scene {
    constructor() {
        super('Narration');
    }

    create() {
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000);
        const image = this.add.image(960, 540, 'story-01').setAlpha(0).setScale(1);

        const subtitleStyle = {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            wordWrap: { width: 1600 }
        };
        const subtitle = this.add.text(960, 950, '', subtitleStyle).setOrigin(0.5).setAlpha(0);

        const subtitles = [
            { time: 500, text: "Il n'a ni nom\u2026 ni forme d\u00e9finie." },
            { time: 5500, text: "Il s'\u00e9veille, seul, dans un monde\nqui ne lui dit rien." },
            { time: 13500, text: "Un battement. Une pulsation.\nUne conscience." },
            { time: 20500, text: "Ce slime\u2026 c'est toi." },
            { time: 24500, text: "Tu ignores ce que tu es." },
            { time: 27000, text: "Tu ignores pourquoi tu es l\u00e0." },
            { time: 29500, text: "Mais quelque chose t'appelle." },
            { time: 33500, text: "Des fragments \u00e9parpill\u00e9s\ndans les ruines du monde." },
            { time: 38500, text: "Des \u00e9clats de m\u00e9moire, de pouvoir\u2026\nd'identit\u00e9." },
            { time: 43500, text: "Chaque combat te rapproche\nde la v\u00e9rit\u00e9." },
            { time: 47500, text: "Chaque carte que tu absorbes\nte transforme." },
            { time: 51500, text: "Trouve les fragments." },
            { time: 53500, text: "Reconstruis ce que tu \u00e9tais." },
            { time: 56500, text: "Et d\u00e9couvre\u2026 ce que tu pourrais\ndevenir." },
            { time: 61000, text: "" }
        ];

        subtitles.forEach(sub => {
            this.time.delayedCall(sub.time, () => {
                subtitle.setText(sub.text);
                if (sub.text === '') {
                    this.tweens.add({ targets: subtitle, alpha: 0, duration: 500 });
                } else if (subtitle.alpha === 0) {
                    this.tweens.add({ targets: subtitle, alpha: 1, duration: 300 });
                }
            });
        });

        this.sound.play('story-music', { volume: 0.3 });

        this.time.delayedCall(1000, () => this.sound.play('narration-intro', { volume: 1 }));

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
                            onStart: () => this.sound.play('jump', { volume: 0.3 })
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
                                    this.time.delayedCall(7000, () => {
                                        subtitle.destroy();
                                        this.scene.start('GameScene');
                                    });
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
