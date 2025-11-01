export const PATTERN_ACTIONS = {
    ATTACK: 'attack',
    CHARGE: 'charge',
    BLOCK: 'block',
    DODGE: 'dodge',
    SUMMON: 'summon'
}

export const ATTACK_PATTERNS = {
    archer: {
        pattern: [
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.DODGE }
        ]
    },

    brute: {
        pattern: [
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },

    firemage: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.BLOCK, value: 5 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },

    skelettonarcher: {
        pattern: [
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.DODGE },
            { action: PATTERN_ACTIONS.SUMMON, summonType: 'skeletonwarrior' },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },

    thief: {
        pattern: [
            { action: PATTERN_ACTIONS.DODGE },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 0.8 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
        ]
    },

    sentinellegivre: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.BLOCK, value: 8 },
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 1.5 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1.5 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },

    corruptedgolem: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 2 },
            { action: PATTERN_ACTIONS.BLOCK, value: 10 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.DODGE },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },

    skeletonwarrior: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    }
}
