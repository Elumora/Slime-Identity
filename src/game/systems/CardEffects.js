import { CARD_TYPES, TARGET_TYPES, AREA_TYPES } from '../config/CardTypes';
import { CARD_DATABASE } from '../config/CardDatabase';
import { Card } from '../entities/Card';

export class CardEffects {
    static execute(card, scene, target = null) {
        const { type, value, effects, targetType, areaType } = card.cardData;
        const isAOE = areaType === AREA_TYPES.AOE || targetType === TARGET_TYPES.ALL_ENEMIES;

        if (scene.lastPlayedCard !== undefined && card.cardData.name !== 'Fatigue') {
            scene.lastPlayedCard = card.cardData;
        }
        if (scene.cardsPlayedThisTurn !== undefined) {
            scene.cardsPlayedThisTurn++;
        }

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

        let multiplier = 1;
        if (scene.nextAttackDuplicated) {
            multiplier = 2;
            scene.nextAttackDuplicated = false;
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
                        let finalDamage = damage * multiplier;
                        if (enemy.debuffs.fragile) {
                            finalDamage = Math.floor(finalDamage * 1.25);
                        }
                        enemy.takeDamage(finalDamage);
                        scene.showCardEffect(`-${finalDamage}`, enemy.x, enemy.y - 50);
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
                    let finalDamage = damage * multiplier;
                    if (target.debuffs && target.debuffs.fragile) {
                        finalDamage = Math.floor(finalDamage * 1.25);
                    }
                    target.takeDamage(finalDamage);
                    scene.showCardEffect(`-${finalDamage}`, target.x, target.y - 50);
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
                    target.updateHealthBar();
                }
                break;
            case 'blockTemporary':
                scene.playPlayerEffect(scene.player);
                if (!scene.player.temporaryShield) scene.player.temporaryShield = 0;
                scene.player.temporaryShield += effect.value;
                scene.player.updateHealthBar();
                scene.showCardEffect(`+${effect.value} Bloc`, scene.player.x, scene.player.y - 50);
                break;
            case 'blockPersistent':
                scene.playPlayerEffect(scene.player);
                if (!scene.player.persistentBlock) scene.player.persistentBlock = 0;
                scene.player.persistentBlock += effect.value;
                scene.player.updateHealthBar();
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
                const fatigueCard = CARD_DATABASE.find(c => c.name === 'Fatigue');
                if (fatigueCard) {
                    for (let i = 0; i < effect.value; i++) {
                        const numCards = scene.hand.length;
                        const { x, y, rotation } = this.getCardPosition(numCards, numCards + 1, scene);
                        const depth = numCards + 1;
                        const newCard = new Card(scene, 960, 350, fatigueCard);
                        newCard.setAlpha(0);
                        newCard.setScale(0.25);
                        newCard.setDepth(depth);
                        newCard.homeRotation = rotation;
                        newCard.homeDepth = depth;
                        newCard.setHomePosition(x, y, rotation, depth);
                        scene.hand.push(newCard);
                        scene.tweens.add({
                            targets: newCard,
                            x: x,
                            y: y,
                            rotation: rotation,
                            scale: 1,
                            alpha: 1,
                            duration: 300,
                            ease: 'Back.easeOut'
                        });
                    }
                }
                scene.showCardEffect('Fatigue ajoutée', centerX, 150);
                break;
            case 'duplicate':
                if (!scene.nextAttackDuplicated) scene.nextAttackDuplicated = false;
                scene.nextAttackDuplicated = true;
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
                    target.addDebuff('slow', 0.25, 1);
                    scene.showCardEffect('Ralenti -25%', target.x, target.y - 50);
                    target.updateHealthBar();
                }
                break;
            case 'draw':
                scene.drawCards(effect.value);
                scene.showCardEffect(`Pioche ${effect.value}`, centerX, 150);
                break;
            case 'discard':
                this.discardInteractive(scene, effect.value);
                break;
            case 'blockOnDiscard':
                scene.player.blockOnDiscard = effect.value;
                break;
            case 'copyLastPlayed':
                if (scene.lastPlayedCard) {
                    const originalCard = CARD_DATABASE.find(c => c.name === scene.lastPlayedCard.name);
                    if (originalCard) {
                        const copy = { ...originalCard, cost: originalCard.cost + effect.costIncrease };
                        const numCards = scene.hand.length;
                        const { x, y, rotation } = this.getCardPosition(numCards, numCards + 1, scene);
                        const depth = numCards + 1;
                        const newCard = new Card(scene, 960, 350, copy);
                        newCard.setAlpha(0);
                        newCard.setScale(0.25);
                        newCard.setDepth(depth);
                        newCard.homeRotation = rotation;
                        newCard.homeDepth = depth;
                        newCard.setHomePosition(x, y, rotation, depth);
                        scene.hand.push(newCard);
                        scene.tweens.add({
                            targets: newCard,
                            x: x,
                            y: y,
                            rotation: rotation,
                            scale: 1,
                            alpha: 1,
                            duration: 300,
                            ease: 'Back.easeOut'
                        });
                        scene.showCardEffect('Carte copiée', centerX, 150);
                    }
                }
                break;
            case 'heal':
                scene.playPlayerEffect(scene.player);
                scene.player.heal(effect.value);
                scene.showCardEffect(`+${effect.value} PV`, scene.player.x, scene.player.y - 50);
                break;
            case 'drawIfFirst':
                if (scene.cardsPlayedThisTurn === 1) {
                    scene.drawCards(effect.value);
                    scene.showCardEffect(`Pioche ${effect.value}`, centerX, 150);
                }
                break;
            case 'unplayable':
                break;
        }
    }

    static discardInteractive(scene, count) {
        if (scene.hand.length === 0) return;
        
        scene.discardMode = true;
        scene.discardCount = count;
        scene.discardedCards = 0;
        
        scene.showCardEffect(`Cliquez ${count} carte(s) à défausser`, scene.cameras.main.centerX, 150);
        
        scene.hand.forEach(card => {
            card.discardHighlight = scene.add.rectangle(0, 0, card.width, card.height, 0xffff00, 0.3);
            card.add(card.discardHighlight);
            card.discardHighlight.setVisible(true);
        });
    }

    static getCardPosition(i, numCards, scene) {
        const splinePoints = [
            { x: 560, y: 1080 },
            { x: 940, y: 1000 },
            { x: 1500, y: 1080 }
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
}
