import { CARD_TYPES, TARGET_TYPES, AREA_TYPES } from '../config/CardTypes';

export class CardEffects {
    static execute(card, scene, target = null) {
        const { type, effect } = card.cardData;

        switch (type) {
            case CARD_TYPES.ATTACK:
                return this.executeAttack(card, scene, target);
            case CARD_TYPES.DEFENSE:
                return this.executeDefense(card, scene);
            case CARD_TYPES.HEAL:
                return this.executeHeal(card, scene);
            case CARD_TYPES.BUFF:
                return this.executeBuff(card, scene);
            case CARD_TYPES.DEBUFF:
                return this.executeDebuff(card, scene, target);
            case CARD_TYPES.SPECIAL:
                return this.executeSpecial(card, scene, effect);
        }
    }

    static executeAttack(card, scene, target) {
        let { value, areaType, targetType } = card.cardData;
        
        if (scene.player.buffs.attack) {
            value += scene.player.buffs.attack.value;
        }
        
        if (areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES) {
            const centerX = scene.cameras.main.centerX;
            const centerY = scene.cameras.main.centerY;
            scene.tweens.add({
                targets: card,
                x: centerX,
                y: centerY,
                scale: 0.3,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    scene.enemies.filter(e => e.active).forEach(enemy => {
                        scene.playAttackEffect(enemy.x, enemy.y);
                        enemy.takeDamage(value);
                        scene.showCardEffect(`-${value}`, enemy.x, enemy.y - 50);
                    });
                    scene.removeCardFromHand(card);
                    card.destroy();
                }
            });
        } else {
            scene.tweens.add({
                targets: card,
                x: target.x,
                y: target.y,
                scale: 0.3,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    scene.playAttackEffect(target.x, target.y);
                    target.takeDamage(value);
                    scene.showCardEffect(`-${value}`, target.x, target.y - 50);
                    scene.removeCardFromHand(card);
                    card.destroy();
                }
            });
        }
    }

    static executeDefense(card, scene) {
        const shield = card.cardData.value;
        scene.playPlayerEffect(scene.player);
        
        if (card.cardData.name === "Guardian's Oath") {
            scene.player.addBuff('defense', 3, 3);
            scene.showCardEffect('+3 Defense (3 turns)', scene.player.x, scene.player.y - 50);
        } else if (card.cardData.name === 'Wind Parry') {
            scene.player.addBuff('evasion', 1, 1);
            scene.showCardEffect('Evade Next Attack', scene.player.x, scene.player.y - 50);
        } else {
            scene.player.addShield(shield);
            scene.showCardEffect(`+${shield} Shield`, scene.player.x, scene.player.y - 50);
        }
        
        scene.removeCardFromHand(card);
        card.destroy();
    }

    static executeHeal(card, scene) {
        const heal = card.cardData.value;
        scene.playPlayerEffect(scene.player);
        scene.player.heal(heal);
        scene.showCardEffect(`+${heal} HP`, scene.player.x, scene.player.y - 50);
        scene.removeCardFromHand(card);
        card.destroy();
    }

    static executeBuff(card, scene) {
        const { buffType, value, duration } = card.cardData;
        scene.playPlayerEffect(scene.player);
        
        if (buffType === 'random') {
            const randomBuffs = [
                { type: 'attack', value: 5, text: '+5 Attack' },
                { type: 'defense', value: 5, text: '+5 Defense' },
                { type: 'heal', value: 8, text: '+8 HP' },
                { type: 'shield', value: 6, text: '+6 Shield' }
            ];
            const chosen = randomBuffs[Math.floor(Math.random() * randomBuffs.length)];
            
            if (chosen.type === 'heal') {
                scene.player.heal(chosen.value);
            } else if (chosen.type === 'shield') {
                scene.player.addShield(chosen.value);
            } else {
                scene.player.addBuff(chosen.type, chosen.value, duration);
            }
            scene.showCardEffect(chosen.text, scene.player.x, scene.player.y - 50);
        } else {
            scene.player.addBuff(buffType, value, duration);
            scene.showCardEffect(`+${value} ${buffType}`, scene.player.x, scene.player.y - 50);
        }
        
        scene.removeCardFromHand(card);
        card.destroy();
    }

    static executeDebuff(card, scene, target) {
        const { debuffType, value, duration } = card.cardData;
        scene.tweens.add({
            targets: card,
            x: target.x,
            y: target.y,
            scale: 0.3,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                target.addDebuff(debuffType, value, duration);
                scene.showCardEffect(`${debuffType}`, target.x, target.y - 50);
                scene.removeCardFromHand(card);
                card.destroy();
            }
        });
    }

    static executeSpecial(card, scene, effect) {
        const centerX = scene.cameras.main.centerX;
        scene.playPlayerEffect(scene.player);
        switch (effect) {
            case 'skipEnemyTurn':
                scene.skipNextEnemyTurn = true;
                scene.showCardEffect('Enemy Turn Skipped', centerX, 150);
                break;
            case 'drawOne':
                scene.drawCards(1);
                scene.showCardEffect('Draw 1 Card', centerX, 150);
                break;
            case 'drawTwo':
                scene.drawCards(2);
                scene.showCardEffect('Draw 2 Cards', centerX, 150);
                break;
            case 'recoverFromDiscard':
                scene.recoverFromDiscard();
                scene.showCardEffect('Card Recovered', centerX, 150);
                break;
            case 'gainMana':
                scene.mana += card.cardData.value;
                if (scene.mana > scene.maxMana + 5) scene.mana = scene.maxMana + 5;
                scene.updateManaDisplay();
                scene.showCardEffect(`+${card.cardData.value} Mana`, centerX, 150);
                break;
            case 'sacrificeForCards':
                scene.player.takeDamage(card.cardData.hpCost);
                scene.drawCards(3);
                scene.showCardEffect('-5 HP, Draw 3 Cards', centerX, 150);
                break;
            case 'playFirst':
                scene.playFirst = true;
                scene.showCardEffect('Play First Next Turn', centerX, 150);
                break;
        }
        scene.removeCardFromHand(card);
        card.destroy();
    }

    static getDescription(cardData) {
        const { type, value, effect, buffType, debuffType, hpCost, areaType, targetType, duration } = cardData;
        const isAOE = areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES;

        switch (type) {
            case CARD_TYPES.ATTACK:
                return isAOE ? `Deal ${value} damage to all enemies` : `Deal ${value} damage`;
            case CARD_TYPES.DEFENSE:
                if (cardData.name === "Guardian's Oath") return 'Gain +3 defense for 3 turns';
                if (cardData.name === 'Wind Parry') return 'Evade next attack';
                if (value === 0) return 'Special defense effect';
                return `Gain ${value} shield`;
            case CARD_TYPES.HEAL:
                return `Heal ${value} HP`;
            case CARD_TYPES.BUFF:
                if (buffType === 'random') return 'Random bonus effect';
                return `Gain +${value} ${buffType} for ${duration} turn(s)`;
            case CARD_TYPES.DEBUFF:
                if (debuffType === 'skip') return 'Enemy skips turn';
                if (debuffType === 'silence') return 'Silence enemy';
                if (debuffType === 'slow') return 'Enemy acts last';
                return `Apply -${value} ${debuffType} for ${duration} turn(s)`;
            case CARD_TYPES.SPECIAL:
                return this.getSpecialDescription(effect, value, hpCost);
        }
    }

    static getSpecialDescription(effect, value, hpCost) {
        switch (effect) {
            case 'skipEnemyTurn':
                return 'Skip enemy turn';
            case 'drawOne':
                return 'Draw 1 card';
            case 'drawTwo':
                return 'Draw 2 cards';
            case 'recoverFromDiscard':
                return 'Recover card from discard';
            case 'gainMana':
                return `Gain ${value} mana`;
            case 'sacrificeForCards':
                return `Lose ${hpCost} HP, draw 3 cards`;
            case 'playFirst':
                return 'Play first next turn';
            default:
                return '';
        }
    }
}
