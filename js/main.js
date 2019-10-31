import Sprite from './utils/Sprite.js';
import Animator from './utils/Animator.js';
import Layers from './utils/Layers.js';
import {
    genRandom
} from './utils/Math.js';
import Keyboard from './events/Keyboard.js';
import Mouse from './events/Mouse.js';
import Camera from './utils/Camera.js';
import Map from './objects/Map.js';
import Collision from './objects/Collision.js';
import Player from './objects/Player.js';
import Gun from './objects/Gun.js';
import Overlay from './objects/Overlay.js';
import {
    loadImage,
    loadJson,
    loadMedia
} from './utils/Loader.js';
import Powerup from './objects/Powerup.js';
import Robot from './objects/Robot.js';


class Main {

    constructor(canvas) {
        this.canvas = canvas;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        this.GAME_WIDTH = 2223;
        this.GAME_HEIGHT = 1080;
        this.FRAME_LIMIT = 60;

        this.robots = [];
        this.playButton = {
            x: 0,
            y: 0
        }
        this.mainContext = this.canvas.getContext('2d');
        this.mainBuffer = document.createElement('canvas');
        this.context = this.mainBuffer.getContext('2d');
        this.sprite = new Sprite();
        this.layers = new Layers(this.context);
        this.animation = new Animator(this.FRAME_LIMIT);
        this.keyListener = new Keyboard();
        this.MouseListener = new Mouse(this.canvas);
    }

    init() {
        this.guns = [];
        this.gunNames = ['uzi', 'ak47', 'm16', 'pistol'];
        this.gunCounter = 0;
        this.remLives = 3;
        this.gameScope = 3;
        this.playerType = 'indian';
        this.playerKills = 0;
        this.playerScore = 0;
        this.highScore = +localStorage.getItem('highScore');
        this.botCount = 0;
        this.hasLoaded = false;
        this.gameStarted = false;
        this.gameOver = false;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.canEquip = null;
        this.player = new Player(this.sprite, this.playerType,
            this.playerPosition, this.mouse, 0.5, this.audios);
        this.collision = new Collision(this);
        this.overlay = new Overlay(this);
    }

    setDimensions() {
        this.canvas.width = this.GAME_WIDTH;
        this.canvas.height = this.GAME_HEIGHT;
    }

    spawnPlayer() {
        var pos = this.spawnPoints.players[Math.floor(Math.random() * this.spawnPoints.players.length)];
        this.player.position = {
            x: pos.x + 0,
            y: pos.y + 0
        }
        this.player.spawn();
        var lgun = new Gun(((Math.random() < 0.5) ? 'uzi' : 'pistol'), this.sprite, this.gunData, this.collision);
        this.player.equip(lgun);
        this.guns.push(lgun);
        this.camera = new Camera(this);
        this.layers.push(this.player.draw());
    }

    respawnPlayer() {
        this.player.health = this.player.maxHealth;
        this.player.thruster = 100;
        var lgun = new Gun('uzi', this.sprite, this.gunData, this.collision);
        this.player.throwGuns();
        this.player.equip(lgun);
        this.guns.push(lgun);
        var pos = this.spawnPoints.players[2 + Math.floor(Math.random() * (this.spawnPoints.players.length - 2))];
        this.player.position.x = pos.x + 0;
        this.player.position.y = pos.y + 0;
        this.playerType = 'indian';
        this.player.spawn();
        console.log('respawned!');
        this.gameStarted = true;
    }

    drawLogo(logo, offset, context) {
        context.drawImage(logo, 0, 0,
            logo.width, logo.height,
            (this.GAME_WIDTH - logo.width * 1.5) / 2,
            ((this.GAME_HEIGHT - 2 * logo.height * 1.5) / 2) - offset,
            logo.width * 1.5, logo.height * 1.5);
    }

