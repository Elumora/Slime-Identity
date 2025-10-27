import { AREA_TYPES, CARD_TYPES, TARGET_TYPES } from '../config/CardTypes';
import { CardEffects } from '../systems/CardEffects';

export class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData) {
        super(scene, x, y);

        this.scene = scene;
        this.cardData = cardData;
        this.homeX = x;
        this.homeY = y;
        this.homeRotation = 0;
        this.homeDepth = 1;
        this.isDragging = false;
        this.isHovered = false;
        this.isCentered = false;

        this.cardSprite = scene.add.image(0, 0, 'card-template');
        this.cardSprite.setScale(0.50);
        
        if (cardData.icon) {
            const icon = scene.add.image(0, -40, cardData.icon);
            icon.setScale(0.25);
            this.add(icon);
        }
        this.add(this.cardSprite);

        // const costBg = scene.add.circle(-125, -186, 24, 0xffffff);
        // this.add(costBg);
        const costText = scene.add.text(-125, -186, cardData.cost, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.add(costText);

        const nameLength = cardData.name.length;
        const fontSize = nameLength <= 10 ? 28 : nameLength <= 15 ? 20 : nameLength <= 20 ? 18 : 16;
        this.nameText = scene.add.text(0, -184, cardData.name, {
            fontSize: `${fontSize}px`,
            color: '#cfc8b0',
            stroke: 'rgba(56, 43, 43, 1)',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        this.add(this.nameText);

        const description = CardEffects.getDescription(cardData);
        if (description) {
            const desc = scene.add.text(-56, 125, description, {
                fontSize: '20px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 260 }
            }).setOrigin(0.25);
            this.add(desc);
        }

        const hitWidth = this.cardSprite.width * 0.45;
        const hitHeight = this.cardSprite.height * 0.45;
        this.setSize(hitWidth, hitHeight);
        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, hitWidth, hitHeight),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            useHandCursor: true
        });
        this.dragStartX = 0;
        this.dragStartY = 0;

        scene.add.existing(this);
        this.setupEvents();
    }

    setupEvents() {
        this.on('pointerover', () => this.onHover());
        this.on('pointerout', () => this.onOut());
        this.on('pointerdown', (pointer) => this.onPointerDown(pointer));
        this.on('pointermove', (pointer) => this.onPointerMove(pointer));
        this.on('pointerup', (pointer) => this.onPointerUp(pointer));
    }

    onPointerDown(pointer) {
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
    }

    onPointerMove(pointer) {
        if (!pointer.isDown) return;
        const distance = Phaser.Math.Distance.Between(this.dragStartX, this.dragStartY, pointer.x, pointer.y);
        if (distance > 10 && !this.isDragging) {
            this.onDragStart(pointer);
        }
        if (this.isDragging) {
            this.onDrag(pointer, pointer.x, pointer.y);
        }
    }

    onPointerUp(pointer) {
        if (this.isDragging) {
            this.onDragEnd(pointer);
        } else {
            this.onClick();
        }
    }

    onClick() {
        if (this.isCentered) {
            this.uncenter();
            this.scene.sound.play(`card_draw${Math.floor(Math.random() * 5) + 1}`);

        } else {
            this.scene.sound.play('card_place');
            this.scene.uncenterAllCards();
            this.isCentered = true;
            const centerX = this.scene.cameras.main.centerX;
            const centerY = this.scene.cameras.main.centerY;
            this.scene.tweens.add({
                targets: this,
                x: centerX,
                y: centerY,
                scale: 1.5,
                rotation: 0,
                duration: 300,
                ease: 'Back.easeOut'
            });
            this.setDepth(300);
        }
    }

    uncenter() {
        if (!this.isCentered) return;
        this.isCentered = false;
        this.scene.tweens.add({
            targets: this,
            x: this.homeX,
            y: this.homeY,
            scale: 1,
            rotation: this.homeRotation,
            duration: 300,
            ease: 'Back.easeOut'
        });
        this.setDepth(this.homeDepth);
    }

    onHover() {
        if (!this.isDragging && !this.isCentered) {
            this.isHovered = true;
            this.scene.tweens.add({
                targets: this,
                scale: 1.3,
                y: this.homeY - 120,
                rotation: 0,
                duration: 200,
                ease: 'Power2'
            });
            this.setDepth(100);
        }
    }

    onOut() {
        if (!this.isDragging && !this.isCentered) {
            this.isHovered = false;
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                y: this.homeY,
                rotation: this.homeRotation,
                duration: 200,
                ease: 'Power2'
            });
            this.setDepth(this.homeDepth);
        }
    }

    onDragStart(pointer) {
        if (this.scene.mana < this.cardData.cost) {
            this.isDragging = false;
            return;
        }
        if (this.isCentered) {
            this.isCentered = false;
        }
        this.scene.uncenterAllCards();
        this.isDragging = true;
        this.setScale(1.3);
        this.setRotation(0);
        this.setDepth(200);
    }

    onDrag(pointer, dragX, dragY) {
        if (!this.isDragging) return;
        this.x = dragX;
        this.y = dragY;
    }

    onDragEnd(pointer) {
        if (!this.isDragging) {
            return;
        }
        this.isDragging = false;

        const target = this.getTarget(pointer);

        if (target && this.scene.spendMana(this.cardData.cost)) {
            if (this.cardData.sound) {
                this.scene.sound.play(this.cardData.sound);
            } else {
                this.scene.sound.play('card_play');
            }
            this.executeCard(target);
        } else {
            this.returnToHome();
        }
    }

    requiresTarget() {
        const { type, targetType, areaType } = this.cardData;
        if (areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES) return false;
        return targetType === TARGET_TYPES.ENEMY || type === CARD_TYPES.ATTACK || type === CARD_TYPES.DEBUFF;
    }

    getTarget(pointer) {
        const { targetType, areaType } = this.cardData;

        if (areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES) {
            return this.scene.enemies;
        }

        if (targetType === TARGET_TYPES.SELF || targetType === TARGET_TYPES.NONE) {
            const playerDistance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.scene.player.x, this.scene.player.y);
            return playerDistance < 150 ? this.scene.player : null;
        }

        const enemies = this.scene.enemies;
        let hitEnemy = null;
        let minDistance = Infinity;

        for (let enemy of enemies) {
            if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, enemy.x, enemy.y);
                if (distance < 100 && distance < minDistance) {
                    hitEnemy = enemy;
                    minDistance = distance;
                }
            }
        }

        return hitEnemy;
    }

    executeCard(target) {
        CardEffects.execute(this, this.scene, target);
    }

    returnToHome() {
        this.scene.tweens.add({
            targets: this,
            x: this.homeX,
            y: this.homeY,
            scale: 1,
            rotation: this.homeRotation,
            duration: 300,
            ease: 'Back.easeOut'
        });
        this.setDepth(this.homeDepth);
    }

    setHomePosition(x, y, rotation, depth) {
        this.homeX = x;
        this.homeY = y;
        this.homeRotation = rotation;
        this.homeDepth = depth;
    }
}
