import { PatternManager } from './PatternManager'
import { PATTERN_ACTIONS, ATTACK_PATTERNS } from '../config/AttackPatterns'
import { ENEMY_DATABASE } from '../config/EnemyDatabase'
import { Enemy } from '../entities/Enemy'
import { IntentDisplay } from './IntentDisplay'

export class TurnManager {
    constructor(scene) {
        this.scene = scene;
    }

    executeEnemyTurn(enemies, player, skipTurn) {
        if (skipTurn) {
            this.handleSkippedTurn(player);
            return;
        }

        const activeEnemies = enemies.filter(e => e.active);
        activeEnemies.forEach((enemy, i) => {
            this.scene.time.delayedCall(i * 800, () => {
                this.executeEnemyAction(enemy, player, i === activeEnemies.length - 1);
            });
        });
    }

    executeEnemyAction(enemy, player, isLastEnemy) {
        if (enemy.debuffs.skip?.duration > 0) {
            this.scene.showCardEffect('Skipped', enemy.x, enemy.y - 50);
            enemy.debuffs.skip.duration--;
            if (enemy.debuffs.skip.duration <= 0) delete enemy.debuffs.skip;
            enemy.updateHealthBar();
            if (isLastEnemy) this.handleEndOfEnemyTurn(player);
            return;
        }

        console.log('Enemy pattern:', enemy.attackPattern);
        console.log('Turn number:', this.scene.turnNumber);
        const action = PatternManager.executePattern(enemy, player, this.scene.turnNumber)
        console.log('Action:', action);

        switch (action.type) {
            case 'attack':
                this.executeAttack(enemy, player, action.damage, isLastEnemy)
                break
            case 'charge':
                this.executeCharge(enemy, action.multiplier, isLastEnemy, player)
                break
            case 'block':
                this.executeBlock(enemy, action.amount, isLastEnemy, player)
                break
            case 'dodge':
                this.executeDodge(enemy, isLastEnemy, player)
                break
            case 'summon':
                this.executeSummon(enemy, player, action.summonType, isLastEnemy)
                break
        }
    }

    executeAttack(enemy, player, damage, isLastEnemy) {
        const startX = enemy.x
        let finalDamage = damage

        if (enemy.debuffs.slow) {
            finalDamage = Math.floor(finalDamage * (1 - enemy.debuffs.slow.value))
        }

        this.scene.tweens.add({
            targets: enemy,
            x: startX - 100,
            duration: 200,
            yoyo: true,
            onYoyo: () => this.handleAttackImpact(enemy, player, finalDamage),
            onComplete: () => {
                this.updateEnemyDebuffs(enemy)
                PatternManager.resetTurnState(enemy)
                if (isLastEnemy) this.handleEndOfEnemyTurn(player)
            }
        })
    }

