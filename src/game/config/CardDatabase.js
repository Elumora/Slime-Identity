import { AREA_TYPES, CARD_TYPES, TARGET_TYPES } from './CardTypes';

export const RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

export const CARD_DATABASE = [
    {
        name: 'Frappe Visqueuse',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 6,
        cost: 1,
        rarity: RARITY.COMMON,
        icon: 'viscousstrike'
    },
    {
        name: 'Projection Acide',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 10,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'acidprojection',
        effects: [{ type: 'fragile', stacks: 1, duration: 1 }]
    },
    {
        name: 'Ruée Gélatineuse',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 4,
        cost: 0,
        rarity: RARITY.COMMON,
        icon: 'gelatinousrush',
        effects: [{ type: 'drawIfFirst', value: 1 }]
    },
    {
        name: 'Durcissement',
        type: CARD_TYPES.DEFENSE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'hardening',
        effects: [{ type: 'blockTemporary', value: 10 }, { type: 'blockIncrement', value: 1, cap: 5 }]
    },
    {
        name: 'Armure molle',
        type: CARD_TYPES.DEFENSE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.UNCOMMON,
        icon: 'wall',
        effects: [{ type: 'blockTemporary', value: 6 }]
    },
    {
        name: 'Absorption de Mana',
        type: CARD_TYPES.BUFF,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 0,
        rarity: RARITY.UNCOMMON,
        icon: 'manaabsorption',
        effects: [{ type: 'manaTemporary', value: 1 }, { type: 'draw', value: 1 }, { type: 'fatigue', value: 1 }]
    },
    {
        name: 'Division Contrôlée',
        type: CARD_TYPES.BUFF,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.RARE,
        icon: 'controlleddivision',
        effects: [{ type: 'duplicate' }]
    },
    {
        name: 'Limon Entravant',
        type: CARD_TYPES.CONTROL,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.UNCOMMON,
        icon: 'slowness',
        effects: [{ type: 'slow', stacks: 1 }]
    },
    {
        name: 'Cycle des fluides',
        type: CARD_TYPES.TECHNIQUE,
        targetType: TARGET_TYPES.NONE,
        areaType: AREA_TYPES.SINGLE,
        cost: 0,
        rarity: RARITY.COMMON,
        icon: 'fluidcycle',
        effects: [{ type: 'draw', value: 2 }, { type: 'discard', value: 1 }, { type: 'blockOnDiscard', value: 2 }]
    },
    {
        name: 'Assimilation',
        type: CARD_TYPES.TECHNIQUE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.COMMON,
        icon: 'assimilation',
        effects: [{ type: 'copyLastPlayed', costIncrease: 1, ephemeral: true }]
    },
    {
        name: 'Transfusion Visqueuse',
        type: CARD_TYPES.SUSTAIN,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 8,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'viscoustransfusion',
        effects: [{ type: 'heal', value: 4 }]
    },
    {
        name: 'Fatigue',
        type: CARD_TYPES.STATUS,
        targetType: TARGET_TYPES.NONE,
        areaType: AREA_TYPES.SINGLE,
        rarity: RARITY.COMMON,
        icon: 'fatigue',
        effects: [{ type: 'unplayable' }]
    }
];

export function getCardDescription(cardData) {
    const parts = [];

    if (cardData.value) {
        parts.push(`Inflige ${cardData.value} dégâts`);
    }

    if (cardData.effects) {
        cardData.effects.forEach(effect => {
            switch (effect.type) {
                case 'fragile':
                    parts.push(`Applique Fragile (${effect.stacks || 1} cumul)`);
                    break;
                case 'blockTemporary':
                    parts.push(`Bloc ${effect.value} pour ce tour`);
                    break;
                case 'blockPersistent':
                    parts.push(`Bloc persistant ${effect.value}`);
                    break;
                case 'blockIncrement':
                    parts.push(`+${effect.value} bloc persistant par tour (max ${effect.cap})`);
                    break;
                case 'fatigue':
                    parts.push(`Ajoute ${effect.value} Fatigue en main`);
                    break;
                case 'duplicate':
                    parts.push('Duplique la prochaine attaque');
                    break;
                case 'manaTemporary':
                    parts.push(`+${effect.value} mana ce tour`);
                    break;
                case 'manaPermanent':
                    parts.push(`+${effect.value} mana permanent`);
                    break;
                case 'slow':
                    parts.push('Ennemi inflige -25% dégâts ce tour');
                    break;
                case 'draw':
                    parts.push(`Pioche ${effect.value} carte${effect.value > 1 ? 's' : ''}`);
                    break;
                case 'discard':
                    parts.push(`Défausse ${effect.value} carte${effect.value > 1 ? 's' : ''}`);
                    break;
                case 'blockOnDiscard':
                    parts.push(`Gagne ${effect.value} Blocage si défausse`);
                    break;
                case 'copy':
                    parts.push('Copie la dernière carte jouée');
                    break;
                case 'copyLastPlayed':
                    parts.push(`Ajoute en main une copie de la dernière carte jouée (coût +${effect.costIncrease}, éphémère)`);
                    break;
                case 'heal':
                    parts.push(`Soigne ${effect.value} PV`);
                    break;
                case 'drawIfFirst':
                    parts.push(`Si jouée en premier, pioche ${effect.value} carte${effect.value > 1 ? 's' : ''}`);
                    break;
                case 'unplayable':
                    parts.push('Impossible de jouer');
                    break;
            }
        });
    }

    return parts.join('. ') + (parts.length > 0 ? '.' : '');
}