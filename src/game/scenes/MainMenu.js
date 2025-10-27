import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.scene.launch('DevGrid');

        this.add.image(960, 540, 'menu-bg').setDisplaySize(1920, 1080);

        const menuX = 100;
        const menuY = 800;
        const spacing = 70;

        const buttonStyle = {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        const newGame = this.add.text(menuX, menuY, 'Nouvelle Partie', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Game'))
            .on('pointerover', () => newGame.setColor('#ffff00'))
            .on('pointerout', () => newGame.setColor('#ffffff'));

        // const continueGame = this.add.text(menuX, menuY + spacing, 'Continuer', buttonStyle)
        //     .setInteractive({ useHandCursor: true })
        //     .on('pointerover', () => continueGame.setColor('#ffff00'))
        //     .on('pointerout', () => continueGame.setColor('#ffffff'));

        const stats = this.add.text(menuX, menuY + spacing * 1, 'Statistiques', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => stats.setColor('#ffff00'))
            .on('pointerout', () => stats.setColor('#ffffff'));

        const settings = this.add.text(menuX, menuY + spacing * 2, 'Paramètres', buttonStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => settings.setColor('#ffff00'))
            .on('pointerout', () => settings.setColor('#ffffff'));

        EventBus.emit('current-scene-ready', this);
    }
}