    executeCharge(enemy, multiplier, isLastEnemy, player) {
        this.scene.showCardEffect(`Charge x${multiplier}`, enemy.x, enemy.y - 50)
        this.scene.tweens.add({
            targets: enemy.sprite,
            tint: 0xff0000,
            scale: enemy.sprite.scaleX * 1.2,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                enemy.sprite.clearTint()
                this.updateEnemyDebuffs(enemy)
                if (isLastEnemy) this.handleEndOfEnemyTurn(player)
            }
        })
    }

    executeBlock(enemy, amount, isLastEnemy, player) {
        enemy.addTemporaryShield(amount)
        this.scene.showCardEffect(`+${amount} Bloc`, enemy.x, enemy.y - 50)
        this.updateEnemyDebuffs(enemy)
        if (isLastEnemy) this.handleEndOfEnemyTurn(player)
    }

    executeDodge(enemy, isLastEnemy, player) {
        enemy.isDodging = true
        this.scene.showCardEffect('Esquive activée', enemy.x, enemy.y - 50)
        this.scene.tweens.add({
            targets: enemy,
            alpha: 0.5,
            duration: 300,
            ease: 'Power2'
        })
        this.updateEnemyDebuffs(enemy)
        if (isLastEnemy) this.handleEndOfEnemyTurn(player)
    }

    executeSummon(enemy, player, summonType, isLastEnemy) {
        const enemyData = ENEMY_DATABASE[summonType]
        if (!enemyData) {
            if (isLastEnemy) this.handleEndOfEnemyTurn(player)
            return
        }

        const summonedCount = this.scene.enemies.filter(e => e.active && e.summonedBy === enemy).length
        const spriteWidth = enemy.sprite.displayWidth
        const spacing = 120
        const offsetX = -(spriteWidth / 2 + spacing + summonedCount * spacing)

        const newEnemy = new Enemy(this.scene, enemy.x + offsetX, enemy.y, enemyData.sprite, 0.5)
        newEnemy.maxHealth = enemyData.health
        newEnemy.health = enemyData.health
        newEnemy.attackDamage = enemyData.attack
        newEnemy.summonedBy = enemy
        
        if (enemyData.pattern && ATTACK_PATTERNS[enemyData.pattern]) {
            newEnemy.attackPattern = ATTACK_PATTERNS[enemyData.pattern].pattern
            console.log(`Summoned ${summonType} with pattern:`, newEnemy.attackPattern);
        }
        
        newEnemy.updateHealthBar()
        
        this.scene.enemies.push(newEnemy)
        this.scene.showCardEffect('Invocation!', enemy.x, enemy.y - 50)
        
        IntentDisplay.updateEnemyIntent(newEnemy, this.scene.turnNumber + 1)
        
        newEnemy.setAlpha(0)
        this.scene.tweens.add({
            targets: newEnemy,
            alpha: 1,
            y: enemy.y,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.updateEnemyDebuffs(enemy)
                if (isLastEnemy) this.handleEndOfEnemyTurn(player)
            }
        })
    }

    handleAttackImpact(enemy, player, damage) {
        if (player.buffs.evasion?.duration > 0) {
            this.scene.showCardEffect('Evaded!', player.x, player.y - 50);
            player.buffs.evasion.duration--;
            if (player.buffs.evasion.duration <= 0) delete player.buffs.evasion;
        } else if (enemy.isDodging) {
            this.scene.showCardEffect('Raté!', player.x, player.y - 50);
        } else {
            this.scene.sound.play('monster_attack');
            this.scene.playAttackEffect(player.x, player.y);
            player.takeDamage(damage);
            this.scene.checkDefeat();
        }
    }

    updateEnemyDebuffs(enemy) {
        Object.keys(enemy.debuffs).forEach(key => {
            if (enemy.debuffs[key].duration) {
                enemy.debuffs[key].duration--;
                if (enemy.debuffs[key].duration <= 0) {
                    delete enemy.debuffs[key];
                    enemy.updateHealthBar();
                }
            }
        });
    }

    handleEndOfEnemyTurn(player) {
        this.scene.time.delayedCall(300, () => {
            if (player.shield) {
                player.shield = 0;
                player.updateHealthBar();
            }

            if (player.blockIncrement?.value > 0) {
                player.addTemporaryShield(player.blockIncrement.value);
                this.scene.showCardEffect(`+${player.blockIncrement.value} Bloc`, player.x, player.y - 50);
            }

            this.scene.mana = this.scene.maxMana;
            this.scene.updateManaDisplay();

            if (this.scene.cardManager.deck.length < this.scene.maxHandSize && this.scene.cardManager.discard.length > 0) {
                this.scene.shuffleDiscardIntoDeck();
            }

            this.scene.drawCards(this.scene.maxHandSize);

            this.scene.time.delayedCall(500, () => {
                this.scene.turnNumber++;
                
                this.scene.enemies.filter(e => e.active).forEach(enemy => {
                    IntentDisplay.updateEnemyIntent(enemy, this.scene.turnNumber);
                });
                
                this.scene.uiManager.showPhaseMessage('Tour du joueur', `Phase ${this.scene.turnNumber}`, 1500);
                this.scene.time.delayedCall(1800, () => {
                    this.scene.uiManager.setEndTurnButtonState(true, this.scene.endTurnBtn, this.scene.endTurnText);
                });
            });
        });
    }

    handleSkippedTurn(player) {
        if (player.shield) {
            player.shield = 0;
            player.updateHealthBar();
        }

        if (player.blockIncrement?.value > 0) {
            player.addTemporaryShield(player.blockIncrement.value);
            this.scene.showCardEffect(`+${player.blockIncrement.value} Bloc`, player.x, player.y - 50);
        }

        this.scene.mana = this.scene.maxMana;
        this.scene.updateManaDisplay();

        if (this.scene.cardManager.deck.length < this.scene.maxHandSize && this.scene.cardManager.discard.length > 0) {
            this.scene.shuffleDiscardIntoDeck();
        }

        this.scene.drawCards(this.scene.maxHandSize);

        this.scene.time.delayedCall(500, () => {
            this.scene.turnNumber++;
            this.scene.uiManager.showPhaseMessage('Tour du joueur', `Phase ${this.scene.turnNumber}`, 1500);
            this.scene.time.delayedCall(1800, () => {
                this.scene.uiManager.setEndTurnButtonState(true, this.scene.endTurnBtn, this.scene.endTurnText);
            });
        });
    }
}
