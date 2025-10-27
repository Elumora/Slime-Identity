export class CardAI {
    constructor() {
        this.qTable = {};
        this.learningRate = 0.15;
        this.discountFactor = 0.95;
        this.epsilon = 0.3;
        this.cardScores = {};
        this.cardPlayCount = {};
        this.winningSequences = [];
        this.gameHistory = [];
    }

    savePhaseStats(gameMode, phase, config, stats) {
        const key = `testStats_${gameMode}`;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (parseFloat(stats.winRate) >= 60) {
            stored.push({
                phase,
                config,
                winRate: stats.winRate,
                avgHealth: stats.avgHealth,
                avgTurns: stats.avgTurns,
                avgCardsPlayed: stats.avgCardsPlayed,
                avgCardsRemaining: stats.avgCardsRemaining,
                totalGames: stats.totalGames,
                timestamp: Date.now()
            });
            localStorage.setItem(key, JSON.stringify(stored));
        }
    }

    loadPhaseStats(gameMode) {
        const key = `testStats_${gameMode}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    clearPhaseStats(gameMode) {
        const key = `testStats_${gameMode}`;
        localStorage.removeItem(key);
    }

    getStateKey(gameState) {
        const { playerHealth, enemyHealth, mana, handSize, turnNumber } = gameState;
        const healthBucket = Math.floor(playerHealth / 5);
        const enemyBucket = Math.floor(enemyHealth / 5);
        const manaBucket = Math.floor(mana / 2);
        const turnBucket = Math.min(Math.floor(turnNumber / 2), 5);
        return `${healthBucket}-${enemyBucket}-${manaBucket}-${handSize}-${turnBucket}`;
    }

    getCardScore(cardName, gameState) {
        const stateKey = this.getStateKey(gameState);
        const key = `${stateKey}-${cardName}`;
        return this.qTable[key] || 0;
    }

    updateCardScore(cardName, gameState, reward, nextGameState = null) {
        const stateKey = this.getStateKey(gameState);
        const key = `${stateKey}-${cardName}`;
        const currentScore = this.qTable[key] || 0;
        
        let futureReward = 0;
        if (nextGameState) {
            const nextStateKey = this.getStateKey(nextGameState);
            const nextStateValues = Object.keys(this.qTable)
                .filter(k => k.startsWith(nextStateKey))
                .map(k => this.qTable[k]);
            futureReward = nextStateValues.length > 0 ? Math.max(...nextStateValues) : 0;
        }
        
        const tdTarget = reward + this.discountFactor * futureReward;
        this.qTable[key] = currentScore + this.learningRate * (tdTarget - currentScore);
        
        this.cardScores[cardName] = (this.cardScores[cardName] || 0) + reward;
        this.cardPlayCount[cardName] = (this.cardPlayCount[cardName] || 0) + 1;
    }

    selectBestCard(playableCards, gameState) {
        if (Math.random() < this.epsilon) {
            return playableCards[Math.floor(Math.random() * playableCards.length)];
        }

        let bestCard = playableCards[0];
        let bestScore = -Infinity;

        for (const card of playableCards) {
            let score = this.getCardScore(card.cardData.name, gameState);
            
            const healthRatio = gameState.playerHealth / 30;
            const enemyHealthRatio = gameState.enemyHealth / 30;
            const manaEfficiency = card.cardData.cost > 0 ? card.cardData.value / card.cardData.cost : card.cardData.value;
            
            score += manaEfficiency * 5;
            
            if (healthRatio > 0.7 && card.cardData.type === 'Attack') {
                score += 50 * enemyHealthRatio;
            }
            
            if (healthRatio < 0.35 && card.cardData.type === 'Heal') {
                score += 80 * (1 - healthRatio);
            }
            
            if (healthRatio < 0.5 && card.cardData.type === 'Defense') {
                score += 60 * (1 - healthRatio);
            }
            
            if (gameState.turnNumber <= 2 && card.cardData.type === 'Buff') {
                score += 40;
            }
            
            if (enemyHealthRatio < 0.4 && card.cardData.type === 'Attack') {
                score += 70 * (1 - enemyHealthRatio);
            }
            
            const playCount = this.cardPlayCount[card.cardData.name] || 0;
            if (playCount < 3) {
                score += 15;
            }
            
            if (gameState.mana - card.cardData.cost >= 2) {
                score += 10;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestCard = card;
            }
        }

        return bestCard;
    }

    calculateReward(action, result) {
        let reward = 0;

        if (result.victory) {
            reward += 150;
            reward += result.healthRemaining * 4;
            reward -= result.turnsToWin * 2;
            reward += (30 - result.turnsToWin) * 5;
        } else {
            reward -= 80;
            reward += result.healthRemaining * 1;
            reward -= (30 - result.healthRemaining) * 0.5;
        }

        const healthRatio = action.gameState.playerHealth / 30;
        const enemyHealthRatio = action.gameState.enemyHealth / 30;

        if (action.type === 'Attack') {
            reward += action.damageDealt * 2;
            if (enemyHealthRatio < 0.3) {
                reward += action.damageDealt * 3;
            }
        } else if (action.type === 'Defense') {
            if (healthRatio < 0.5) {
                reward += action.value * 3.5;
            } else {
                reward += action.value * 1.5;
            }
        } else if (action.type === 'Heal') {
            if (healthRatio < 0.4) {
                reward += action.value * 5;
            } else if (healthRatio < 0.6) {
                reward += action.value * 3;
            } else {
                reward += action.value * 0.5;
            }
        } else if (action.type === 'Buff') {
            if (action.gameState.turnNumber <= 3) {
                reward += (action.value || 5) * 3;
            } else {
                reward += (action.value || 5) * 1;
            }
        }

        const manaEfficiency = action.cost > 0 ? action.value / action.cost : action.value;
        reward += manaEfficiency * 2;

        return reward;
    }

    getTopCards(limit = 10) {
        const sorted = Object.entries(this.cardScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
        return sorted;
    }

    getBestStrategy() {
        const topCards = this.getTopCards(5);
        const avgScores = topCards.map(([name, score]) => ({ name, score }));
        
        return {
            topCards: avgScores,
            totalStates: Object.keys(this.qTable).length,
            epsilon: this.epsilon
        };
    }

    adjustEpsilon(gamesPlayed) {
        this.epsilon = Math.max(0.05, 0.3 - (gamesPlayed * 0.0015));
    }

    recordGameSequence(sequence, victory) {
        if (victory) {
            this.winningSequences.push(sequence);
            if (this.winningSequences.length > 50) {
                this.winningSequences.shift();
            }
        }
        this.gameHistory.push({ sequence, victory });
        if (this.gameHistory.length > 100) {
            this.gameHistory.shift();
        }
    }

    getWinRate() {
        if (this.gameHistory.length === 0) return 0;
        const wins = this.gameHistory.filter(g => g.victory).length;
        return (wins / this.gameHistory.length * 100).toFixed(1);
    }

    analyzeWinningPatterns() {
        const cardFrequency = {};
        this.winningSequences.forEach(seq => {
            seq.forEach(cardName => {
                cardFrequency[cardName] = (cardFrequency[cardName] || 0) + 1;
            });
        });
        return Object.entries(cardFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }

    getAllStoredStats() {
        const modes = ['DISCARD_ALL', 'DRAW_TWO', 'FIXED_HAND', 'HYBRID'];
        const allStats = {};
        modes.forEach(mode => {
            allStats[mode] = this.loadPhaseStats(mode);
        });
        return allStats;
    }
}
