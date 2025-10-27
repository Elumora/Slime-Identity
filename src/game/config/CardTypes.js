export const CARD_TYPES = {
    ATTACK: 'attack',        // Viscous Strike, Acid Projection, Gelatinous Rush
    DEFENSE: 'defense',      // Hardening, Wall
    BUFF: 'buff',            // Mana Absorption, Controlled Division
    CONTROL: 'control',      // Slowness
    TECHNIQUE: 'technique',  // Fluid Cycle, Assimilation
    SUSTAIN: 'sustain'       // Viscous Transfusion
};

export const TARGET_TYPES = {
    ENEMY: 'enemy',          // Most attacks and debuffs
    SELF: 'self',            // Buffs, defense, sustain
    ALL_ENEMIES: 'all_enemies', // Useful for AoE cards)
    NONE: 'none'             // Cards like Fluid Cycle (draw/discard only)
};

export const AREA_TYPES = {
    SINGLE: 'single',
    AOE: 'aoe'
};