    deployLoadingScreen() {
        this.setDimensions();
        this.layers.setContext(this.mainContext);
        
        Promise.all([
            loadImage('../../assets/images/background-main.png'),
            loadImage('../../assets/images/loading.png'),
            loadImage('../../assets/images/logo.png'),
            loadImage('../../assets/images/play.png')
        ]).then(([background,loading, logo, play]) => {
            var i = 0;
            var offset = 0;
            this.layers.push((context) => {
                context.drawImage(background, 0, 0,
                    this.GAME_WIDTH, this.GAME_HEIGHT);
                this.drawLogo(logo, offset, context);
                if (this.hasLoaded) {
                    if (offset < 150) offset+=5;
                    context.drawImage(play, (this.GAME_WIDTH - play.width) / 2, 300 + offset, 320, 188);
                    this.playButton = {
                        'x' : (this.GAME_WIDTH - play.width) / 2,
                        'y' : 300 + offset,
                        'width' : 320,
                        'height' : 188
                    }
                }
                else this.sprite.rotate(loading, context, (this.GAME_WIDTH - loading.width * 0.1) / 2,
                (logo.height * 2 + loading.height) / 2, 0.1, i+=10 * Math.PI/180, {x : 1, y : 1});
                //i+=20;
            });
            this.animation.setFrameLimit(this.FRAME_LIMIT);
            this.startAnimation();
        });
    }

    dumpRecentScreen() {
        this.layers.pop();
    }

    loadAssets() {
        this.deployLoadingScreen();
        Promise.all([
            loadMedia('../../json/assets.json'),
            loadJson('../../json/spriteMap.json'),
            loadJson('../../json/map1.json'),
            loadJson('../../../json/guns.json')
        ]).then(([media, spriteMap, mapData, gunData]) => {
            this.images = media.images;
            this.audios = media.audios;
            this.sprite.setSpriteSheet(this.images.spritesheet);
            this.map = new Map(mapData);
            this.spawnPoints = this.map.mapData.map.spawnpoints;
            this.gunData = gunData;
            this.mainBuffer.height = this.map.getHeight();
            this.mainBuffer.width = this.map.getWidth();
            this.sprite.setMap(spriteMap);
            this.hasLoaded = true;
        });
    }

    startGame(e) {
        var cx = e.clientX * this.GAME_WIDTH / window.screen.width;
        var cy = e.clientY * this.GAME_HEIGHT / window.screen.height;
        if (cx >= this.playButton.x && cx <= (this.playButton.x + this.playButton.width) &&
            cy >= this.playButton.y && cy <= (this.playButton.y + this.playButton.height)) {
            this.dumpRecentScreen(); // which is loading screen
            this.layers.setContext(this.context);
            this.animation.setFrameLimit(this.FRAME_LIMIT);
            this.init();
            this.map.setCollisionLayer(this.collision);
            this.launch();
            this.gameStarted = true;
        }
    }

    restartGame() {
        this.remLives = 3;
        this.playerKills = 0;
        this.playerScore = 0;
        this.respawnPlayer();
        this.gameOver = false;
        this.gameStarted = true;
    }

    genGuns() {
        this.spawnPoints.guns.forEach(point => {
            if (Math.random() < 0.3) return;
            var gun = new Gun(this.gunNames[Math.floor(Math.random() * this.gunNames.length)],
                this.sprite, this.gunData, this.collision);
            gun.position.x = point.x + 0;
            gun.position.y = point.y + 0;
            this.guns.push(gun);
        });
        this.collision.guns = this.guns;
    }

    genPowerups() {
        var powerUps = ['korean', 'biker'];
        var c = 1;
        this.spawnPoints.powerups.forEach(pposition => {
            let powerup = new Powerup(powerUps[c % 2], this.sprite, this.context);
            powerup.position = {
                x: pposition.x,
                y: pposition.y
            }
            this.collision.powerUps.push(powerup);
            c++;
        });
    }

    genBots() {
        this.spawnPoints.players.forEach(ppoint => {
            if (Math.random() < 0.2) {
                var bot = new Robot(this.sprite, undefined, this.MouseListener, 0.5, this.audios, genRandom(1, 4));
                var gun = new Gun(this.gunNames[Math.floor(Math.random() * this.gunNames.length)],
                    this.sprite, this.gunData, this.collision);
                bot.position = {
                    x: ppoint.x + 0,
                    y: ppoint.y + 0
                }
                gun.liveAmmo = 1000;
                this.guns.push(gun);
                bot.parts.lHand.equip(gun);
                bot.setEnemy(this.player);
                gun.setOwner(bot.parts.lHand);
                bot.init();
                this.collision.playerPolygons.push(bot);
                this.botCount++;
                if (this.botCount >= 3) return;
            }
        });
    }

