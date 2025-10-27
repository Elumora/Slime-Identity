import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { mapData } from '../map/mapData';
import { GameProgress } from '../systems/GameProgress';

export class MapScene extends Scene {
    constructor() {
        super('MapScene');
    }

    preload() {
        // Tiles existants
        this.load.image('dirtInner', 'assets/Map/inner-first-level/Dirt Tile.png');
        this.load.image('grassTile', 'assets/Map/inner-first-level/Grass Tile.png');
        this.load.image('grassTile1', 'assets/Map/inner-first-level/Grass Tile-1.png');
        this.load.image('grassMiddleInner', 'assets/Map/inner-first-level/grass-middle.png');
        this.load.image('waterCleanInner', 'assets/Map/inner-first-level/water clean.png');
        this.load.image('waterAlternative', 'assets/Map/inner-first-level/Tile-17.png');
        this.load.image('waterDirt', 'assets/Map/inner-first-level/Water Tile.png');

        this.load.image('grass2level', 'assets/Map/inner-second-level/2 level grass.png');
        this.load.image('grass2levelCave', 'assets/Map/inner-second-level/2 level grass.png');

        this.load.image('grassMiddle', 'assets/Map/all-borders/grass-middle.png');
        this.load.image('tallGrass', 'assets/Map/all-borders/tall grass.png');
        this.load.image('waterClean', 'assets/Map/all-borders/water clean.png');
        this.load.image('grass2levelInner', 'assets/Map/inner-first-level/2 level grass.png');

        // Path tiles
        this.load.image('start', 'assets/Map/path/Starting Tile.png');
        this.load.image('straightLeft', 'assets/Map/path/Straight Left Tile.png');
        this.load.image('straightRight', 'assets/Map/path/Straight Right Tile.png');
        this.load.image('turnLeft', 'assets/Map/path/Turn Left Tile.png');
        this.load.image('turnRight', 'assets/Map/path/Turn Right Tile.png');
        this.load.image('turnLeftToRight', 'assets/Map/path/Turn Left to Right Tile.png');
        this.load.image('turnLeftToUp', 'assets/Map/path/Turn Left To Up.png');

        // Objects
        this.load.image('arrowBoard', 'assets/Map/objects/Arrow Board.png');
        this.load.image('stoneGrass', 'assets/Map/objects/Stone with Shadow.png');
        this.load.image('stoneWater', 'assets/Map/objects/Stone with Shadow-1.png');
        this.load.image('coin', 'assets/Map/objects/Coin-Big.png');
        this.load.image('chest', 'assets/Map/objects/Chest.png');

        // Character
        this.load.image('character', 'assets/GUI/slime-bleu-opacite.png');

        // Monsters
        this.load.spritesheet('plent', 'assets/Enemies/Plent/Idle.png', {
            frameWidth: 128,
            frameHeight: 128
        });

        // GUI
        this.load.image('coinCounter', 'assets/GUI/Coin-counter.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#C8FFC8');
        this.mapContainer = this.add.container(0, 0);

        this.tileWidth = 128;
        this.tileHeight = 64;
        this.spacing = 54;

        // Centrage horizontal, départ en bas (rendu vers le haut)
        this.offsetX = this.sys.game.config.width / 2;
        this.offsetY = this.sys.game.config.height - 200;

        // Contrôle d'affichage de la grille avec coordonnées
        this.showGridCoordinates = false;
        this.gridTextObjects = []; // Stockage des objets texte pour les coordonnées

        // uniquement des clés existantes
        this.borderTiles = ['waterClean', 'tallGrass', 'grassMiddle', 'grass2level'];
        this.innerTiles = ['grassMiddleInner', 'grass2levelInner', 'dirtInner', 'grassTile1', 'grassTile', 'waterCleanInner'];
        this.tallTiles = ['tallGrass'];
        this.grass2levelTiles = ['grass2level', 'grass2levelInner'];

        this.gridWidth = mapData.gridWidth;
        this.gridHeight = mapData.gridHeight;
        this.map = mapData.backgroundTiles;
        this.loadPath();

        const progress = GameProgress.load();

        if (progress.inBattle && progress.currentPathIndex > 0) {
            progress.currentPathIndex--;
            progress.inBattle = false;
            GameProgress.save(progress);
        }

        this.currentPathIndex = progress.currentPathIndex;
        this.coinCount = progress.coins;
        this.collectedCoins = progress.collectedCoins || [];
        this.collectedChests = progress.collectedChests || [];
        this.defeatedMonsters = progress.defeatedMonsters || [];
        const startPos = this.pathTiles[this.currentPathIndex];
        const isoX = (startPos.x - startPos.y) * ((this.tileWidth + this.spacing) / 2);
        const isoY = (startPos.x + startPos.y) * ((this.tileHeight + this.spacing) / 2);

        const enemyTypes = [
            'plent', 'archer', 'black_werewolf', 'fighter', 'fire_spirit',
            'karasu_tengu', 'kitsune', 'red_werewolf', 'samurai', 'shinobi',
            'skeleton', 'swordsman', 'white_werewolf', 'wizard', 'yamabushi_tengu'
        ];

        enemyTypes.forEach(enemy => {
            if (!this.anims.exists(`${enemy}-idle`)) {
                this.anims.create({
                    key: `${enemy}-idle`,
                    frames: this.anims.generateFrameNumbers(enemy, { start: 0, end: 4 }),
                    frameRate: 8,
                    repeat: -1
                });
            }
        });

        this.renderMap();

        this.character = this.add.image(
            this.offsetX + isoX,
            this.offsetY + isoY - 40,
            'character'
        ).setScale(0.1).setInteractive({ useHandCursor: true });
        this.character.setDepth(startPos.x + startPos.y + 0.5);
        this.mapContainer.add(this.character);
        this.sortContainerByDepth();

        this.idleTween = this.tweens.add({
            targets: this.character,
            scaleY: '+=0.02',
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.character.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.moveCharacterAlongPath();
            this.sound.play('jump');
        });

        this.centerCameraOnPlayer();

        // Afficher les coordonnées offset
        // const debugText = this.add.text(10, 100, '', {
        //     fontSize: '16px',
        //     color: '#ffffff',
        //     backgroundColor: '#000000',
        //     padding: { x: 10, y: 10 }
        // }).setScrollFactor(0).setDepth(1000);

        // this.events.on('update', () => {
        //     debugText.setText([
        //         `Container X: ${this.mapContainer.x.toFixed(0)}`,
        //         `Container Y: ${this.mapContainer.y.toFixed(0)}`,
        //         `OffsetX: ${this.offsetX}`,
        //         `OffsetY: ${this.offsetY}`
        //     ]);
        // });

        // Drag & Zoom
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.initialPinchDistance = 0;
        this.initialScale = 2;

        this.input.on('pointerdown', (pointer) => {
            if (this.input.pointer1 && this.input.pointer2 && this.input.pointer1.isDown && this.input.pointer2.isDown) {
                this.isDragging = false;
                const dx = this.input.pointer1.x - this.input.pointer2.x;
                const dy = this.input.pointer1.y - this.input.pointer2.y;
                this.initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
                this.initialScale = this.mapContainer.scale;
            } else if (pointer) {
                this.isDragging = true;
                this.dragStartX = pointer.x - this.mapContainer.x;
                this.dragStartY = pointer.y - this.mapContainer.y;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.input.pointer1 && this.input.pointer2 && this.input.pointer1.isDown && this.input.pointer2.isDown) {
                const dx = this.input.pointer1.x - this.input.pointer2.x;
                const dy = this.input.pointer1.y - this.input.pointer2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const scale = (distance / this.initialPinchDistance) * this.initialScale;
                this.mapContainer.setScale(Phaser.Math.Clamp(scale, 0.3, 2));
            } else if (this.isDragging && pointer && pointer.isDown) {
                this.mapContainer.x = pointer.x - this.dragStartX;
                this.mapContainer.y = pointer.y - this.dragStartY;
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const zoomSpeed = 0.1;
            const newScale = Phaser.Math.Clamp(
                this.mapContainer.scale - (deltaY > 0 ? zoomSpeed : -zoomSpeed),
                0.3,
                2
            );
            this.mapContainer.setScale(newScale);
        });

        // Bouton retour fixé à l'écran
        const backButton = this.add.text(100, 50, 'RETOUR', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setInteractive({ useHandCursor: true });

        backButton.setScrollFactor(0);
        backButton.on('pointerover', () => backButton.setBackgroundColor('#555555'));
        backButton.on('pointerout', () => backButton.setBackgroundColor('#333333'));
        backButton.on('pointerdown', () => this.scene.start('MenuScene'));

        // Contrôle de la grille avec la touche G
        this.input.keyboard.on('keydown-G', () => {
            this.toggleGridCoordinates();
        });

        // Touche D pour toggle debug
        this.input.keyboard.on('keydown-D', () => {
            debugText.visible = !debugText.visible;
        });

        // Coin counter
        this.coinCounter = this.add.image(1758, 62, 'coinCounter').setScrollFactor(0).setDepth(1000);
        this.coinText = this.add.text(1778, 52, this.coinCount.toString(), {
            fontSize: '32px',
            color: '#8F524D',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

        EventBus.emit('current-scene-ready', this);
    }

    moveCharacterAlongPath() {
        if (this.currentPathIndex >= this.pathTiles.length - 1) return;

        if (this.idleTween) this.idleTween.pause();

        this.currentPathIndex++;
        this.saveProgress();
        const targetPos = this.pathTiles[this.currentPathIndex];
        const targetIsoX = (targetPos.x - targetPos.y) * ((this.tileWidth + this.spacing) / 2);
        const targetIsoY = (targetPos.x + targetPos.y) * ((this.tileHeight + this.spacing) / 2);

        this.character.setDepth(targetPos.x + targetPos.y + 0.5);
        this.sortContainerByDepth();

        this.tweens.add({
            targets: this.character,
            x: this.offsetX + targetIsoX,
            y: this.offsetY + targetIsoY - 80,
            scaleX: 0.09,
            scaleY: 0.12,
            duration: 200,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.sortContainerByDepth();
                this.checkCoinCollision();
                this.checkMonsterCollision();
                this.tweens.add({
                    targets: this.character,
                    y: this.offsetY + targetIsoY - 40,
                    scaleX: 0.11,
                    scaleY: 0.08,
                    duration: 200,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        this.checkChestCollision();
                        this.tweens.add({
                            targets: this.character,
                            scaleX: 0.1,
                            scaleY: 0.1,
                            duration: 100,
                            ease: 'Back.easeOut',
                            onComplete: () => {
                                this.centerCameraOnPlayer();
                            }
                        });
                    }
                });
            }
        });
    }

    loadPath() {
        this.pathTiles = mapData.path;

        this.pathTiles.forEach(path => {
            if (path.x >= 0 && path.x < this.gridWidth && path.y >= 0 && path.y < this.gridHeight) {
                this.map[path.y][path.x] = path.tile;
            }
        });
    }

    renderMap() {
        this.mapContainer.removeAll(true);

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const isoX = (x - y) * ((this.tileWidth + this.spacing) / 2);
                const isoY = (x + y) * ((this.tileHeight + this.spacing) / 2);
                const tileKey = this.map[y][x];

                let yOffset = 0;
                if (this.tallTiles.includes(tileKey)) yOffset = -48;
                else if (this.grass2levelTiles.includes(tileKey)) yOffset = -24;

                if (tileKey && this.textures.exists(tileKey)) {
                    const tile = this.add.image(
                        this.offsetX + isoX,
                        this.offsetY + isoY + yOffset,
                        tileKey
                    );
                    tile.setData('gridX', x);
                    tile.setData('gridY', y);
                    tile.setDepth(x + y);
                    this.mapContainer.add(tile);
                }
            }
        }

        if (this.showGridCoordinates) {
            this.showGridCoordinatesOnTiles();
        }

        // Render objects
        mapData.objects.forEach(obj => {
            if (obj.texture === 'coin') return;

            const isoX = (obj.x - obj.y) * ((this.tileWidth + this.spacing) / 2);
            const isoY = (obj.x + obj.y) * ((this.tileHeight + this.spacing) / 2);
            const object = this.add.image(this.offsetX + isoX, this.offsetY + isoY - 20, obj.texture);
            object.setDepth(obj.x + obj.y + 100);
            object.setData('gridX', obj.x);
            object.setData('gridY', obj.y);
            this.mapContainer.add(object);
        });

        // Render coins from generated map
        this.coins = [];
        mapData.coins.forEach(coin => {
            const coinKey = `${coin.x},${coin.y}`;
            if (this.collectedCoins.includes(coinKey)) return;

            const isoX = (coin.x - coin.y) * ((this.tileWidth + this.spacing) / 2);
            const isoY = (coin.x + coin.y) * ((this.tileHeight + this.spacing) / 2);
            const coinObj = this.add.image(this.offsetX + isoX, this.offsetY + isoY - 20, 'coin');
            coinObj.setDepth(coin.x + coin.y + 100);
            coinObj.setData('gridX', coin.x);
            coinObj.setData('gridY', coin.y);
            this.mapContainer.add(coinObj);
            this.coins.push(coinObj);

            this.tweens.add({
                targets: coinObj,
                y: coinObj.y - 15,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });

        // Render chests from generated map
        this.chests = [];
        mapData.chests.forEach(chest => {
            const chestKey = `${chest.x},${chest.y}`;
            if (this.collectedChests.includes(chestKey)) return;

            const isoX = (chest.x - chest.y) * ((this.tileWidth + this.spacing) / 2);
            const isoY = (chest.x + chest.y) * ((this.tileHeight + this.spacing) / 2);
            const chestObj = this.add.image(this.offsetX + isoX, this.offsetY + isoY - 20, 'chest');
            chestObj.setDepth(chest.x + chest.y + 100);
            chestObj.setData('gridX', chest.x);
            chestObj.setData('gridY', chest.y);
            this.mapContainer.add(chestObj);
            this.chests.push(chestObj);
        });

        // Render monsters
        this.monsters = [];
        mapData.monsters.forEach(monster => {
            const monsterKey = `${monster.x},${monster.y}`;
            const isDefeated = this.defeatedMonsters.includes(monsterKey);

            const isoX = (monster.x - monster.y) * ((this.tileWidth + this.spacing) / 2);
            const isoY = (monster.x + monster.y) * ((this.tileHeight + this.spacing) / 2);
            const monsterSprite = this.add.sprite(this.offsetX + isoX, this.offsetY + isoY - 80, monster.texture);
            monsterSprite.setDepth(monster.x + monster.y + 0.5);
            monsterSprite.setData('gridX', monster.x);
            monsterSprite.setData('gridY', monster.y);
            monsterSprite.play(`${monster.texture}-idle`);

            if (isDefeated) {
                monsterSprite.setTint(0x808080);
                monsterSprite.setAlpha(0.5);
            }

            this.mapContainer.add(monsterSprite);
            this.monsters.push(monsterSprite);
        });
    }

    toggleGridCoordinates() {
        this.showGridCoordinates = !this.showGridCoordinates;

        if (this.showGridCoordinates) {
            this.showGridCoordinatesOnTiles();
        } else {
            this.hideGridCoordinates();
        }
    }

    showGridCoordinatesOnTiles() {
        // Nettoyer les anciens textes
        this.hideGridCoordinates();

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const isoX = (x - y) * ((this.tileWidth + this.spacing) / 2);
                const isoY = (x + y) * ((this.tileHeight + this.spacing) / 2);
                const tileKey = this.map[y][x];

                if (tileKey && this.textures.exists(tileKey)) {
                    let yOffset = 0;
                    if (this.tallTiles.includes(tileKey)) yOffset = -48;
                    else if (this.grass2levelTiles.includes(tileKey)) yOffset = -24;

                    // Créer le texte des coordonnées
                    const coordText = this.add.text(
                        this.offsetX + isoX,
                        this.offsetY + isoY + yOffset + 20, // Légèrement en dessous du centre de la tuile
                        `${x},${y}`,
                        {
                            fontSize: '12px',
                            color: '#ffffff',
                            fontStyle: 'bold',
                            stroke: '#000000',
                            strokeThickness: 2
                        }
                    );

                    // Centrer le texte sur la tuile
                    coordText.setOrigin(0.5);

                    this.mapContainer.add(coordText);
                    this.gridTextObjects.push(coordText);
                }
            }
        }
    }

