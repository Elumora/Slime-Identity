export class UIManager {
    constructor(scene) {
        this.scene = scene;
    }

    createEndTurnButton(onEndTurn) {
        const btn = this.scene.add.image(1800, 850, 'button-blue').setScale(0.4).setDepth(100);
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', onEndTurn);

        const text = this.scene.add.text(1800, 850, 'Fin du tour', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(101);

        return { btn, text };
    }

    createManaDisplay(initialMana) {
        const manaIcon = this.scene.add.image(170, 850, 'mana').setScale(0.5);
        manaIcon.setInteractive({ useHandCursor: true });
        
        const text = this.scene.add.text(170, 850, initialMana.toString(), {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let tooltip = null;

        manaIcon.on('pointerdown', () => {
            if (tooltip) {
                tooltip.bg.destroy();
                tooltip.text.destroy();
                tooltip = null;
            } else {
                const bg = this.scene.add.rectangle(170, 750, 300, 80, 0x000000, 0.9)
                    .setDepth(1000)
                    .setStrokeStyle(2, 0x4a90e2);
                
                const tooltipText = this.scene.add.text(170, 750, 'Mana : ressource pour\njouer des cartes', {
                    fontSize: '18px',
                    color: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5).setDepth(1001);

                tooltip = { bg, text: tooltipText };

                this.scene.time.delayedCall(3000, () => {
                    if (tooltip) {
                        tooltip.bg.destroy();
                        tooltip.text.destroy();
                        tooltip = null;
                    }
                });
            }
        });

        return text;
    }

    createDeckDisplay(deckLength, onDeckClick) {
        this.scene.add.particles(100, 1000, 'mana', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 2000,
            frequency: 50,
            angle: { min: -120, max: -60 },
            blendMode: 'ADD'
        }).setDepth(1);

        const icon = this.scene.add.image(100, 1000, 'deck').setScale(0.2).setDepth(2);
        icon.setInteractive({ useHandCursor: true });
        icon.on('pointerdown', onDeckClick);

        this.scene.add.circle(97, 960, 18, 0xff0000).setDepth(3);
        const text = this.scene.add.text(97, 960, deckLength.toString(), {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(4);

        return text;
    }

    createDiscardDisplay(discardLength, onDiscardClick) {
        this.scene.add.particles(1850, 1000, 'mana', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 2000,
            frequency: 50,
            angle: { min: 0, max: 360 },
            tint: [0xff0000, 0xff4500, 0xff6600],
            blendMode: 'ADD'
        }).setDepth(1);

        const icon = this.scene.add.image(1850, 1000, 'defausse').setScale(0.2).setDepth(2);
        icon.setInteractive({ useHandCursor: true });
        icon.on('pointerdown', onDiscardClick);

        this.scene.add.circle(1847, 960, 18, 0xff0000).setDepth(3);
        const text = this.scene.add.text(1847, 960, discardLength.toString(), {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(4);

        return text;
    }

    showGameOverText(text, color) {
        this.scene.add.text(960, 540, text, {
            fontSize: '64px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(10000);
    }

    showCardEffect(text, x, y) {
        const isDamage = text.startsWith('-') || text.startsWith('+');
        const effectText = this.scene.add.text(x, y, text, {
            fontSize: isDamage ? '42px' : '32px',
            color: text.startsWith('-') ? '#ff0000' : '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(500);

        this.scene.tweens.add({
            targets: effectText,
            y: y - 80,
            alpha: 0,
            duration: isDamage ? 2000 : 1500,
            ease: 'Power2',
            onComplete: () => effectText.destroy()
        });
    }

    setEndTurnButtonState(enabled, btn, text) {
        if (enabled) {
            btn.setInteractive({ useHandCursor: true });
            btn.clearTint();
            text.setAlpha(1);
        } else {
            btn.disableInteractive();
            btn.setTint(0x808080);
            text.setAlpha(0.5);
        }
    }

    showPhaseMessage(mainText, subText = null, duration = 2000) {
        const main = this.scene.add.text(960, subText ? 500 : 540, mainText, {
            fontSize: '72px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(20001).setAlpha(0);

        let sub = null;
        if (subText) {
            sub = this.scene.add.text(960, 580, subText, {
                fontSize: '48px',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(20001).setAlpha(0);
        }

        this.scene.tweens.add({
            targets: [main, sub].filter(t => t),
            alpha: 1,
            duration: 300,
            onComplete: () => {
                this.scene.time.delayedCall(duration, () => {
                    this.scene.tweens.add({
                        targets: [main, sub].filter(t => t),
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            main.destroy();
                            if (sub) sub.destroy();
                        }
                    });
                });
            }
        });
    }

    createEffectTooltip(x, y, effectType) {
        const tooltips = {
            slow: 'Lenteur : Réduit les\ndégâts infligés de 50%',
            fragile: 'Fragile : Subit 50%\nde dégâts en plus',
            shield: 'Bouclier : Absorbe\nles dégâts'
        };

        const text = tooltips[effectType] || 'Effet inconnu';
        
        const bg = this.scene.add.rectangle(x, y - 50, 250, 60, 0x000000, 0.9)
            .setDepth(10000)
            .setStrokeStyle(2, 0x4a90e2);
        
        const tooltipText = this.scene.add.text(x, y - 50, text, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(10001);

        return { bg, text: tooltipText };
    }
}
