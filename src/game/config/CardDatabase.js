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
        name: 'Viscous Strike',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 6,
        cost: 1,
        rarity: RARITY.COMMON,
        icon: 'viscousstrike'
    },
    {
        name: 'Acid Projection',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 10,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'acidprojection',
        debuffType: 'fragile',
        debuffValue: 1,
        debuffDuration: 1
    },
    {
        name: 'Gelatinous Rush',
        type: CARD_TYPES.ATTACK,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 8,
        cost: 2,
        rarity: RARITY.COMMON,
        icon: 'gelatinousrush',
        block: 2
    },
    {
        name: 'Hardening',
        type: CARD_TYPES.DEFENSE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        value: 10,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'hardening',
        passiveBlockPerTurn: 1,
        passiveBlockCap: 5
    },
    {
        name: 'Wall',
        type: CARD_TYPES.DEFENSE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        value: 10,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'wall',
        passiveBlockPerTurn: 1,
        passiveBlockCap: 5
    },
    {
        name: 'Mana Absorption',
        type: CARD_TYPES.BUFF,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 0,
        rarity: RARITY.UNCOMMON,
        icon: 'manaabsorption',
        effect: 'gainManaDrawFatigue',
        manaGain: 1,
        draw: 1,
        addFatigue: 1
    },
    {
        name: 'Controlled Division',
        type: CARD_TYPES.BUFF,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.RARE,
        icon: 'controlleddivision',
        effect: 'duplicateNextAttack'
    },
    {
        name: 'Slowness',
        type: CARD_TYPES.CONTROL,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'slowness',
        debuffType: 'slow',
        debuffValue: 2,
        debuffDuration: 1
    },
    {
        name: 'Fluid Cycle',
        type: CARD_TYPES.TECHNIQUE,
        targetType: TARGET_TYPES.NONE,
        areaType: AREA_TYPES.SINGLE,
        cost: 0,
        rarity: RARITY.COMMON,
        icon: 'fluidcycle',
        effect: 'drawDiscard',
        draw: 2,
        discard: 2
    },
    {
        name: 'Assimilation',
        type: CARD_TYPES.TECHNIQUE,
        targetType: TARGET_TYPES.SELF,
        areaType: AREA_TYPES.SINGLE,
        cost: 1,
        rarity: RARITY.COMMON,
        icon: 'assimilation',
        manaGain: 1,
        block: 2
    },
    {
        name: 'Viscous Transfusion',
        type: CARD_TYPES.SUSTAIN,
        targetType: TARGET_TYPES.ENEMY,
        areaType: AREA_TYPES.SINGLE,
        value: 4,
        heal: 4,
        cost: 2,
        rarity: RARITY.UNCOMMON,
        icon: 'viscoustransfusion'
    }
];