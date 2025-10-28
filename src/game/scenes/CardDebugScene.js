import { Scene } from 'phaser';
import { Card } from '../entities/Card';
import { CARD_DATABASE } from '../config/CardDatabase';

export class CardDebugScene extends Scene {
    constructor() {
        super('CardDebugScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#2d2d2d');
        
        this.drawGrid();
        this.setupCards();
        this.setupCoordDisplay();
        this.setupControls();
    }

    drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x555555, 0.5);
        
        for (let x = 0; x <= 1920; x += 100) {
            graphics.lineBetween(x, 0, x, 1080);
        }
        for (let y = 0; y <= 1080; y += 100) {
            graphics.lineBetween(0, y, 1920, y);
        }

        for (let x = 0; x <= 1920; x += 100) {
            for (let y = 0; y <= 1080; y += 100) {
                this.add.text(x + 5, y + 5, `${x},${y}`, {
                    fontSize: '10px',
                    color: '#888888'
                });
            }
        }
    }

    setupCards() {
        this.cards = [];
        this.centeredCard = null;
        const cardsPerRow = 6;
        const startX = 200;
        const startY = 200;
        const spacingX = 280;
        const spacingY = 450;

        CARD_DATABASE.forEach((cardData, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const x = startX + (col * spacingX);
            const y = startY + (row * spacingY);
            
            const card = new Card(this, x, y, cardData);
            card.setScale(0.8);
            card.setInteractive({ draggable: true, useHandCursor: true });
            card.homeX = x;
            card.homeY = y;
            this.cards.push(card);

            this.input.setDraggable(card);
            
            card.on('pointerdown', () => {
                if (this.centeredCard === card) {
                    this.uncenterCard();
                } else {
                    this.centerCard(card);
                }
            });
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.updateCoordDisplay(dragX, dragY);
        });
    }

    centerCard(card) {
        if (this.centeredCard) {
            this.uncenterCard();
        }
        
        this.centeredCard = card;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        this.tweens.add({
            targets: card,
            x: centerX,
            y: centerY,
            scale: 1.5,
            duration: 300,
            ease: 'Back.easeOut'
        });
        card.setDepth(10000);
    }

    uncenterCard() {
        if (!this.centeredCard) return;
        
        const card = this.centeredCard;
        this.tweens.add({
            targets: card,
            x: card.homeX,
            y: card.homeY,
            scale: 0.8,
            duration: 300,
            ease: 'Back.easeOut'
        });
        card.setDepth(1);
        this.centeredCard = null;
    }

    setupCoordDisplay() {
        this.coordDisplay = this.add.text(10, 10, 'Position: -', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 }
        }).setDepth(5000);
    }

    updateCoordDisplay(x, y) {
        this.coordDisplay.setText(`Position: x: ${Math.round(x)}, y: ${Math.round(y)}`);
    }

    setupControls() {
        const backButton = this.add.text(10, 60, 'RETOUR (ESC)', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 10 }
        }).setInteractive({ useHandCursor: true }).setDepth(5000);

        backButton.on('pointerdown', () => this.scene.start('MainMenu'));
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MainMenu'));
    }
}