    startAnimation() {
        this.animation.callback = () => {
            this.layers.draw();
        };
        this.animation.animate();
    }

    setEventListeners() {

        this.keyListener.for(68, (down) => {
            this.player.moveRight();
        }, (up) => {
            this.player.stopWalking();
        });

        this.keyListener.for(65, (down) => {
            this.player.moveLeft();
        }, (up) => {
            this.player.stopWalking();
        });

        this.keyListener.for(83, (down) => {
            this.player.crouch();
        }, (up) => {
            this.player.unCrouch();
        });

        this.keyListener.for(87, (down) => {
            this.player.flyUp();
        }, (up) => {
            this.player.stopFlying();
        });

        this.keyListener.for(70, (down) => {
            if (this.canEquip) {
                this.player.equip(this.canEquip);
                this.camera.setScope(this.canEquip.scope);
                this.gameScope = this.canEquip.scope;
            } else {
                this.player.throwGuns();
                if (!this.player.parts.rHand.hasEquippedGun) {
                    this.camera.setScope(1.5);
                    this.gameScope = 2;
                }
            }
        });

        this.keyListener.for(71, (down) => {
            this.player.pickAmmo(this.canEquip);
        });

        this.keyListener.for(13, (down) => {
            if (this.gameOver) {
                this.restartGame();
            }
        });

        this.keyListener.for(9, (down) => {
            this.player.switchWeapon();
        });

        this.keyListener.for(81, (down) => {
            this.player.dropWeapon();
        });

        this.keyListener.for(82, (down) => {
            this.player.reload();
        });

        this.keyListener.for(221, (down) => {
            this.collision.showDev = !this.collision.showDev;
        });

        this.keyListener.for(49, (down) => { // 2x
            if (this.player.parts.lHand.hasEquippedGun || this.player.parts.rHand.hasEquippedGun)
                this.camera.setScope(1.5);
            this.gameScope = 2;
        });

        this.keyListener.for(50, (down) => { // 3x
            if (this.player.parts.lHand.hasEquippedGun || this.player.parts.rHand.hasEquippedGun)
                this.camera.setScope(2);
            this.gameScope = 3;
        });

        this.keyListener.for(51, (down) => { // 4x
            if (this.player.parts.lHand.hasEquippedGun) {
                if (this.player.parts.lHand.equippedGun.data.maxScope > 3) {
                    this.camera.setScope(2.5);
                    this.gameScope = 4;
                    return;
                }
                if (this.player.parts.rHand.hasEquippedGun) {
                    if (this.player.parts.rHand.equippedGun.data.maxScope > 3) {
                        this.camera.setScope(2.5);
                        this.gameScope = 4;
                        return;
                    }
                }
            }
        });

        this.keyListener.for(52, (down) => { // 6x
            if (this.player.parts.lHand.hasEquippedGun) {
                if (this.player.parts.lHand.equippedGun.data.maxScope > 4) {
                    this.camera.setScope(3);
                    this.gameScope = 6;
                    return;
                }
                if (this.player.parts.rHand.hasEquippedGun) {
                    if (this.player.parts.rHand.equippedGun.data.maxScope > 4) {
                        this.camera.setScope(3);
                        this.gameScope = 6;
                        return;
                    }
                }
            }
        });

        this.keyListener.for(77, (down) => {
            this.camera.showMap();
        }, (up) => {
            this.camera.hideMap();
        });

        this.MouseListener.for('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.MouseListener.for('click', (e) => {
            this.player.shoot();
        });

    }

    launch() {
        this.map.ready().then(() => {
            this.layers.push(this.map.drawBackground());
            this.layers.push(this.map.drawForeground());
            this.spawnPlayer();
            this.layers.push(this.map.drawBushes());
            this.genGuns();
            this.genPowerups();
            this.layers.push(this.map.getCollisionLayer());
            this.layers.setCamera(this.camera.update());
            this.layers.setOverlay(this.overlay.show());
            this.setEventListeners();
            window.game = this;
        });
    }
}

export default Main;