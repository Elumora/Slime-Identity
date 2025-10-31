import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameProgress } from '../systems/GameProgress';
import { BattleManager } from '../systems/BattleManager';
import { CardManager } from '../systems/CardManager';
import { UIManager } from '../systems/UIManager';
import { CardViewManager } from '../systems/CardViewManager';
import { TurnManager } from '../systems/TurnManager';
import { IntentDisplay } from '../systems/IntentDisplay';

export class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.battleEnemies = data.enemies || [
            { sprite: 'plent', health: 20, attack: 6 }
        ];
        this.monsterX = data.monsterX;
        this.monsterY = data.monsterY;
        
        this.battleManager = new BattleManager(this);
        this.cardManager = new CardManager(this);
        this.uiManager = new UIManager(this);
        this.viewManager = new CardViewManager(this);
        this.turnManager = new TurnManager(this);
    }

    create() {
        this.add.image(960, 540, 'battleSpring').setDisplaySize(1920, 1080);

        this.cardManager.initializeDeck();
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
        this.turnNumber = 1;

        const endTurnBtn = this.uiManager.createEndTurnButton(() => this.endTurn());
        this.endTurnBtn = endTurnBtn.btn;
        this.endTurnText = endTurnBtn.text;

        this.manaText = this.uiManager.createManaDisplay(this.mana);
        this.deckCountText = this.uiManager.createDeckDisplay(this.cardManager.deck.length, () => this.showDeckView());
        this.discardCountText = this.uiManager.createDiscardDisplay(this.cardManager.discard.length, () => this.showDiscardView());

        this.anims.create({
            key: 'impact',
            frames: this.anims.generateFrameNumbers('effect', { start: 0, end: 4 }),
            frameRate: 15,
            hideOnComplete: true
        });

        this.player = this.battleManager.createPlayer();
        this.enemies = this.battleManager.createEnemies(this.battleEnemies);
        this.battleManager.animatePlayerEntrance(this.player);
        
        this.uiManager.showPhaseMessage('Début du combat', null, 1000);
        
        this.time.delayedCall(1500, () => {
            this.cardManager.dealCards();
            this.updateDeckDisplay();
            
            this.enemies.filter(e => e.active).forEach(enemy => {
                IntentDisplay.updateEnemyIntent(enemy, this.turnNumber);
            });
            
            this.time.delayedCall(1000, () => {
                this.uiManager.showPhaseMessage('Tour du joueur', `Phase ${this.turnNumber}`, 1500);
            });
        });



        this.scene.launch('DevGrid');

        EventBus.emit('current-scene-ready', this);
    }

    playAttackEffect(x, y) {
        this.battleManager.playAttackEffect(x, y);
    }

    playPlayerEffect(target) {
        this.battleManager.playPlayerEffect(target);
    }

    showCardEffect(text, x, y) {
        this.uiManager.showCardEffect(text, x, y);
    }







    removeCardFromHand(card) {
        this.cardManager.removeCardFromHand(card);
        this.updateDiscardDisplay();
    }

    updateDiscardDisplay() {
        if (this.discardCountText) {
            this.discardCountText.setText(this.cardManager.discard.length.toString());
        }
    }

    reorganizeHand() {
        this.cardManager.reorganizeHand();
    }

    checkVictory() {
        this.battleManager.checkVictory(this.monsterX, this.monsterY);
    }

    checkDefeat() {
        this.battleManager.checkDefeat();
    }

    checkDeckDefeat() {
        this.battleManager.checkDeckDefeat();
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
        this.deckCountText.setText(this.cardManager.deck.length.toString());
    }

    uncenterAllCards() {
        this.cardManager.uncenterAllCards();
    }

    get hand() {
        return this.cardManager.hand;
    }

    get deck() {
        return this.cardManager.deck;
    }

    get discard() {
        return this.cardManager.discard;
    }

    drawCards(count) {
        if (this.cardManager.deck.length === 0 && this.cardManager.discard.length === 0) {
            this.checkDeckDefeat();
            return;
        }
        
        if (this.cardManager.deck.length === 0 && this.cardManager.discard.length > 0) {
            this.shuffleDiscardIntoDeck();
        }
        
        this.cardManager.drawCards(count);
        this.updateDeckDisplay();
    }



    recoverFromDiscard() {
        const cardData = this.cardManager.recoverFromDiscard();
        if (!cardData) {
            this.showCardEffect('No cards in discard', this.cameras.main.centerX, 150);
        }
        this.updateDiscardDisplay();
    }

    discardHand() {
        this.cardManager.discardHand();
    }

    shuffleDiscardIntoDeck() {
        this.cardManager.shuffleDiscardIntoDeck();
        this.updateDeckDisplay();
        this.showCardEffect('Défausse mélangée', 960, 150);
    }

    showDeckView() {
        this.viewManager.showDeckView(this.cardManager.deck);
    }

    showDiscardView() {
        this.viewManager.showDiscardView(this.cardManager.discard);
    }

    endTurn() {
        this.uiManager.setEndTurnButtonState(false, this.endTurnBtn, this.endTurnText);
        this.cardsPlayedThisTurn = 0;

        this.discardHand();
        this.updateDiscardDisplay();

        const aliveEnemies = this.enemies.filter(e => e.active);
        if (aliveEnemies.length === 0) return;
        
        aliveEnemies.forEach(enemy => {
            if (enemy.isDodging) {
                enemy.isDodging = false;
                this.tweens.add({
                    targets: enemy,
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2'
                });
            }
        });

        this.time.delayedCall(400, () => {
            this.uiManager.showPhaseMessage('Tour de l\'ennemi', null, 1500);
        });

        this.time.delayedCall(2600, () => {
            this.turnManager.executeEnemyTurn(this.enemies, this.player, this.skipNextEnemyTurn);
            if (this.skipNextEnemyTurn) {
                this.skipNextEnemyTurn = false;
            }
        });
    }


}
