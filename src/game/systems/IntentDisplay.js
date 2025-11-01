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
        const intentYOffset = spriteHeight / 2 + 65

        let iconKey = 'attackIcon'
        let text = ''
        let color = '#ffffff'
        let description = ''

        switch (action.action) {
            case PATTERN_ACTIONS.ATTACK:
                iconKey = 'attackIcon'
                const multiplier = action.multiplier || 1
                const chargeBonus = enemy.isCharging ? enemy.chargeMultiplier : 1
                const damage = Math.floor(enemy.attackDamage * multiplier * chargeBonus)
                text = `${damage}`
                color = '#ff0000'
                description = `Prochain tour:\nAttaque: Inflige ${damage} dégâts`
                break
            case PATTERN_ACTIONS.CHARGE:
                iconKey = 'attackIcon'
                text = 'Charge'
                color = '#ff6600'
                description = `Prochain tour:\nCharge: Prépare une attaque\npuissante (x${action.multiplier || 2})`
                break
            case PATTERN_ACTIONS.BLOCK:
                iconKey = 'shieldIcon'
                text = `${action.value || 5}`
                color = '#00aaff'
                description = `Prochain tour:\nBlocage: Gagne ${action.value || 5}\npoints de bouclier`
                break
            case PATTERN_ACTIONS.DODGE:
                iconKey = 'dodgeIcon'
                text = ''
                color = '#ffff00'
                description = 'Prochain tour:\nEsquive: Évite toutes\nles attaques ce tour'
                break
            case PATTERN_ACTIONS.SUMMON:
                text = 'Invoc'
                color = '#aa00ff'
                description = 'Prochain tour:\nInvocation: Invoque un allié'
                break
        }

        const container = enemy.scene.add.container(0, intentYOffset)
        container.setInteractive(new Phaser.Geom.Rectangle(-20, -15, 40, 30), Phaser.Geom.Rectangle.Contains)
        container.on('pointerdown', () => {
            this.showIntentTooltip(enemy, description)
        })

        if (action.action !== PATTERN_ACTIONS.SUMMON) {
            enemy.intentIcon = enemy.scene.add.image(action.action === PATTERN_ACTIONS.DODGE ? 0 : -15, 0, iconKey).setScale(0.12)
            container.add(enemy.intentIcon)
        }

        if (text) {
            enemy.intentText = enemy.scene.add.text(action.action === PATTERN_ACTIONS.SUMMON ? 0 : 10, 0, text, {
                fontSize: '16px',
                color: color,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(action.action === PATTERN_ACTIONS.SUMMON ? 0.5 : 0, 0.5)
            container.add(enemy.intentText)
        }

        enemy.add(container)
        enemy.intentContainer = container
    }

    static showIntentTooltip(enemy, description) {
        if (enemy.intentTooltip) {
            enemy.intentTooltip.bg.destroy()
            enemy.intentTooltip.text.destroy()
            enemy.intentTooltip = null
            return
        }

        const padding = 10
        const tooltipText = enemy.scene.add.text(0, 0, description, {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: padding, y: padding },
            align: 'center'
        }).setOrigin(0.5)

        const worldPos = enemy.getWorldTransformMatrix().transformPoint(0, enemy.intentContainer.y)
        const tooltipY = worldPos.y

        const bg = enemy.scene.add.rectangle(enemy.x, tooltipY, tooltipText.width + padding * 2, tooltipText.height + padding * 2, 0x000000, 0.9)
        bg.setStrokeStyle(2, 0xffffff)
        bg.setDepth(10000)

        tooltipText.setPosition(enemy.x, tooltipY)
        tooltipText.setDepth(10001)

        enemy.intentTooltip = { bg, text: tooltipText }

        enemy.scene.time.delayedCall(3000, () => {
            if (enemy.intentTooltip) {
                enemy.intentTooltip.bg.destroy()
                enemy.intentTooltip.text.destroy()
                enemy.intentTooltip = null
            }
        })
    }
}
