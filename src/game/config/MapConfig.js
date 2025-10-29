export const MapConfig = {
    totalElements: 15,
    
    // Pourcentages de répartition (doivent totaliser 100%)
    distribution: {
        monsters: 80,  // %
        coins: 10,     // %
        chests: 5,     // %
        shops: 5       // %
    },
    
    // Configuration du miniboss
    miniboss: {
        minOffsetFromEnd: 3,  // Minimum 3 positions avant la fin
        maxOffsetFromEnd: 5   // Maximum 5 positions avant la fin
    }
};
