import { Card } from '../entities/Card';
import { CARD_DATABASE } from '../config/CardDatabase';
import { STARTING_DECK } from '../config/PlayerDeck';
import { GameProgress } from './GameProgress';

export class CardManager {
    constructor(scene) {
        this.scene = scene;
        this.hand = [];
        this.deck = [];
        this.discard = [];
    }

    initializeDeck() {
        const progress = GameProgress.load();
        const deckNames = progress.playerDeck?.length > 0 ? progress.playerDeck : STARTING_DECK;
        const deck = deckNames
            .map(name => CARD_DATABASE.find(card => card.name === name))
            .filter(card => card !== undefined);
        this.deck = deck.sort(() => Math.random() - 0.5);
        return this.deck;
    }

    dealCards(count = 5) {
        if (this.deck.length === 0) return false;

        const numCardsToDeal = Math.min(count, this.deck.length);
        const cardData = this.deck.splice(0, numCardsToDeal);

        cardData.forEach((data, i) => {
            this.scene.time.delayedCall(i * 150, () => {
                const card = this.createCard(data, i, 7);
                this.hand.push(card);
                this.scene.sound.play(`card_draw${Math.floor(Math.random() * 5) + 1}`);
                this.animateCardIn(card);
            });
        });

        return true;
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) break;

            const cardData = this.deck.pop();
            const currentIndex = this.hand.length;
            const card = this.createCard(cardData, currentIndex, this.hand.length + 1);
            this.hand.push(card);
            this.scene.sound.play(`card_draw${Math.floor(Math.random() * 5) + 1}`);

            this.scene.time.delayedCall(i * 150, () => {
                this.animateCardIn(card);
            });
        }

        this.scene.time.delayedCall(count * 150 + 300, () => {
            this.reorganizeHand();
        });
    }

    createCard(data, index, totalCards) {
        const { x, y, rotation } = getCardPosition(index, totalCards);
        const depth = index + 1;

        const card = new Card(this.scene, 960, 350, data);
        card.setAlpha(0).setScale(0.25).setDepth(depth);
        card.homeRotation = rotation;
        card.homeDepth = depth;
        card.setHomePosition(x, y, rotation, depth);

        return card;
    }

    animateCardIn(card) {
        this.scene.tweens.add({
            targets: card,
            x: card.homeX,
            y: card.homeY,
            rotation: card.homeRotation,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    removeCardFromHand(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
            this.discard.push(card.cardData);
        }

        card.setDepth(500);
        this.scene.time.delayedCall(350, () => {
            this.scene.tweens.add({
                targets: card,
                x: 1850,
                y: 1000,
                scale: 0.1,
                rotation: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    card.destroy();
                    this.reorganizeHand();
                }
            });
        });
    }

    reorganizeHand() {
        if (this.hand.length === 0) return;

        this.hand.forEach((card, i) => {
            const { x, y, rotation } = getCardPosition(i, this.hand.length);
            const depth = i + 1;

            card.setHomePosition(x, y, rotation, depth);
            card.setDepth(depth);

            this.scene.tweens.add({
                targets: card,
                x, y, rotation,
                duration: 300,
                ease: 'Power2'
            });
        });
    }

    discardHand() {
        const cardsToDiscard = [...this.hand];
        cardsToDiscard.forEach((card, i) => {
            this.discard.push(card.cardData);
            this.scene.tweens.add({
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
    }

    recoverFromDiscard() {
        if (this.discard.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * this.discard.length);
        const cardData = this.discard.splice(randomIndex, 1)[0];

        const numCards = this.hand.length;
        const card = this.createCard(cardData, numCards, numCards + 1);
        this.hand.push(card);
        this.animateCardIn(card);
        this.reorganizeHand();

        return cardData;
    }

    uncenterAllCards() {
        this.hand.forEach(card => card.uncenter());
    }
}

function getCardPosition(i, numCards) {
    const splinePoints = [
        { x: 560, y: 1080 },
        { x: 940, y: 1000 },
        { x: 1360, y: 1080 }
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
