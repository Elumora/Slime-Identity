import { Scene } from 'phaser';

export class DevGrid extends Scene {
    constructor() {
        super({ key: 'DevGrid', active: false, visible: false });
    }

    create() {
        const { width, height } = this.cameras.main;
        const gridSize = 50;
        const graphics = this.add.graphics();

        // Grille
        graphics.lineStyle(1, 0x00ff00, 0.3);
        for (let x = 0; x <= width; x += gridSize) {
            graphics.lineBetween(x, 0, x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
            graphics.lineBetween(0, y, width, y);
        }

        // Règle horizontale
        const rulerH = this.add.graphics();
        rulerH.fillStyle(0x000000, 0.7);
        rulerH.fillRect(0, 0, width, 30);
        rulerH.lineStyle(2, 0xffffff, 1);
        rulerH.lineBetween(0, 30, width, 30);

        for (let x = 0; x <= width; x += gridSize) {
            rulerH.lineStyle(1, 0xffffff, 1);
            rulerH.lineBetween(x, 20, x, 30);
            this.add.text(x + 2, 5, x.toString(), {
                fontSize: '12px',
                color: '#ffffff'
            });
        }

        // Règle verticale
        const rulerV = this.add.graphics();
        rulerV.fillStyle(0x000000, 0.7);
        rulerV.fillRect(0, 0, 30, height);
        rulerV.lineStyle(2, 0xffffff, 1);
        rulerV.lineBetween(30, 0, 30, height);

        for (let y = 0; y <= height; y += gridSize) {
            rulerV.lineStyle(1, 0xffffff, 1);
            rulerV.lineBetween(20, y, 30, y);
            this.add.text(2, y + 2, y.toString(), {
                fontSize: '12px',
                color: '#ffffff'
            });
        }

        this.add.text(5, 5, '0', {
            fontSize: '12px',
            color: '#ffff00'
        });

        // Affichage coordonnées au clic
        this.coordsText = this.add.text(width / 2, height - 20, '', {
            fontSize: '16px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(1000);

        this.input.on('pointerdown', (pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            this.coordsText.setText(`X: ${x} | Y: ${y}`);
        });

        // Toggle avec touche G
        this.input.keyboard.on('keydown-G', () => {
            this.scene.setVisible(!this.scene.isVisible());
        });

        this.scene.setVisible(false);
    }
}
