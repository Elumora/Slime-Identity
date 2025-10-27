import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.launch('DevGrid');
        
        this.cameras.main.setBackgroundColor(0x222222);
        
        this.input.keyboard.on('keydown-G', () => {
            if (this.scene.isActive('DevGrid')) {
                this.scene.setVisible('DevGrid', !this.scene.isVisible('DevGrid'));
            }
        });
        
        EventBus.emit('current-scene-ready', this);
    }
}
