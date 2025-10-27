import { STARTING_DECK } from '../config/PlayerDeck';

export class GameProgress {
    static save(data) {
        localStorage.setItem('slimeIdentity', JSON.stringify(data));
    }

    static load() {
        const saved = localStorage.getItem('slimeIdentity');
        return saved ? JSON.parse(saved) : this.getDefault();
    }

    static getDefault() {
        const ownedCards = {}
        STARTING_DECK.forEach(cardName => {
            ownedCards[cardName] = (ownedCards[cardName] || 0) + 1
        })

        return {
            currentPathIndex: 0,
            coins: 10,
            collectedCoins: [],
            collectedChests: [],
            defeatedMonsters: [],
            playerHealth: 80,
            playerDeck: [...STARTING_DECK],
            ownedCards,
            savedDecks: [{ name: 'Deck 1', cards: [...STARTING_DECK] }],
            selectedDeckIndex: 0
        };
    }

    static clear() {
        localStorage.removeItem('slimeIdentity');
    }
}