    hideGridCoordinates() {
        // Détruire tous les objets texte des coordonnées
        this.gridTextObjects.forEach(textObj => {
            if (textObj && textObj.destroy) {
                textObj.destroy();
            }
        });
        this.gridTextObjects = [];
    }

    sortContainerByDepth() {
        this.mapContainer.list.sort((a, b) => a.depth - b.depth);
    }

    checkCoinCollision() {
        const charX = this.pathTiles[this.currentPathIndex].x;
        const charY = this.pathTiles[this.currentPathIndex].y;

        this.coins.forEach(coin => {
            if (coin.active && coin.getData('gridX') === charX && coin.getData('gridY') === charY) {
                this.collectCoin(coin);
                this.sound.play('handleCoin');
            }
        });
    }

    collectCoin(coin) {
        this.tweens.killTweensOf(coin);

        const coinKey = `${coin.getData('gridX')},${coin.getData('gridY')}`;
        this.collectedCoins.push(coinKey);

        const worldPos = this.mapContainer.getWorldTransformMatrix().transformPoint(coin.x, coin.y);
        const coinClone = this.add.image(worldPos.x, worldPos.y, 'coin').setDepth(2000);

        this.tweens.add({
            targets: coinClone,
            x: 1758,
            y: 62,
            scale: 0.5,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.coinCount++;
                this.coinText.setText(this.coinCount.toString());
                this.saveProgress();
                coinClone.destroy();
            }
        });

