import Phaser from 'phaser';
import { DevGrid } from './debug/DevGrid';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameScene } from './scenes/GameScene';
import { MainMenu } from './scenes/MainMenu';
import { MapScene } from './scenes/MapScene';
import { Narration } from './scenes/Narration';
import { Preloader } from './scenes/Preloader';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MapScene,
        Narration,
        Game,
        GameScene,
        DevGrid
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
