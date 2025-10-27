import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('loading-bg', 'assets/GUI/loading-screen.jpg');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
