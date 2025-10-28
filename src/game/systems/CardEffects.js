import { CARD_TYPES, TARGET_TYPES, AREA_TYPES } from '../config/CardTypes';

export class CardEffects {
    static execute(card, scene, target = null) {
        const { type, value, effects, targetType, areaType } = card.cardData;
        const isAOE = areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES;

        if (value && (type === CARD_TYPES.ATTACK || type === CARD_TYPES.SUSTAIN)) {
            this.executeDamage(card, scene, target, value, isAOE);
        }

        if (effects && effects.length > 0) {
            effects.forEach(effect => this.executeEffect(effect, card, scene, target));
        }

        scene.removeCardFromHand(card);
        card.destroy();
    }

    static executeDamage(card, scene, target, value, isAOE) {
        let damage = value;
        if (scene.player.buffs && scene.player.buffs.attack) {
            damage += scene.player.buffs.attack.value;
        }

        if (isAOE) {
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
                        enemy.takeDamage(damage);
                        scene.showCardEffect(`-${damage}`, enemy.x, enemy.y - 50);
                    });
                }
            });
        } else if (target) {
            scene.tweens.add({
                targets: card,
                x: target.x,
                y: target.y,
                scale: 0.3,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    scene.playAttackEffect(target.x, target.y);
                    target.takeDamage(damage);
                    scene.showCardEffect(`-${damage}`, target.x, target.y - 50);
                }
            });
        }
    }

    static executeEffect(effect, card, scene, target) {
        const centerX = scene.cameras.main.centerX;
        
        switch (effect.type) {
            case 'fragile':
                if (target && target.addDebuff) {
                    target.addDebuff('fragile', effect.stacks || 1, effect.duration || 1);
                    scene.showCardEffect('Fragile', target.x, target.y - 50);
                }
                break;
            case 'blockTemporary':
                scene.playPlayerEffect(scene.player);
                scene.player.addShield(effect.value);
                scene.showCardEffect(`+${effect.value} Bloc`, scene.player.x, scene.player.y - 50);
                break;
            case 'blockPersistent':
                scene.playPlayerEffect(scene.player);
                if (!scene.player.persistentBlock) scene.player.persistentBlock = 0;
                scene.player.persistentBlock += effect.value;
                scene.showCardEffect(`+${effect.value} Bloc Persistant`, scene.player.x, scene.player.y - 50);
                break;
            case 'blockIncrement':
                scene.playPlayerEffect(scene.player);
                if (!scene.player.blockIncrement) scene.player.blockIncrement = { value: 0, cap: effect.cap };
                if (scene.player.blockIncrement.value < effect.cap) {
                    scene.player.blockIncrement.value += effect.value;
                    scene.showCardEffect(`+${effect.value} Bloc/Tour`, scene.player.x, scene.player.y - 50);
                }
                break;
            case 'fatigue':
                for (let i = 0; i < effect.value; i++) {
                    scene.addCardToHand({ name: 'Fatigue', type: CARD_TYPES.STATUS, cost: 0, effects: [{ type: 'unplayable' }] });
                }
                scene.showCardEffect('Fatigue ajoutée', centerX, 150);
                break;
            case 'duplicate':
                scene.player.nextAttackDuplicated = true;
                scene.showCardEffect('Prochaine attaque x2', scene.player.x, scene.player.y - 50);
                break;
            case 'manaTemporary':
                scene.mana += effect.value;
                scene.updateManaDisplay();
                scene.showCardEffect(`+${effect.value} Mana`, centerX, 150);
                break;
            case 'manaPermanent':
                scene.maxMana += effect.value;
                scene.mana += effect.value;
                scene.updateManaDisplay();
                scene.showCardEffect(`+${effect.value} Mana Max`, centerX, 150);
                break;
            case 'slow':
                if (target && target.addDebuff) {
                    target.addDebuff('slow', effect.stacks || 1, 1);
                    scene.showCardEffect('Ralenti', target.x, target.y - 50);
                }
                break;
            case 'draw':
                scene.drawCards(effect.value);
                scene.showCardEffect(`Pioche ${effect.value}`, centerX, 150);
                break;
            case 'discard':
                scene.discardCards(effect.value);
                scene.showCardEffect(`Défausse ${effect.value}`, centerX, 150);
                break;
            case 'blockOnDiscard':
                scene.player.blockOnDiscard = effect.value;
                break;
            case 'copyLastPlayed':
                if (scene.lastPlayedCard) {
                    const copy = { ...scene.lastPlayedCard, cost: scene.lastPlayedCard.cost + effect.costIncrease, ephemeral: effect.ephemeral };
                    scene.addCardToHand(copy);
                    scene.showCardEffect('Carte copiée', centerX, 150);
                }
                break;
            case 'heal':
                scene.playPlayerEffect(scene.player);
                scene.player.heal(effect.value);
                scene.showCardEffect(`+${effect.value} PV`, scene.player.x, scene.player.y - 50);
                break;
            case 'drawIfFirst':
                if (scene.cardsPlayedThisTurn === 0) {
                    scene.drawCards(effect.value);
                    scene.showCardEffect(`Pioche ${effect.value}`, centerX, 150);
                }
                break;
            case 'unplayable':
                break;
        }
    }
}
