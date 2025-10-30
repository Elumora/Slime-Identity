export const PATTERN_ACTIONS = {
    ATTACK: 'attack',
    CHARGE: 'charge',
    BLOCK: 'block',
    DODGE: 'dodge',
    SPECIAL: 'special'
}

export const ATTACK_PATTERNS = {
    basic: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },
    
    charger: {
        pattern: [
            { action: PATTERN_ACTIONS.CHARGE, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 2 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },
    
    defensive: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 },
            { action: PATTERN_ACTIONS.BLOCK, value: 5 },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 1 }
        ]
    },
    
    agile: {
        pattern: [
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 0.8 },
            { action: PATTERN_ACTIONS.DODGE },
            { action: PATTERN_ACTIONS.ATTACK, multiplier: 0.8 }
        ]
    }
}
