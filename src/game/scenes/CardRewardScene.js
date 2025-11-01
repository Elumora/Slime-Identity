import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { CARD_DATABASE, RARITY } from '../config/CardDatabase';
import { Card } from '../entities/Card';
import { GameProgress } from '../systems/GameProgress';

export class CardRewardScene extends Scene {
    constructor() {
        super('CardRewardScene');
    }

    init(data) {
        this.monsterX = data.monsterX;
        this.monsterY = data.monsterY;
        this.fromChest = data.fromChest || false;
    }

    create() {
        const overlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.5).setDepth(0);

        this.add.text(960, 200, 'Choisissez la nouvelle carte à ajouter à votre deck', {
            fontSize: '48px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(1);

        const randomCards = this.getRandomCards(3);
        const spacing = 460;
        const startX = 960 - spacing;

        this.cards = [];
        this.selectedCard = null;
        this.confirmButton = null;
        this.uncenterAllCards = () => { }; // Dummy method for Card compatibility

        randomCards.forEach((cardData, i) => {
            const x = startX + (i * spacing);
            const card = new Card(this, x, 600, cardData);
            card.setScale(1.3);
            card.setDepth(2);
            card.cardData = cardData;
            card.originalX = x;
            card.originalY = 600;
            card.originalScale = 1.3;
            card.isSelected = false;

            card.removeAllListeners();
            card.setInteractive({ useHandCursor: true });

            const rarityColors = {
                [RARITY.COMMON]: 0xaaaaaa,
                [RARITY.UNCOMMON]: 0x00ff00,
                [RARITY.RARE]: 0x0088ff,
                [RARITY.EPIC]: 0xaa00ff,
                [RARITY.LEGENDARY]: 0xff8800
            };

            const rarityGlow = this.add.graphics();
            rarityGlow.lineStyle(6, rarityColors[cardData.rarity] || 0xaaaaaa, 0.8);
            rarityGlow.strokeRect(x - 120, 600 - 180, 240, 360);
            rarityGlow.setDepth(1);
            card.rarityGlow = rarityGlow;

            const selectionGlow = this.add.graphics();
            selectionGlow.lineStyle(8, 0xffff00, 1);
            selectionGlow.strokeRect(x - 120, 600 - 180, 240, 360);
            selectionGlow.setDepth(1);
            selectionGlow.setVisible(false);
            card.selectionGlow = selectionGlow;

            card.on('pointerdown', () => {
                if (this.selectedCard === card) {
                    this.deselectCard(card);
                } else {
                    if (this.selectedCard) {
                        this.deselectCard(this.selectedCard);
                    }
                    this.selectCardVisual(card);
                }
            });

            card.on('pointerover', () => {
                if (card.isSelected) return;
                this.tweens.add({
                    targets: card,
                    scale: 1.45,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            card.on('pointerout', () => {
                if (card.isSelected) return;
                this.tweens.add({
                    targets: card,
                    scale: 1.3,
                    duration: 200,
                    ease: 'Power2'
                });
            });

            this.cards.push(card);
        });

        EventBus.emit('current-scene-ready', this);
    }

    selectCardVisual(card) {
        card.isSelected = true;
        this.selectedCard = card;

        card.selectionGlow.setVisible(true);
        this.tweens.add({
            targets: card.selectionGlow,
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: card,
            scale: 1.5,
            duration: 200,
            ease: 'Power2'
        });

        const rarityParticleColors = {
            [RARITY.COMMON]: 0xcccccc, // White
            [RARITY.UNCOMMON]: 0x00ff00, // Green
            [RARITY.RARE]: 0x0088ff, // Blue
            [RARITY.EPIC]: 0xaa00ff, // Purple
            [RARITY.LEGENDARY]: 0xff8800 // Orange
        };

        const particleColor = rarityParticleColors[card.cardData.rarity] || 0xcccccc;

        card.particles = this.add.particles(card.originalX, card.originalY, 'particle', {
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            alpha: { start: 0.6, end: 0 },
            scale: { start: 1, end: 4 },
            lifespan: 1100,
            frequency: 10,
            tint: particleColor,
            blendMode: 'ADD'
        }).setDepth(1);

        this.cards.forEach(c => {
            c.setInteractive({ useHandCursor: true });
        });

        this.confirmButton = this.add.text(card.originalX, 850, 'Choisir cette carte', {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#00aa00',
            padding: { x: 20, y: 10 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        this.confirmButton.on('pointerdown', () => {
            this.confirmSelection();
        });
    }

    deselectCard(card) {
        card.isSelected = false;
        this.selectedCard = null;

        card.selectionGlow.setVisible(false);

        if (card.particles) {
            card.particles.stop();
            this.time.delayedCall(1000, () => {
                if (card.particles) card.particles.destroy();
            });
            card.particles = null;
        }

        this.tweens.add({
            targets: card,
            scale: card.originalScale,
            duration: 200,
            ease: 'Power2'
        });

        if (this.confirmButton) {
            this.confirmButton.destroy();
            this.confirmButton = null;
        }

        this.cards.forEach(c => {
            c.setInteractive({ useHandCursor: true });
        });
    }

    confirmSelection() {
        this.confirmButton.destroy();

        const unselectedCards = this.cards.filter(c => c !== this.selectedCard);

        unselectedCards.forEach(card => {
            if (card.particles) {
                card.particles.destroy();
            }
            card.selectionGlow.destroy();
            card.rarityGlow.destroy();
            this.tweens.add({
                targets: card,
                alpha: 0,
                scale: 0.5,
                rotation: Math.random() > 0.5 ? 1 : -1,
                duration: 400,
                ease: 'Power2',
                onComplete: () => card.destroy()
            });
        });

        if (this.selectedCard.particles) {
            this.selectedCard.particles.destroy();
        }
        this.selectedCard.selectionGlow.destroy();
        this.selectedCard.rarityGlow.destroy();

        const moveToCenter = this.selectedCard.originalX !== 960;

        if (moveToCenter) {
            this.tweens.add({
                targets: this.selectedCard,
                x: 960,
                y: 540,
                scale: 1.5,
                duration: 400,
                ease: 'Back.easeOut',
                onComplete: () => {
                    this.time.delayedCall(250, () => {
                        this.moveCardToDeckAndExit();
                    });
                }
            });
        } else {
            this.time.delayedCall(250, () => {
                this.moveCardToDeckAndExit();
            });
        }
    }

    moveCardToDeckAndExit() {
        this.tweens.add({
            targets: this.selectedCard,
            x: 1700,
            y: 150,
            scale: 0.5,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.addCardToDeck(this.selectedCard.cardData);
                if (this.fromChest) {
                    this.scene.start('MapScene');
                } else {
                    this.scene.start('MapScene');
                }
            }
        });
    }

    addCardToDeck(cardData) {
        const progress = GameProgress.load();
        if (!progress.playerDeck) {
            progress.playerDeck = [];
        }
        progress.playerDeck.push(cardData.name);
        GameProgress.save(progress);
    }

    getRandomCards(count) {
        const rarityWeights = {
            [RARITY.COMMON]: 50,
            [RARITY.UNCOMMON]: 30,
            [RARITY.RARE]: 12,
            [RARITY.EPIC]: 6,
            [RARITY.LEGENDARY]: 2
        };

        const cards = [];
        for (let i = 0; i < count; i++) {
            const roll = Math.random() * 100;
            let threshold = 0;
            let selectedRarity = RARITY.COMMON;

            for (const [rarity, weight] of Object.entries(rarityWeights)) {
                threshold += weight;
                if (roll < threshold) {
                    selectedRarity = rarity;
                    break;
                }
            }

            const cardsOfRarity = CARD_DATABASE.filter(c => c.rarity === selectedRarity);
            if (cardsOfRarity.length > 0) {
                const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
                cards.push(randomCard);
            }
        }
        return cards;
    }


}
