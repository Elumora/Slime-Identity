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

        if (enemyType !== 'character') {
            this.sprite.setFlipX(true);
        }

        this.add(this.sprite);

        if (!this.hasIdleAnimation) {
            this.createBounceAnimation();
        }

        const spriteHeight = this.sprite.displayHeight;
        const healthYOffset = spriteHeight / 2 + 20;

        this.healthText = scene.add.text(0, healthYOffset, `HP: ${this.health}`, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add(this.healthText);

        this.attackText = null;
        this.attackDamage = 0;

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
        if (totalShield > 0) {
            statusText += ` [${totalShield}]`;
        }
        if (this.debuffs.fragile) {
            statusText += ' F';
        }
        if (this.debuffs.slow) {
            statusText += ' S';
        }
        if (this.blockIncrement && this.blockIncrement.value > 0) {
            statusText += ` +${this.blockIncrement.value}B`;
        }
        this.healthText.setText(`HP: ${this.health}${statusText}`);

        if (!this.isPlayer && this.attackDamage > 0 && this.scene.add) {
            if (!this.attackText) {
                const spriteHeight = this.sprite.displayHeight;
                const attackYOffset = -(spriteHeight / 2 + 10);

                this.attackText = this.scene.add.text(0, attackYOffset + 70, `ATK: ${this.attackDamage}`, {
                    fontSize: '18px',
                    color: '#ccff00',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setOrigin(0.5);
                this.add(this.attackText);
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
