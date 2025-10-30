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
                this.executeEnemyAttack(enemy, player, i === activeEnemies.length - 1);
            });
        });
    }

    executeEnemyAttack(enemy, player, isLastEnemy) {
        const startX = enemy.x;
        let damage = enemy.attackDamage;

        if (enemy.debuffs.slow) {
            damage = Math.floor(damage * (1 - enemy.debuffs.slow.value));
        }

        if (enemy.debuffs.skip?.duration > 0) {
            this.scene.showCardEffect('Skipped', enemy.x, enemy.y - 50);
            enemy.debuffs.skip.duration--;
            if (enemy.debuffs.skip.duration <= 0) delete enemy.debuffs.skip;
            enemy.updateHealthBar();
            return;
        }

        this.scene.tweens.add({
            targets: enemy,
            x: startX - 100,
            duration: 200,
            yoyo: true,
            onYoyo: () => this.handleAttackImpact(enemy, player),
            onComplete: () => {
                this.updateEnemyDebuffs(enemy);
                if (isLastEnemy) {
                    this.handleEndOfEnemyTurn(player);
                }
            }
        });
    }

    handleAttackImpact(enemy, player) {
        if (player.buffs.evasion?.duration > 0) {
            this.scene.showCardEffect('Evaded!', player.x, player.y - 50);
            player.buffs.evasion.duration--;
            if (player.buffs.evasion.duration <= 0) delete player.buffs.evasion;
        } else {
            this.scene.sound.play('monster_attack');
            this.scene.playAttackEffect(player.x, player.y);
            player.takeDamage(enemy.attackDamage);
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
            if (player.temporaryShield) {
                player.temporaryShield = 0;
                player.updateHealthBar();
            }

            if (player.blockIncrement?.value > 0) {
                player.shield += player.blockIncrement.value;
                this.scene.showCardEffect(`+${player.blockIncrement.value} Bloc`, player.x, player.y - 50);
                player.updateHealthBar();
            }

            this.scene.uiManager.setEndTurnButtonState(true, this.scene.endTurnBtn, this.scene.endTurnText);
        });
    }

    handleSkippedTurn(player) {
        if (player.temporaryShield) {
            player.temporaryShield = 0;
            player.updateHealthBar();
        }

        if (player.blockIncrement?.value > 0) {
            player.shield += player.blockIncrement.value;
            this.scene.showCardEffect(`+${player.blockIncrement.value} Bloc`, player.x, player.y - 50);
            player.updateHealthBar();
        }

        this.scene.uiManager.setEndTurnButtonState(true, this.scene.endTurnBtn, this.scene.endTurnText);
    }
}
