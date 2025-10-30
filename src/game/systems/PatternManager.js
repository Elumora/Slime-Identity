import { PATTERN_ACTIONS, ATTACK_PATTERNS } from '../config/AttackPatterns'

export class PatternManager {
    static setPattern(enemy, patternName) {
        const pattern = ATTACK_PATTERNS[patternName]
        if (!pattern) return
        
        enemy.attackPattern = pattern.pattern
        enemy.patternIndex = 0
    }

    static getCurrentAction(enemy, turnNumber) {
        if (!enemy.attackPattern) return null
        
        const index = (turnNumber - 1) % enemy.attackPattern.length
        return enemy.attackPattern[index]
    }

    static executePattern(enemy, player, turnNumber) {
        const action = this.getCurrentAction(enemy, turnNumber)
        if (!action) return this.defaultAttack(enemy, player)

        switch (action.action) {
            case PATTERN_ACTIONS.ATTACK:
                return this.executeAttack(enemy, player, action)
            case PATTERN_ACTIONS.CHARGE:
                return this.executeCharge(enemy, action)
            case PATTERN_ACTIONS.BLOCK:
                return this.executeBlock(enemy, action)
            case PATTERN_ACTIONS.DODGE:
                return this.executeDodge(enemy)
            case PATTERN_ACTIONS.SUMMON:
                return this.executeSummon(enemy, action)
            default:
                return this.defaultAttack(enemy, player)
        }
    }

    static executeAttack(enemy, player, action) {
        const multiplier = action.multiplier || 1
        const chargeBonus = enemy.isCharging ? enemy.chargeMultiplier : 1
        const damage = Math.floor(enemy.attackDamage * multiplier * chargeBonus)
        
        enemy.isCharging = false
        enemy.chargeMultiplier = 1
        
        return { type: 'attack', damage, target: player }
    }

    static executeCharge(enemy, action) {
        enemy.isCharging = true
        enemy.chargeMultiplier = action.multiplier || 2
        
        return { type: 'charge', multiplier: enemy.chargeMultiplier }
    }

    static executeBlock(enemy, action) {
        const blockAmount = action.value || 5
        enemy.addTemporaryShield(blockAmount)
        
        return { type: 'block', amount: blockAmount }
    }

    static executeDodge(enemy) {
        enemy.isDodging = true
        
        return { type: 'dodge' }
    }

    static executeSummon(enemy, action) {
        const summonType = action.summonType || 'skeletonwarrior'
        
        return { type: 'summon', summonType }
    }

    static defaultAttack(enemy, player) {
        return { type: 'attack', damage: enemy.attackDamage, target: player }
    }

    static resetTurnState(enemy) {
        enemy.isDodging = false
    }
}
