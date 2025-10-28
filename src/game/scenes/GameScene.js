import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { CARD_DATABASE } from '../config/CardDatabase';
import { STARTING_DECK } from '../config/PlayerDeck';
import { Card } from '../entities/Card';
import { Enemy } from '../entities/Enemy';
import { GameProgress } from '../systems/GameProgress';

export class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.battleEnemies = data.enemies || [
            { sprite: 'plent', health: 20, attack: 6 },
            // { sprite: 'slime', health: 12, attack: 4 }
        ];
        this.monsterX = data.monsterX;
        this.monsterY = data.monsterY;
    }

    create() {
        this.add.image(960, 540, 'battleSpring').setDisplaySize(1920, 1080);

        this.hand = [];
        this.deck = this.initializeDeck();
        this.discard = [];
        this.enemies = [];
        this.mana = 3;
        this.maxMana = 3;
        this.skipNextEnemyTurn = false;
        this.playFirst = false;
        this.maxHandSize = 5;
        this.lastPlayedCard = null;
        this.cardsPlayedThisTurn = 0;
        this.discardMode = false;
        this.discardCount = 0;
        this.discardedCards = 0;
        this.currentGameDamageDealt = 0;
        this.nextAttackDuplicated = false;

        this.endTurnBtn = this.add.rectangle(1750, 100, 180, 60, 0x7b3f9e);
        this.endTurnBtn.setStrokeStyle(3, 0xff_ff_ff);
        this.endTurnBtn.setInteractive({ useHandCursor: true });
        this.endTurnBtn.on('pointerdown', () => this.endTurn());
        this.endTurnText = this.add.text(1750, 100, 'End Turn', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.image(170, 850, 'mana').setScale(0.5);
        this.manaText = this.add.text(170, 850, '4', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.updateManaDisplay();

        const deckParticles = this.add.particles(100, 1000, 'mana', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 2000,
            frequency: 50,
            angle: { min: -120, max: -60 },
            blendMode: 'ADD'
        }).setDepth(1);

        const deckIcon = this.add.image(100, 1000, 'deck').setScale(0.2).setDepth(2);
        deckIcon.setInteractive({ useHandCursor: true });
        deckIcon.on('pointerdown', () => this.showDeckView());
        this.add.circle(97, 960, 18, 0xff0000).setDepth(3);
        this.deckCountText = this.add.text(97, 960, this.deck.length.toString(), {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(4);

        const discardParticles = this.add.particles(1850, 1000, 'mana', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 2000,
            frequency: 50,
            angle: { min: 0, max: 360 },
            tint: [0xff0000, 0xff4500, 0xff6600],
            blendMode: 'ADD'
        }).setDepth(1);

        this.add.image(1850, 1000, 'defausse').setScale(0.2).setDepth(2);
        this.add.circle(1847, 960, 18, 0xff0000).setDepth(3);
        this.discardCountText = this.add.text(1847, 960, this.discard.length.toString(), {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(4);

        this.anims.create({
            key: 'impact',
            frames: this.anims.generateFrameNumbers('effect', { start: 0, end: 4 }),
            frameRate: 15,
            hideOnComplete: true
        });

        this.createEnemies();
        this.time.delayedCall(1500, () => this.dealCards());

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.emit('drag', pointer, dragX, dragY);
        });

        this.deckViewActive = false;
        this.scene.launch('DevGrid');

        EventBus.emit('current-scene-ready', this);
    }

    playAttackEffect(x, y) {
        const effect = this.add.sprite(x, y, 'effect').setScale(2);
        effect.play('impact');
        effect.once('animationcomplete', () => effect.destroy());
    }

    playPlayerEffect(target) {
        this.tweens.add({
            targets: target.sprite,
            tint: 0x00ff00,
            scale: target.sprite.scale * 1.2,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                target.sprite.clearTint();
            }
        });
    }

    showCardEffect(text, x, y) {
        const effectText = this.add.text(x, y, text, {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(500);

        this.tweens.add({
            targets: effectText,
            y: y - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => effectText.destroy()
        });
    }

    createEnemies() {
        const progress = GameProgress.load();
        this.player = new Enemy(this, -100, 594, 'character', 0.3);
        this.player.maxHealth = 80;
        this.player.health = progress.playerHealth !== undefined ? progress.playerHealth : 80;
        this.player.isPlayer = true;
        this.player.scene = this;
        this.player.updateHealthBar();

        this.animatePlayerEntrance();

        const startX = 1400;
        const spacing = 250;
        const numEnemies = this.battleEnemies.length;

        this.battleEnemies.forEach((enemyData, i) => {
            const xPos = numEnemies === 1 ? 1550 : startX + (i * spacing);
            const enemy = new Enemy(this, xPos, 499, enemyData.sprite, 2);
            enemy.maxHealth = enemyData.health;
            enemy.health = enemyData.health;
            enemy.attackDamage = enemyData.attack;
            enemy.updateHealthBar();
            this.enemies.push(enemy);
        });
    }

    initializeDeck() {
        const progress = GameProgress.load();
        const deckNames = progress.playerDeck && progress.playerDeck.length > 0
            ? progress.playerDeck
            : STARTING_DECK;

        const deck = deckNames.map(cardName =>
            CARD_DATABASE.find(card => card.name === cardName)
        ).filter(card => card !== undefined);
        return deck.sort(() => Math.random() - 0.5);
    }

    dealCards() {
        if (this.deck.length === 0) {
            this.checkDeckDefeat();
            return;
        }

        const numCardsToDeal = Math.min(5, this.deck.length);
        const cardData = this.deck.splice(0, numCardsToDeal);
        this.updateDeckDisplay();

        cardData.forEach((data, i) => {
            this.time.delayedCall(i * 150, () => {
                const numCards = 7;
                const { x, y, rotation } = getCardPosition(i, numCards);
                const depth = i + 1;

                const card = new Card(this, 960, 350, data);
                card.setAlpha(0);
                card.setScale(0.25);
                card.setDepth(depth);
                card.homeRotation = rotation;
                card.homeDepth = depth;
                card.setHomePosition(x, y, rotation, depth);
                this.hand.push(card);

                // Random play sound betweend card_draw1 and card_draw5
                this.sound.play(`card_draw${Math.floor(Math.random() * 5) + 1}`);

                this.tweens.add({
                    targets: card,
                    x: x,
                    y: y,
                    rotation: rotation,
                    scale: 1,
                    alpha: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            });
        });
    }

    removeCardFromHand(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
            this.discard.push(card.cardData);
            this.updateDiscardDisplay();
        }
        this.reorganizeHand();
    }

    updateDiscardDisplay() {
        if (this.discardCountText) {
            this.discardCountText.setText(this.discard.length.toString());
        }
    }

    reorganizeHand() {
        const numCards = this.hand.length;
        if (numCards === 0) return;
        this.hand.forEach((card, i) => {
            const { x, y, rotation } = getCardPosition(i, numCards);
            const depth = i + 1;

            card.setHomePosition(x, y, rotation, depth);
            card.setDepth(depth);

            this.tweens.add({
                targets: card,
                x: x,
                y: y,
                rotation: rotation,
                duration: 300,
                ease: 'Power2'
            });
        });
    }

    checkVictory() {
        const aliveEnemies = this.enemies.filter(e => e.active);
        if (aliveEnemies.length === 0) {
            this.time.delayedCall(250, () => {
                this.add.text(960, 540, 'VICTORY!', {
                    fontSize: '64px',
                    color: '#ffff00',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 6
                }).setOrigin(0.5).setDepth(10000);

                if (this.monsterX !== undefined && this.monsterY !== undefined) {
                    const progress = GameProgress.load();
                    const monsterKey = `${this.monsterX},${this.monsterY}`;
                    if (!progress.defeatedMonsters.includes(monsterKey)) {
                        progress.defeatedMonsters.push(monsterKey);
                        progress.inBattle = false;
                        GameProgress.save(progress);
                    }
                }

                this.time.delayedCall(500, () => {
                    const progress = GameProgress.load();
                    progress.playerHealth = this.player.health;
                    GameProgress.save(progress);
                    this.scene.start('CardRewardScene', { monsterX: this.monsterX, monsterY: this.monsterY });
                });
            });
        }
    }

    checkDefeat() {
        if (this.player.health <= 0) {
            this.time.delayedCall(500, () => {
                this.add.text(960, 540, 'DEFEAT!', {
                    fontSize: '64px',
                    color: '#ff0000',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 6
                }).setOrigin(0.5).setDepth(10000);

                this.time.delayedCall(3000, () => {
                    GameProgress.clear();
                    this.scene.start('MapScene');
                });
            });
        }
    }

    checkDeckDefeat() {
        const aliveEnemies = this.enemies.filter(e => e.active);
        if (aliveEnemies.length > 0) {
            this.add.text(960, 540, 'DEFEAT!\nNo cards left', {
                fontSize: '64px',
                color: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5).setDepth(10000);

            this.time.delayedCall(3000, () => {
                GameProgress.clear();
                this.scene.start('MapScene');
            });
        }
    }

    moveBackOnMap() {
        const progress = GameProgress.load();
        if (progress.currentPathIndex > 0) {
            progress.currentPathIndex--;
            GameProgress.save(progress);
        }
        this.scene.start('MapScene');
    }

    spendMana(cost) {
        if (this.mana >= cost) {
            this.mana -= cost;
            this.updateManaDisplay();
            return true;
        }
        return false;
    }

    updateManaDisplay() {
        this.manaText.setText(this.mana.toString());
    }

    updateDeckDisplay() {
        this.deckCountText.setText(this.deck.length.toString());
    }

    uncenterAllCards() {
        this.hand.forEach(card => card.uncenter());
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) {
                this.checkDeckDefeat();
                break;
            }

            const cardData = this.deck.pop();
            this.updateDeckDisplay();
            const currentIndex = this.hand.length;
            const { x, y, rotation } = getCardPosition(currentIndex, this.hand.length + 1);
            const depth = currentIndex + 1;

            const card = new Card(this, 960, 350, cardData);
            card.setAlpha(0);
            card.setScale(0.25);
            card.setDepth(depth);
            card.homeRotation = rotation;
            card.homeDepth = depth;
            card.setHomePosition(x, y, rotation, depth);
            this.hand.push(card);

            this.sound.play(`card_draw${Math.floor(Math.random() * 5) + 1}`);

            this.time.delayedCall(i * 150, () => {
                this.tweens.add({
                    targets: card,
                    x: x,
                    y: y,
                    rotation: rotation,
                    scale: 1,
                    alpha: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            });
        }

        this.time.delayedCall(count * 150 + 300, () => {
            this.reorganizeHand();
        });
    }

    animatePlayerEntrance() {
        const jumpSound = this.sound.add('jump');
        const finalX = 350;
        const jumpDistance = 150;
        const numJumps = 3;

        for (let i = 0; i < numJumps; i++) {
            const startX = -100 + (i * jumpDistance);
            const endX = startX + jumpDistance;

            this.tweens.add({
                targets: this.player,
                x: endX,
                duration: 400,
                delay: i * 400,
                ease: 'Sine.inOut',
                onStart: () => {
                    jumpSound.play();
                    this.tweens.add({
                        targets: this.player,
                        y: 494,
                        duration: 200,
                        ease: 'Quad.easeOut',
                        yoyo: true
                    });
                }
            });
        }
    }

    recoverFromDiscard() {
        if (this.discard.length === 0) {
            this.showCardEffect('No cards in discard', this.cameras.main.centerX, 150);
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.discard.length);
        const cardData = this.discard.splice(randomIndex, 1)[0];

        const numCards = this.hand.length;
        const { x, y, rotation } = getCardPosition(numCards, numCards + 1);
        const depth = numCards + 1;

        const card = new Card(this, 960, 350, cardData);
        card.setAlpha(0);
        card.setScale(0.25);
        card.setDepth(depth);
        card.homeRotation = rotation;
        card.homeDepth = depth;
        card.setHomePosition(x, y, rotation, depth);
        this.hand.push(card);

        this.tweens.add({
            targets: card,
            x: x,
            y: y,
            rotation: rotation,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        this.reorganizeHand();
    }

    discardHand() {
        const cardsToDiscard = [...this.hand];
        cardsToDiscard.forEach((card, i) => {
            this.discard.push(card.cardData);
            this.tweens.add({
                targets: card,
                alpha: 0,
                scale: 0,
                y: card.y + 200,
                duration: 300,
                delay: i * 50,
                onComplete: () => card.destroy()
            });
        });
        this.hand = [];
    }

    shuffleDiscardIntoDeck() {
        this.deck = [...this.discard].sort(() => Math.random() - 0.5);
        this.discard = [];
        this.updateDeckDisplay();
        this.showCardEffect('Défausse mélangée', 960, 150);
    }

    showDeckView() {
        if (this.deckViewActive) return;
        this.deckViewActive = true;

        const overlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7).setDepth(1000).setInteractive();

        const scrollHeight = Math.ceil(this.deck.length / 4) * 350;
        const maskShape = this.make.graphics();
        maskShape.fillRect(260, 0, 1400, 1080);
        const mask = maskShape.createGeometryMask();

        const container = this.add.container(0, 0).setDepth(1001);
        container.setMask(mask);

        this.deck.forEach((cardData, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 480 + col * 250;
            const y = 240 + row * 360;
            const card = new Card(this, x, y, cardData);
            card.setScale(0.8);
            card.disableInteractive();
            container.add(card);
        });

        let scrollY = 0;
        const maxScroll = Math.max(0, scrollHeight - 800);
        let dragStartY = 0;
        let isDragging = false;
        let velocity = 0;

        const scrollZone = this.add.rectangle(960, 540, 1200, 800, 0x000000, 0).setDepth(1001).setInteractive();

        scrollZone.on('pointerdown', (pointer) => {
            isDragging = true;
            dragStartY = pointer.y;
            velocity = 0;
        });

        this.input.on('pointermove', (pointer) => {
            if (!isDragging || !this.deckViewActive) return;
            const delta = pointer.y - dragStartY;
            velocity = delta;
            scrollY = Phaser.Math.Clamp(scrollY + delta, -maxScroll, 0);
            container.y = 140 + scrollY;
            dragStartY = pointer.y;
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.deckViewActive) return;
            scrollY = Phaser.Math.Clamp(scrollY + deltaY * 0.5, -maxScroll, 0);
            container.y = 140 + scrollY;
        });

        const backBtn = this.add.image(100, 1000, 'button-blue').setScale(0.5).setDepth(1002).setInteractive({ useHandCursor: true });
        const backText = this.add.text(100, 998, 'Retour', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5).setDepth(1003);

        backBtn.on('pointerdown', () => {
            this.deckViewActive = false;
            overlay.destroy();
            container.destroy();
            maskShape.destroy();
            scrollZone.destroy();
            backBtn.destroy();
            backText.destroy();
        });
    }

    endTurn() {
        this.endTurnBtn.disableInteractive();
        this.endTurnBtn.setFillStyle(0x555555);
        this.endTurnText.setAlpha(0.5);
        this.cardsPlayedThisTurn = 0;

        this.discardHand();
        this.updateDiscardDisplay();

        this.time.delayedCall(400, () => {
            this.mana = this.maxMana;
            this.updateManaDisplay();

            if (this.deck.length < this.maxHandSize && this.discard.length > 0) {
                this.shuffleDiscardIntoDeck();
            }

            this.drawCards(this.maxHandSize);
        });

        this.time.delayedCall(1200, () => {

            if (!this.skipNextEnemyTurn) {
                const activeEnemies = this.enemies.filter(e => e.active);
                activeEnemies.forEach((enemy, i) => {
                    this.time.delayedCall(i * 800, () => {
                        const startX = enemy.x;
                        let damage = enemy.attackDamage;

                        if (enemy.debuffs.slow) {
                            damage = Math.floor(damage * (1 - enemy.debuffs.slow.value));
                        }

                        if (enemy.debuffs.skip && enemy.debuffs.skip.duration > 0) {
                            this.showCardEffect('Skipped', enemy.x, enemy.y - 50);
                            enemy.debuffs.skip.duration--;
                            if (enemy.debuffs.skip.duration <= 0) delete enemy.debuffs.skip;
                            enemy.updateHealthBar();
                            return;
                        }

                        this.tweens.add({
                            targets: enemy,
                            x: startX - 100,
                            duration: 200,
                            yoyo: true,
                            onYoyo: () => {
                                if (this.player.buffs.evasion && this.player.buffs.evasion.duration > 0) {
                                    this.showCardEffect('Evaded!', this.player.x, this.player.y - 50);
                                    this.player.buffs.evasion.duration--;
                                    if (this.player.buffs.evasion.duration <= 0) delete this.player.buffs.evasion;
                                } else {
                                    this.sound.play('monster_attack');
                                    this.playAttackEffect(this.player.x, this.player.y);
                                    this.player.takeDamage(damage);
                                    this.checkDefeat();
                                }
                            },
                            onComplete: () => {
                                Object.keys(enemy.debuffs).forEach(key => {
                                    if (enemy.debuffs[key].duration) {
                                        enemy.debuffs[key].duration--;
                                        if (enemy.debuffs[key].duration <= 0) {
                                            delete enemy.debuffs[key];
                                            enemy.updateHealthBar();
                                        }
                                    }
                                });

                                if (i === activeEnemies.length - 1) {
                                    this.time.delayedCall(300, () => {
                                        if (this.player.temporaryShield) {
                                            this.player.temporaryShield = 0;
                                            this.player.updateHealthBar();
                                        }

                                        if (this.player.blockIncrement && this.player.blockIncrement.value > 0) {
                                            this.player.shield += this.player.blockIncrement.value;
                                            this.showCardEffect(`+${this.player.blockIncrement.value} Bloc`, this.player.x, this.player.y - 50);
                                            this.player.updateHealthBar();
                                        }

                                        this.endTurnBtn.setInteractive({ useHandCursor: true });
                                        this.endTurnBtn.setFillStyle(0x7b3f9e);
                                        this.endTurnText.setAlpha(1);
                                    });
                                }
                            }
                        });
                    });
                });
            } else {
                this.skipNextEnemyTurn = false;

                if (this.player.temporaryShield) {
                    this.player.temporaryShield = 0;
                    this.player.updateHealthBar();
                }

                if (this.player.blockIncrement && this.player.blockIncrement.value > 0) {
                    this.player.shield += this.player.blockIncrement.value;
                    this.showCardEffect(`+${this.player.blockIncrement.value} Bloc`, this.player.x, this.player.y - 50);
                    this.player.updateHealthBar();
                }

                this.endTurnBtn.setInteractive({ useHandCursor: true });
                this.endTurnBtn.setFillStyle(0x7b3f9e);
                this.endTurnText.setAlpha(1);
            }
        });
    }


}

function getCardPosition(i, numCards) {
    const splinePoints = [
        { x: 560, y: 1080 },
        { x: 940, y: 1000 },
        { x: 1500, y: 1080 }
    ];

    if (numCards === 1) {
        return { x: splinePoints[1].x, y: splinePoints[1].y, rotation: 0 };
    }

    const t = i / (numCards - 1);
    const curve = new Phaser.Curves.Spline(splinePoints);
    const point = curve.getPoint(t);

    const tangent = curve.getTangent(t);
    const rotation = Math.atan2(tangent.y, tangent.x);

    return { x: point.x, y: point.y, rotation };
}
