import { Enemy } from '../entities/Enemy';
import { GameProgress } from './GameProgress';

export class BattleManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.player = null;
    }

    createPlayer() {
        const progress = GameProgress.load();
        this.player = new Enemy(this.scene, -100, 594, 'character', 0.3);
        this.player.maxHealth = 80;
        this.player.health = progress.playerHealth ?? 80;
        this.player.isPlayer = true;
        this.player.scene = this.scene;
        this.player.updateHealthBar();
        return this.player;
    }

    createEnemies(battleEnemies) {
        const startX = 1400;
        const spacing = 250;
        const numEnemies = battleEnemies.length;

        battleEnemies.forEach((enemyData, i) => {
            const xPos = numEnemies === 1 ? 1550 : startX + (i * spacing);
            const enemy = new Enemy(this.scene, xPos, 499, enemyData.sprite, 0.5);
            enemy.maxHealth = enemyData.health;
            enemy.health = enemyData.health;
            enemy.attackDamage = enemyData.attack;
            enemy.updateHealthBar();
            this.enemies.push(enemy);
        });

        return this.enemies;
    }

    animatePlayerEntrance(player) {
        const jumpSound = this.scene.sound.add('jump');
        const jumpDistance = 150;
        const numJumps = 3;

        for (let i = 0; i < numJumps; i++) {
            const startX = -100 + (i * jumpDistance);
            const endX = startX + jumpDistance;

            this.scene.tweens.add({
                targets: player,
                x: endX,
                duration: 400,
                delay: i * 400,
                ease: 'Sine.inOut',
                onStart: () => {
                    jumpSound.play();
                    this.scene.tweens.add({
                        targets: player,
                        y: 494,
                        duration: 200,
                        ease: 'Quad.easeOut',
                        yoyo: true
                    });
                }
            });
        }
    }

    playAttackEffect(x, y) {
        const effect = this.scene.add.sprite(x, y, 'effect').setScale(2);
        effect.play('impact');
        effect.once('animationcomplete', () => effect.destroy());
    }

    playPlayerEffect(target) {
        this.scene.tweens.add({
            targets: target.sprite,
            tint: 0x00ff00,
            scale: target.sprite.scale * 1.2,
            duration: 150,
            yoyo: true,
            onComplete: () => target.sprite.clearTint()
        });
    }

    checkVictory(monsterX, monsterY) {
        const aliveEnemies = this.enemies.filter(e => e.active);
        if (aliveEnemies.length > 0) return false;

        this.scene.time.delayedCall(250, () => {
            this.scene.add.text(960, 540, 'VICTORY!', {
                fontSize: '64px',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(10000);

            if (monsterX !== undefined && monsterY !== undefined) {
                const progress = GameProgress.load();
                const monsterKey = `${monsterX},${monsterY}`;
                if (!progress.defeatedMonsters.includes(monsterKey)) {
                    progress.defeatedMonsters.push(monsterKey);
                    progress.inBattle = false;
                    GameProgress.save(progress);
                }
            }

            this.scene.time.delayedCall(500, () => {
                const progress = GameProgress.load();
                progress.playerHealth = this.player.health;
                GameProgress.save(progress);
                this.scene.scene.start('CardRewardScene', { monsterX, monsterY });
            });
        });

        return true;
    }

    checkDefeat() {
        if (this.player.health > 0) return false;

        this.scene.time.delayedCall(500, () => {
            this.scene.add.text(960, 540, 'DEFEAT!', {
                fontSize: '64px',
                color: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(10000);

            this.scene.time.delayedCall(3000, () => {
                GameProgress.clear();
                this.scene.scene.start('MapScene');
            });
        });

        return true;
    }

    checkDeckDefeat() {
        const aliveEnemies = this.enemies.filter(e => e.active);
        if (aliveEnemies.length === 0) return false;

        this.scene.add.text(960, 540, 'DEFEAT!\nNo cards left', {
            fontSize: '64px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(10000);

        this.scene.time.delayedCall(3000, () => {
            GameProgress.clear();
            this.scene.scene.start('MapScene');
        });

        return true;
    }
}
