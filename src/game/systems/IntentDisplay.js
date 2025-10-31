import { PatternManager } from './PatternManager'
import { PATTERN_ACTIONS } from '../config/AttackPatterns'

export class IntentDisplay {
    static updateEnemyIntent(enemy, turnNumber) {
        if (enemy.intentIcon) {
            enemy.intentIcon.destroy()
            enemy.intentIcon = null
        }
        if (enemy.intentText) {
            enemy.intentText.destroy()
            enemy.intentText = null
        }

        if (!enemy.attackPattern || enemy.isPlayer) return

        const action = PatternManager.getCurrentAction(enemy, turnNumber)
        if (!action) return

        const spriteHeight = enemy.sprite.displayHeight
        const intentYOffset = -(spriteHeight / 2 + 60)

        let iconKey = 'attackIcon'
        let text = ''
        let color = '#ffffff'

        switch (action.action) {
            case PATTERN_ACTIONS.ATTACK:
                iconKey = 'attackIcon'
                const multiplier = action.multiplier || 1
                const chargeBonus = enemy.isCharging ? enemy.chargeMultiplier : 1
                const damage = Math.floor(enemy.attackDamage * multiplier * chargeBonus)
                text = `${damage}`
                color = '#ff0000'
                break
            case PATTERN_ACTIONS.CHARGE:
                iconKey = 'attackIcon'
                text = 'Charge'
                color = '#ff6600'
                break
            case PATTERN_ACTIONS.BLOCK:
                iconKey = 'shieldIcon'
                text = `${action.value || 5}`
                color = '#00aaff'
                break
            case PATTERN_ACTIONS.DODGE:
                text = 'Esquive'
                color = '#ffff00'
                break
            case PATTERN_ACTIONS.SUMMON:
                text = 'Invoc'
                color = '#aa00ff'
                break
        }

        if (action.action !== PATTERN_ACTIONS.DODGE && action.action !== PATTERN_ACTIONS.SUMMON) {
            enemy.intentIcon = enemy.scene.add.image(-15, intentYOffset, iconKey).setScale(0.12)
            enemy.add(enemy.intentIcon)
        }

        enemy.intentText = enemy.scene.add.text(action.action === PATTERN_ACTIONS.DODGE || action.action === PATTERN_ACTIONS.SUMMON ? 0 : 10, intentYOffset, text, {
            fontSize: '16px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(action.action === PATTERN_ACTIONS.DODGE || action.action === PATTERN_ACTIONS.SUMMON ? 0.5 : 0, 0.5)
        enemy.add(enemy.intentText)
    }
}