        coin.destroy();
    }

    saveProgress() {
        const progress = GameProgress.load();
        progress.currentPathIndex = this.currentPathIndex;
        progress.coins = this.coinCount;
        progress.collectedCoins = this.collectedCoins;
        progress.collectedChests = this.collectedChests;
        progress.defeatedMonsters = this.defeatedMonsters;
        GameProgress.save(progress);
    }

    checkChestCollision() {
        const charX = this.pathTiles[this.currentPathIndex].x;
        const charY = this.pathTiles[this.currentPathIndex].y;

        this.chests.forEach(chest => {
            if (chest.active && chest.getData('gridX') === charX && chest.getData('gridY') === charY) {
                this.collectChest(chest);
            }
        });
    }

    collectChest(chest) {
        const chestKey = `${chest.getData('gridX')},${chest.getData('gridY')}`;
        this.collectedChests.push(chestKey);
        this.saveProgress();

        this.tweens.add({
            targets: chest,
            alpha: 0,
            scale: 1.5,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                chest.destroy();
                this.scene.start('CardRewardScene', { fromChest: true });
            }
        });
    }

    checkMonsterCollision() {
        const charX = this.pathTiles[this.currentPathIndex].x;
        const charY = this.pathTiles[this.currentPathIndex].y;

        const monsterData = mapData.monsters.find(m => m.x === charX && m.y === charY);
        const monsterKey = `${charX},${charY}`;

        if (monsterData && !this.defeatedMonsters.includes(monsterKey)) {
            this.startBattleTransition(monsterData.enemies, charX, charY);
        } else {
            if (this.idleTween) this.idleTween.resume();
        }
    }

    centerCameraOnPlayer() {
        const targetX = this.sys.game.config.width / 2 - this.character.x;
        const targetY = this.sys.game.config.height / 2 - this.character.y;

        this.tweens.add({
            targets: this.mapContainer,
            x: targetX,
            y: targetY,
            duration: 500,
            ease: 'Power2'
        });
    }

    startBattleTransition(enemies, monsterX, monsterY) {
        if (this.idleTween) this.idleTween.stop();

        const progress = GameProgress.load();
        progress.inBattle = true;
        GameProgress.save(progress);

        const worldPos = this.mapContainer.getWorldTransformMatrix().transformPoint(
            this.character.x,
            this.character.y
        );

        const charClone = this.add.image(worldPos.x, worldPos.y, 'character')
            .setDepth(3000)
            .setScale(this.mapContainer.scale);

        const targetScale = this.sys.game.config.width / charClone.displayWidth;

        this.tweens.add({
            targets: charClone,
            scale: targetScale * this.mapContainer.scale,
            x: this.sys.game.config.width / 2,
            y: this.sys.game.config.height / 2,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.scene.start('GameScene', { enemies, monsterX, monsterY });
            }
        });
    }
}