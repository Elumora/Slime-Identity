export const ENEMY_DATABASE = {
    // Ennemis normaux
    archer: {
        sprite: 'archer',
        health: 18,
        attack: 5,
        type: 'normal'
    },
    brute: {
        sprite: 'brute',
        health: 25,
        attack: 7,
        type: 'normal'
    },
    firemage: {
        sprite: 'firemage',
        health: 15,
        attack: 6,
        type: 'normal'
    },
    skelettonarcher: {
        sprite: 'skelettonarcher',
        health: 12,
        attack: 4,
        type: 'normal'
    },
    thief: {
        sprite: 'thief',
        health: 14,
        attack: 5,
        type: 'normal'
    },
    
    // Mini-boss
    sentinellegivre: {
        sprite: 'sentinellegivre',
        health: 40,
        attack: 10,
        type: 'miniboss'
    },
    
    // Boss
    corruptedgolem: {
        sprite: 'corruptedgolem',
        health: 80,
        attack: 15,
        type: 'boss'
    },
    
    // Invocation
    skeletonwarrior: {
        sprite: 'skeletonwarrior',
        health: 10,
        attack: 3,
        type: 'summon'
    }
};

export function getRandomNormalEnemy() {
    const normalEnemies = Object.keys(ENEMY_DATABASE).filter(
        key => ENEMY_DATABASE[key].type === 'normal'
    );
    const randomKey = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
    return { ...ENEMY_DATABASE[randomKey] };
}

export function getMiniboss() {
    return { ...ENEMY_DATABASE.sentinellegivre };
}

export function getBoss() {
    return { ...ENEMY_DATABASE.corruptedgolem };
}
