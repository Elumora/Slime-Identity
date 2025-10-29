import { MapConfig } from '../config/MapConfig';

export const mapData = {
    gridWidth: 6,
    gridHeight: 50,

    backgroundTiles: [
        // 0, 1, 2, 3, 4, 5
        ['waterClean', 'tallGrass', 'grassMiddle', 'tallGrass', 'waterClean', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['tallGrass', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['grassMiddle', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'waterClean'],
        ['waterClean', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddleInner', 'grassMiddle'],
        ['waterClean', 'tallGrass', 'grassMiddle', 'tallGrass', 'waterClean', 'grassMiddle']
    ],

    path: [
        { x: 5, y: 49, tile: 'start' },
        { x: 4, y: 49, tile: 'straightLeft' },
        { x: 3, y: 49, tile: 'straightLeft' },
        { x: 2, y: 49, tile: 'turnRight' },
        { x: 2, y: 48, tile: 'straightRight' },
        { x: 2, y: 47, tile: 'straightRight' },
        { x: 2, y: 46, tile: 'straightRight' },
        { x: 2, y: 45, tile: 'turnLeftToRight' },
        { x: 3, y: 45, tile: 'straightLeft' },
        { x: 4, y: 45, tile: 'turnLeftToUp' },
        { x: 4, y: 44, tile: 'straightRight' },
        { x: 4, y: 43, tile: 'straightRight' },
        { x: 4, y: 42, tile: 'turnLeft' },
        { x: 3, y: 42, tile: 'straightLeft' },
        { x: 2, y: 42, tile: 'straightLeft' },
        { x: 1, y: 42, tile: 'straightLeft' },
        { x: 0, y: 42, tile: 'turnRight' },
        { x: 0, y: 41, tile: 'straightRight' },
        { x: 0, y: 40, tile: 'straightRight' },
        { x: 0, y: 39, tile: 'straightRight' },
        { x: 0, y: 38, tile: 'straightRight' },
        { x: 0, y: 37, tile: 'straightRight' },
        { x: 0, y: 36, tile: 'turnLeftToRight' },
        { x: 1, y: 36, tile: 'straightLeft' },
        { x: 2, y: 36, tile: 'straightLeft' },
        { x: 3, y: 36, tile: 'straightLeft' },
        { x: 4, y: 36, tile: 'turnLeftToUp' },
        { x: 4, y: 35, tile: 'straightRight' },
        { x: 4, y: 34, tile: 'straightRight' },
        { x: 4, y: 33, tile: 'turnLeft' },
        { x: 3, y: 33, tile: 'straightLeft' },
        { x: 2, y: 33, tile: 'straightLeft' },
        { x: 1, y: 33, tile: 'turnRight' },
        { x: 1, y: 32, tile: 'straightRight' },
        { x: 1, y: 31, tile: 'straightRight' },
        { x: 1, y: 30, tile: 'turnLeft' },
        { x: 0, y: 30, tile: 'turnRight' },
        { x: 0, y: 29, tile: 'straightRight' },
        { x: 0, y: 28, tile: 'straightRight' },
        { x: 0, y: 27, tile: 'straightRight' },
        { x: 0, y: 26, tile: 'straightRight' },
        { x: 0, y: 25, tile: 'straightRight' },
        { x: 0, y: 24, tile: 'turnLeftToRight' },
        { x: 1, y: 24, tile: 'straightLeft' },
        { x: 2, y: 24, tile: 'straightLeft' },
        { x: 3, y: 24, tile: 'straightLeft' },
        { x: 4, y: 24, tile: 'turnLeftToUp' },
        { x: 4, y: 23, tile: 'straightRight' },
        { x: 4, y: 22, tile: 'straightRight' },
        { x: 4, y: 21, tile: 'straightRight' },
        { x: 4, y: 20, tile: 'turnLeft' },
        { x: 3, y: 20, tile: 'straightLeft' },
        { x: 2, y: 20, tile: 'straightLeft' },
        { x: 1, y: 20, tile: 'straightLeft' },
        { x: 0, y: 20, tile: 'turnRight' },
        { x: 0, y: 19, tile: 'straightRight' },
        { x: 0, y: 18, tile: 'straightRight' },
        { x: 0, y: 17, tile: 'turnLeftToRight' },
        { x: 1, y: 17, tile: 'straightLeft' },
        { x: 2, y: 17, tile: 'straightLeft' },
        { x: 3, y: 17, tile: 'turnLeftToUp' },
        { x: 3, y: 16, tile: 'straightRight' },
        { x: 3, y: 15, tile: 'straightRight' },
        { x: 3, y: 14, tile: 'turnLeft' },
        { x: 2, y: 14, tile: 'straightLeft' },
        { x: 1, y: 14, tile: 'straightLeft' },
        { x: 0, y: 14, tile: 'turnRight' },
        { x: 0, y: 13, tile: 'straightRight' },
        { x: 0, y: 12, tile: 'straightRight' },
        { x: 0, y: 11, tile: 'straightRight' },
        { x: 0, y: 10, tile: 'turnLeftToRight' },
        { x: 1, y: 10, tile: 'straightLeft' },
        { x: 2, y: 10, tile: 'straightLeft' },
        { x: 3, y: 10, tile: 'straightLeft' },
        { x: 4, y: 10, tile: 'turnLeftToUp' },
        { x: 4, y: 9, tile: 'straightRight' },
        { x: 4, y: 8, tile: 'straightRight' },
        { x: 4, y: 7, tile: 'straightRight' },
        { x: 4, y: 6, tile: 'turnLeft' },
        { x: 3, y: 6, tile: 'straightLeft' },
        { x: 2, y: 6, tile: 'straightLeft' },
        { x: 1, y: 6, tile: 'straightLeft' },
        { x: 0, y: 6, tile: 'turnRight' },
        { x: 0, y: 5, tile: 'straightRight' },
        { x: 0, y: 4, tile: 'straightRight' },
        { x: 0, y: 3, tile: 'straightRight' },
        { x: 0, y: 2, tile: 'turnLeftToRight' },
        { x: 1, y: 2, tile: 'straightLeft' },
        { x: 2, y: 2, tile: 'straightLeft' },
        { x: 3, y: 2, tile: 'straightLeft' },
        { x: 4, y: 2, tile: 'turnLeftToUp' },
        { x: 4, y: 1, tile: 'straightRight' },
        { x: 4, y: 0, tile: 'straightRight' }
    ],

    tiles: {
        grass: ['grass1', 'grass2', 'grass3'],
        forest: ['forest1', 'forest2', 'forest3'],
        mountain: ['mountain1', 'mountain2']
    },

    objects: [
        { x: 1, y: 1, texture: 'arrowBoard' },
        { x: 3, y: 3, texture: 'stoneGrass' },
        { x: 5, y: 5, texture: 'stoneWater' },
        { x: 2, y: 7, texture: 'arrowBoard' },
        { x: 3, y: 9, texture: 'stoneGrass' },
        { x: 5, y: 8, texture: 'stoneWater' },
        { x: 5, y: 11, texture: 'stoneWater' },
        { x: 2, y: 13, texture: 'arrowBoard' },
        { x: 5, y: 14, texture: 'stoneWater' },
        { x: 2, y: 16, texture: 'stoneGrass' },
        { x: 1, y: 18, texture: 'arrowBoard' },
        { x: 5, y: 20, texture: 'stoneWater' },
        { x: 2, y: 23, texture: 'arrowBoard' },
        { x: 5, y: 26, texture: 'stoneWater' },
        { x: 4, y: 27, texture: 'stoneGrass' },
        { x: 3, y: 28, texture: 'stoneGrass' },
        { x: 5, y: 32, texture: 'stoneWater' },
        { x: 3, y: 35, texture: 'arrowBoard' },
        { x: 5, y: 38, texture: 'stoneWater' },
        { x: 2, y: 39, texture: 'arrowBoard' },
        { x: 4, y: 41, texture: 'stoneGrass' },
        { x: 3, y: 43, texture: 'stoneGrass' },
        { x: 5, y: 44, texture: 'stoneWater' },
        { x: 2, y: 47, texture: 'arrowBoard' },
        { x: 4, y: 48, texture: 'stoneGrass' },
        { x: 3, y: 49, texture: 'coin' }
    ],

    monsters: [],
    coins: [],
    chests: [],
    shops: []
};

function generateMapElements(path) {
    const enemies = [
        'plent', 'archer', 'black_werewolf', 'fighter', 'fire_spirit',
        'karasu_tengu', 'kitsune', 'red_werewolf', 'samurai', 'shinobi',
        'skeleton', 'swordsman', 'white_werewolf', 'wizard', 'yamabushi_tengu'
    ];
    
    const pathLength = path.length;
    const totalElements = MapConfig.totalElements;
    const monsters = [];
    const coins = [];
    const chests = [];
    const shops = [];
    
    // Boss à la fin
    const bossPos = path[pathLength - 1];
    const bossEnemyType = enemies[Math.floor(Math.random() * enemies.length)];
    monsters.push({
        x: bossPos.x,
        y: bossPos.y,
        texture: 'boss',
        enemies: [{ sprite: bossEnemyType, health: 100, attack: 20 }]
    });
    
    // Miniboss au milieu de la map
    const usedIndices = [0, pathLength - 1];
    const middleStart = Math.floor(pathLength * 0.4);
    const middleEnd = Math.floor(pathLength * 0.6);
    
    for (let i = 0; i < MapConfig.miniboss.count; i++) {
        let minibossIndex;
        do {
            minibossIndex = Math.floor(Math.random() * (middleEnd - middleStart)) + middleStart;
        } while (usedIndices.includes(minibossIndex));
        
        usedIndices.push(minibossIndex);
        const minibossPos = path[minibossIndex];
        const minibossEnemyType = enemies[Math.floor(Math.random() * enemies.length)];
        monsters.push({
            x: minibossPos.x,
            y: minibossPos.y,
            texture: 'miniboss',
            enemies: [{ sprite: minibossEnemyType, health: 60, attack: 15 }]
        });
    }
    
    // Positions disponibles (exclure début, boss et miniboss)
    const availableIndices = [];
    for (let i = 3; i < pathLength - 3; i++) {
        if (!usedIndices.includes(i)) availableIndices.push(i);
    }
    
    // Mélanger les positions
    for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }
    
    // Répartition selon configuration
    const remainingElements = totalElements - 1 - MapConfig.miniboss.count;
    const numMonsters = Math.round(remainingElements * MapConfig.distribution.monsters / 100);
    const numCoins = Math.round(remainingElements * MapConfig.distribution.coins / 100);
    const numChests = Math.floor(remainingElements * MapConfig.distribution.chests / 100);
    const numShops = remainingElements - numMonsters - numCoins - numChests;
    
    // Créer un tableau d'éléments avec leurs types
    const elements = [];
    for (let i = 0; i < numMonsters; i++) elements.push('monster');
    for (let i = 0; i < numCoins; i++) elements.push('coin');
    for (let i = 0; i < numChests; i++) elements.push('chest');
    for (let i = 0; i < numShops; i++) elements.push('shop');
    
    // Mélanger les éléments
    for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }
    
    // Placer les éléments en évitant deux shops consécutifs
    let idx = 0;
    let lastWasShop = false;
    
    for (let i = 0; i < elements.length && idx < availableIndices.length; i++) {
        const elementType = elements[i];
        
        // Si c'est un shop et que le dernier était un shop, on cherche un autre élément
        if (elementType === 'shop' && lastWasShop) {
            // Trouver le prochain élément qui n'est pas un shop
            let swapIdx = i + 1;
            while (swapIdx < elements.length && elements[swapIdx] === 'shop') {
                swapIdx++;
            }
            if (swapIdx < elements.length) {
                [elements[i], elements[swapIdx]] = [elements[swapIdx], elements[i]];
            }
        }
        
        const pos = path[availableIndices[idx]];
        const progress = availableIndices[idx] / pathLength;
        
        if (elements[i] === 'monster') {
            const enemyType = enemies[Math.floor(Math.random() * enemies.length)];
            monsters.push({
                x: pos.x,
                y: pos.y,
                texture: 'monster',
                enemies: [{
                    sprite: enemyType,
                    health: 15 + Math.floor(progress * 30),
                    attack: 5 + Math.floor(progress * 8)
                }]
            });
            lastWasShop = false;
        } else if (elements[i] === 'coin') {
            coins.push({ x: pos.x, y: pos.y });
            lastWasShop = false;
        } else if (elements[i] === 'chest') {
            chests.push({ x: pos.x, y: pos.y });
            lastWasShop = false;
        } else if (elements[i] === 'shop') {
            shops.push({ x: pos.x, y: pos.y });
            lastWasShop = true;
        }
        
        idx++;
    }
    
    return { monsters, coins, chests, shops };
}

const MAP_VERSION = 4;

export function generateMap() {
    const { monsters, coins, chests, shops } = generateMapElements(mapData.path);
    
    const generatedMap = {
        monsters,
        coins,
        chests,
        shops,
        version: MAP_VERSION,
        timestamp: Date.now()
    };
    
    localStorage.setItem('generatedMap', JSON.stringify(generatedMap));
    return generatedMap;
}

export function loadMap() {
    const saved = localStorage.getItem('generatedMap');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version === MAP_VERSION) {
            return parsed;
        }
    }
    return generateMap();
}

const loadedMap = loadMap();
mapData.monsters = loadedMap.monsters;
mapData.coins = loadedMap.coins;
mapData.chests = loadedMap.chests || [];
mapData.shops = loadedMap.shops || [];
