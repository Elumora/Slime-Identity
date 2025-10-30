import { Card } from '../entities/Card';

export class CardViewManager {
    constructor(scene) {
        this.scene = scene;
        this.deckViewActive = false;
        this.discardViewActive = false;
    }

    showDeckView(deck) {
        if (this.deckViewActive) return;
        this.deckViewActive = true;

        const elements = this.createCardView(deck, () => {
            this.deckViewActive = false;
            this.destroyView(elements);
        });
    }

    showDiscardView(discard) {
        if (this.discardViewActive) return;
        this.discardViewActive = true;

        const elements = this.createCardView(discard, () => {
            this.discardViewActive = false;
            this.destroyView(elements);
        });
    }

    createCardView(cards, onClose) {
        const overlay = this.scene.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7)
            .setDepth(1000).setInteractive();

        const maskShape = this.scene.make.graphics();
        maskShape.fillRect(260, 0, 1400, 1080);
        const mask = maskShape.createGeometryMask();

        const container = this.scene.add.container(0, 0).setDepth(1001);
        container.setMask(mask);

        cards.forEach((cardData, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 480 + col * 250;
            const y = 240 + row * 360;
            const card = new Card(this.scene, x, y, cardData);
            card.setScale(0.8);
            card.disableInteractive();
            container.add(card);
        });

        const scrollHandler = this.createScrollHandler(container, cards.length);
        const backBtn = this.createBackButton(onClose);

        return { overlay, container, maskShape, scrollHandler, backBtn };
    }

    createScrollHandler(container, cardCount) {
        const scrollHeight = Math.ceil(cardCount / 4) * 350;
        const maxScroll = Math.max(0, scrollHeight - 800);
        let scrollY = 0;
        let dragStartY = 0;
        let isDragging = false;

        const scrollZone = this.scene.add.rectangle(960, 540, 1200, 800, 0x000000, 0)
            .setDepth(1001).setInteractive();

        const pointerDown = (pointer) => {
            isDragging = true;
            dragStartY = pointer.y;
        };

        const pointerMove = (pointer) => {
            if (!isDragging) return;
            const delta = pointer.y - dragStartY;
            scrollY = Phaser.Math.Clamp(scrollY + delta, -maxScroll, 0);
            container.y = 140 + scrollY;
            dragStartY = pointer.y;
        };

        const pointerUp = () => {
            isDragging = false;
        };

        const wheel = (pointer, gameObjects, deltaX, deltaY) => {
            scrollY = Phaser.Math.Clamp(scrollY + deltaY * 0.5, -maxScroll, 0);
            container.y = 140 + scrollY;
        };

        scrollZone.on('pointerdown', pointerDown);
        this.scene.input.on('pointermove', pointerMove);
        this.scene.input.on('pointerup', pointerUp);
        this.scene.input.on('wheel', wheel);

        return { scrollZone, pointerDown, pointerMove, pointerUp, wheel };
    }

    createBackButton(onClick) {
        const btn = this.scene.add.image(100, 1000, 'button-blue')
            .setScale(0.5).setDepth(1002).setInteractive({ useHandCursor: true });
        const text = this.scene.add.text(100, 998, 'Retour', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1003);

        btn.on('pointerdown', onClick);

        return { btn, text };
    }

    destroyView(elements) {
        elements.overlay.destroy();
        elements.container.destroy();
        elements.maskShape.destroy();
        elements.scrollHandler.scrollZone.destroy();
        elements.backBtn.btn.destroy();
        elements.backBtn.text.destroy();
    }
}
