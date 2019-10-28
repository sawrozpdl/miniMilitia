import Sprite from './utils/Sprite.js';
import Animator from './utils/Animator.js';
import Layers from './utils/Layers.js';
import Keyboard from './events/Keyboard.js';
import Mouse from './events/Mouse.js';
import Camera from './utils/Camera.js';
import Map from './objects/Map.js';
import Collision from './objects/Collision.js';
import Player from './objects/Player.js';
import Gun from './objects/Gun.js';
import Overlay from './objects/Overlay.js';
import {Vector} from './utils/Math.js';
import {
    loadImage,
    loadJson,
    loadMedia
} from './utils/Loader.js';


class Main {

    constructor(canvas) {
        this.canvas = canvas;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        this.GAME_WIDTH = 2223;
        this.GAME_HEIGHT = 1080;
        this.FRAME_LIMIT = 60;
        
        this.robots = [];
        this.mainContext = this.canvas.getContext('2d');
        this.mainBuffer = document.createElement('canvas');
        this.context = this.mainBuffer.getContext('2d');
        this.sprite = new Sprite();
        this.layers = new Layers(this.context);
        this.animation = new Animator(this.FRAME_LIMIT);
    }

    init() {
        this.keyListener = new Keyboard();
        this.MouseListener = new Mouse(this.canvas);
        this.guns = [];
        this.gunNames = ['uzi', 'ak47', 'm16', 'pistol'];
        this.gunCounter = 0;
        this.remLives = 3;
        this.gameScope = 3;
        this.playerType = 'korean';
        this.playerKills = 0;
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
        this.player.position = new Vector(this.GAME_WIDTH * 0.8, this.GAME_HEIGHT * 0.2);
        this.player.spawn();
        var lgun = new Gun('uzi', this.sprite, this.gunData, this.collision);
        var rgun = new Gun('uzi', this.sprite, this.gunData, this.collision);
        this.player.equip(lgun);
        this.player.equip(rgun);
        this.guns.push(lgun);
        this.guns.push(rgun);
        this.camera = new Camera(this);
        this.layers.push(this.player.draw());
    }

    respawnPlayer() {
        this.player.health = 100;
        this.player.thruster = 100;
        var lgun = new Gun('uzi', this.sprite, this.gunData, this.collision);
        this.player.equip(lgun);
        this.guns.push(lgun);
        this.player.spawn();
    }

    deployLoadingScreen() {
        this.setDimensions();
        this.layers.setContext(this.mainContext);
        Promise.all([
            loadImage('../assets/images/background-main.png'),
            loadImage('../assets/images/loading.png'),
            loadImage('../assets/images/logo.png')
        ]).then(([background,loading, logo]) => {
            var i = 0;
            this.layers.push((context) => {
                context.drawImage(background, 0, 0,
                    this.GAME_WIDTH, this.GAME_HEIGHT);
                context.drawImage(logo, 0, 0,
                    logo.width, logo.height,
                    (this.GAME_WIDTH - logo.width * 1.5) / 2,
                    (this.GAME_HEIGHT - 2 * logo.height * 1.5) / 2,
                    logo.width * 1.5, logo.height * 1.5);
                this.sprite.rotate(loading, context, (this.GAME_WIDTH - loading.width * 0.1) / 2,
                (logo.height * 2 + loading.height) / 2, 0.1, i * Math.PI/180, {x : 1, y : 1});
                i+=20;
            });
            this.animation.setFrameLimit(this.FRAME_LIMIT / 4);
            this.startAnimation();
        });
    }

    dumpRecentScreen() {
        this.layers.pop();
    }

    loadAssets() {
        this.deployLoadingScreen();
        Promise.all([
            loadMedia('../json/assets.json'),
            loadJson('../json/spriteMap.json'),
            loadJson('../json/map1.json'),
            loadJson("../../json/guns.json")
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
            this.dumpRecentScreen(); // which is loading screen
            this.layers.setContext(this.context);
            this.animation.setFrameLimit(this.FRAME_LIMIT);
            this.init();
            this.map.setCollisionLayer(this.collision);
            this.launch();
        });
    }

    genGuns() {
        this.spawnPoints.forEach(point => {
            var gun = new Gun(this.gunNames[Math.floor(Math.random() * this.gunNames.length)],
                         this.sprite, this.gunData, this.collision);
            gun.position.x = point.x;
            gun.position.y = point.y;
            console.log(point);
            this.guns.push(gun);
        });
        this.collision.guns = this.guns;
    }

    despawnGuns() {
        let c = 0;
        this.guns.forEach(gun => {
            if (gun.hasBeenEquipped) {
                c++;
                continue;
            }
            this.guns.splice(c++, 1);
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
            }
            else {
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
            this.layers.push(this.map.getCollisionLayer());
            this.layers.setCamera(this.camera.update());
            this.layers.setOverlay(this.overlay.show());
            this.setEventListeners();
        });
    }
}

export default Main;