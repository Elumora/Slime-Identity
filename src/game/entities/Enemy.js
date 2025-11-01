export class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, x, y, enemyType, scale = 1) {
        super(scene, x, y);

        this.scene = scene;
        this.enemyType = enemyType;
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.shield = 0;
        this.temporaryShield = 0;
        this.buffs = {};
        this.debuffs = {};
        this.blockIncrement = null;
        this.blockOnDiscard = 0;

        const hasAnimation = scene.anims.exists(`${enemyType}-idle`);

        if (hasAnimation) {
            this.sprite = scene.add.sprite(0, 0, enemyType);
            this.sprite.play(`${enemyType}-idle`);
            this.hasIdleAnimation = true;
        } else {
            this.sprite = scene.add.image(0, 0, enemyType);
            this.hasIdleAnimation = false;
        }
        this.sprite.setScale(scale);

        // if (enemyType !== 'character') {
        //     this.sprite.setFlipX(true);
        // }

        this.add(this.sprite);

        if (!this.hasIdleAnimation) {
            this.createBounceAnimation();
        }

        const spriteHeight = this.sprite.displayHeight;
        const healthYOffset = spriteHeight / 2 + 20;

        const barWidth = 250;
        const barHeight = 24;

        this.healthBarBg = scene.add.rectangle(0, healthYOffset, barWidth, barHeight, 0x000000).setStrokeStyle(2, 0xffffff);
        this.add(this.healthBarBg);

        this.healthBarFill = scene.add.rectangle(-barWidth / 2, healthYOffset, barWidth, barHeight - 2, 0x00ff00).setOrigin(0, 0.5);
        this.add(this.healthBarFill);

        this.healthText = scene.add.text(0, healthYOffset, `${this.health}/${this.maxHealth}`, {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.healthText);

        this.attackIcon = null;
        this.attackText = null;
        this.attackDamage = 0;
        this.statusIcons = [];
        this.shieldIcon = null;
        this.shieldText = null;
        this.intentIcon = null;
        this.intentText = null;
        this.intentContainer = null;
        this.intentTooltip = null;
        
        this.attackPattern = null;
        this.patternIndex = 0;
        this.isCharging = false;
        this.chargeMultiplier = 1;
        this.isDodging = false;

        this.setSize(this.sprite.width * 2, this.sprite.height * 2);
        scene.add.existing(this);

        this.updateHealthBar();
    }

    createBounceAnimation() {
        const baseScale = this.sprite.scaleX;
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: baseScale * 0.94,
            scaleX: baseScale * 1.04,
            duration: 1200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    takeDamage(damage) {
        let actualDamage = damage;

        if (this.buffs.defense) {
            actualDamage = Math.max(0, actualDamage - this.buffs.defense.value);
        }

        let totalShield = this.shield + (this.temporaryShield || 0);
        if (totalShield > 0) {
            if (totalShield >= actualDamage) {
                let remaining = actualDamage;
                if (this.temporaryShield > 0) {
                    if (this.temporaryShield >= remaining) {
                        this.temporaryShield -= remaining;
                        remaining = 0;
                    } else {
                        remaining -= this.temporaryShield;
                        this.temporaryShield = 0;
                    }
                }
                if (remaining > 0 && this.shield > 0) {
                    this.shield -= remaining;
                }
                actualDamage = 0;
            } else {
                actualDamage -= totalShield;
                this.temporaryShield = 0;
                this.shield = 0;
            }
        }
        this.health -= actualDamage;
        if (this.health < 0) this.health = 0;

        if (!this.isPlayer && this.scene && this.scene.currentGameDamageDealt !== undefined) {
            this.scene.currentGameDamageDealt += actualDamage;
        }

        if (this.isPlayer && actualDamage > 0 && this.scene && this.scene.showCardEffect) {
            this.scene.showCardEffect(`-${actualDamage}`, this.x, this.y - 50);
        }

        if (actualDamage > 0 && this.scene && this.scene.shakeCamera) {
            this.scene.shakeCamera(actualDamage > 10 ? 8 : 5);
        }

        if (this.scene && this.scene.tweens) {
            this.scene.tweens.add({
                targets: this.sprite,
                tint: 0xff0000,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.sprite.clearTint();
                }
            });

            this.scene.tweens.add({
                targets: this,
                x: this.x + 10,
                duration: 50,
                yoyo: true,
                repeat: 2
            });
        }

        this.updateHealthBar();

        if (this.health <= 0) {
            this.die();
        }
    }

    updateHealthBar() {
        if (!this.healthText || !this.scene) return;

        let statusText = '';
        const totalShield = this.shield + (this.temporaryShield || 0);
        if (this.blockIncrement && this.blockIncrement.value > 0) {
            statusText += ` +${this.blockIncrement.value}B`;
        }
        this.healthText.setText(`${this.health}/${this.maxHealth}${statusText}`);

        const healthPercent = this.health / this.maxHealth;
        const barWidth = 250;
        const targetWidth = (barWidth - 1) * healthPercent;

        if (this.healthBarFill) {
            this.scene.tweens.add({
                targets: this.healthBarFill,
                width: targetWidth,
                duration: 300,
                ease: 'Power2'
            });

            const color = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff675e;
            this.healthBarFill.setFillStyle(color);
        }

        this.statusIcons.forEach(icon => icon.destroy());
        this.statusIcons = [];

        if (this.shieldIcon) {
            this.shieldIcon.destroy();
            this.shieldIcon = null;
        }
        if (this.shieldText) {
            this.shieldText.destroy();
            this.shieldText = null;
        }

        if (totalShield > 0) {
            const spriteHeight = this.sprite.displayHeight;
            const shieldYOffset = -(spriteHeight / 2 + 35);

            this.shieldIcon = this.scene.add.image(-15, shieldYOffset, 'shieldIcon').setScale(0.15);
            this.shieldIcon.setInteractive({ useHandCursor: true });
            this.add(this.shieldIcon);

            let tooltip = null;
            this.shieldIcon.on('pointerdown', () => {
                if (tooltip) {
                    tooltip.bg.destroy();
                    tooltip.text.destroy();
                    tooltip = null;
                } else {
                    const worldPos = this.getWorldTransformMatrix();
                    tooltip = this.scene.uiManager.createEffectTooltip(this.x, this.y + shieldYOffset, 'shield');
                    this.scene.time.delayedCall(3000, () => {
                        if (tooltip) {
                            tooltip.bg.destroy();
                            tooltip.text.destroy();
                            tooltip = null;
                        }
                    });
                }
            });

            this.shieldText = this.scene.add.text(10, shieldYOffset, `${totalShield}`, {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0, 0.5);
            this.add(this.shieldText);
        }

        const spriteHeight = this.sprite.displayHeight;

        if (!this.isPlayer && this.attackDamage > 0 && this.scene.add) {
            if (!this.attackIcon) {
                const attackYOffset = -(spriteHeight / 2 + 10);

                this.attackIcon = this.scene.add.image(-15, attackYOffset, 'attackIcon').setScale(0.15);
                this.add(this.attackIcon);

                this.attackText = this.scene.add.text(10, attackYOffset, `${this.attackDamage}`, {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setOrigin(0, 0.5);
                this.add(this.attackText);
            }

            const statusYOffset = totalShield > 0 ? -(spriteHeight / 2 + 100) : -(spriteHeight / 2 + 75);
            let iconX = -12;

            if (this.debuffs.fragile) {
                const fragileIcon = this.scene.add.image(iconX, statusYOffset, 'fragileIcon').setScale(0.15);
                fragileIcon.setInteractive({ useHandCursor: true });
                this.add(fragileIcon);
                this.statusIcons.push(fragileIcon);
                
                let tooltip = null;
                fragileIcon.on('pointerdown', () => {
                    if (tooltip) {
                        tooltip.bg.destroy();
                        tooltip.text.destroy();
                        tooltip = null;
                    } else {
                        tooltip = this.scene.uiManager.createEffectTooltip(this.x + iconX, this.y + statusYOffset, 'fragile');
                        this.scene.time.delayedCall(3000, () => {
                            if (tooltip) {
                                tooltip.bg.destroy();
                                tooltip.text.destroy();
                                tooltip = null;
                            }
                        });
                    }
                });
                
                iconX += 35;
            }
            if (this.debuffs.slow) {
                const slowIcon = this.scene.add.image(iconX, statusYOffset, 'slowIcon').setScale(0.15);
                slowIcon.setInteractive({ useHandCursor: true });
                this.add(slowIcon);
                this.statusIcons.push(slowIcon);
                
                let tooltip = null;
                slowIcon.on('pointerdown', () => {
                    if (tooltip) {
                        tooltip.bg.destroy();
                        tooltip.text.destroy();
                        tooltip = null;
                    } else {
                        tooltip = this.scene.uiManager.createEffectTooltip(this.x + iconX, this.y + statusYOffset, 'slow');
                        this.scene.time.delayedCall(3000, () => {
                            if (tooltip) {
                                tooltip.bg.destroy();
                                tooltip.text.destroy();
                                tooltip = null;
                            }
                        });
                    }
                });
            }
        }
    }

    addShield(amount) {
        this.shield += amount;
        this.updateHealthBar();
    }

    addTemporaryShield(amount) {
        if (!this.temporaryShield) this.temporaryShield = 0;
        this.temporaryShield += amount;
        this.updateHealthBar();
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
        this.updateHealthBar();
    }

    addBuff(buffType, value, duration) {
        this.buffs[buffType] = { value, duration };
    }

    addDebuff(debuffType, value, duration) {
        this.debuffs[debuffType] = { value, duration };
    }

    die() {
        const scene = this.scene;
        if (scene && scene.tweens) {
            scene.tweens.add({
                targets: this,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.destroy();
                    if (scene && scene.checkVictory) {
                        scene.checkVictory();
                    }
                }
            });
        } else {
            this.destroy();
            if (scene && scene.checkVictory) {
                scene.checkVictory();
            }
        }
    }
}
