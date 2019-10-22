import Sprite from '/js/utils/Sprite.js';
import Animator from '/js/utils/Animator.js';
import Layers from '/js/utils/Layers.js';
import Keyboard from '/js/events/Keyboard.js';
import Mouse from '/js/events/Mouse.js';
import Player from '/js/objects/Player.js';
import {Vector} from '/js/utils/Math.js';
import {
    loadImage,
    loadJson,
    loadMedia
} from '/js/utils/Loader.js';


class Main {

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
        this.FRAME_LIMIT = 60;
        this.speedFactor = 60 / this.FRAME_LIMIT;
        this.context = this.canvas.getContext('2d');
        this.layers = new Layers(this.context);
        this.animation = new Animator(this.FRAME_LIMIT);
        this.background = null;
        this.sprite = null;
        this.keyListener = new Keyboard();
        this.MouseListener = new Mouse(this.canvas);

        this.images = null;
        this.audios = null;
        this.player = null;
        this.mouse = null;
    }

    init() {
        this.mouse = {
            x: 0,
            y: 0
        };
        this.setDimensions();
        this.player = new Player(this.sprite, {
            head : "korean-head",
            body : "korean-body",
            hand : "korean-hand",
            leg : "korean-leg"
        },this.playerPosition, this.mouse, 0.7, this.audios);
        this.gravity = {
            x : 0,
            y : 5 * this.speedFactor
        }
    }

    setDimensions() {
        this.canvas.width = this.GAME_WIDTH;
        this.canvas.height = this.GAME_HEIGHT;
    }

    generateBackground(image) { // stores the backgroud in buffer and passes to layers to draw
        let buffer = document.createElement('canvas');
        buffer.height = this.GAME_HEIGHT;
        buffer.width = this.GAME_WIDTH;

        buffer.getContext('2d').drawImage(image, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        return (context) => {
            context.drawImage(buffer, 0, 0);
        }
    }

    spawnPlayer() {
        this.player.position = new Vector(300, 500);
        this.layers.push(this.player.draw());
    }

    deployLoadingScreen() {
        Promise.all([
            loadImage('/assets/images/loading.png'),
            loadImage('./assets/images/logo.png')
        ]).then(([loading, logo]) => {
            var i = 0;
            this.layers.push((context) => {
                context.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
                context.drawImage(logo, 0, 0,
                    logo.width, logo.height,
                    (this.GAME_WIDTH - logo.width) / 2,
                    (this.GAME_HEIGHT - 2 * logo.height) / 2,
                    logo.width, logo.height);
                context.drawImage(loading, loading.height * i, 0,
                    loading.height, loading.height,
                    (this.GAME_WIDTH - loading.height) / 2,
                    (this.GAME_HEIGHT + loading.height) / 2,
                    loading.height, loading.height);
                i = ++i % 8;
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
            loadMedia('/json/assets.json'),
            loadJson('/json/spriteMap.json')
        ]).then(([media, spriteMap]) => {
            this.images = media.images;
            this.audios = media.audios;
            this.background = this.images.background;
            this.sprite = new Sprite(this.images.spritesheet);
            this.sprite.setMap(spriteMap);
            this.dumpRecentScreen(); // which is loading screen
            this.animation.setFrameLimit(this.FRAME_LIMIT);
            this.init();
            this.launch();
        });
    }

    startAnimation() {
        this.animation.callback = () => {
            this.layers.draw();
        };
        this.animation.animate();
    }

    setBackground() {
        this.layers.push(this.generateBackground(this.background)); 
    }

    setEventListeners() {
        this.keyListener.for(68, (down) => {
            this.player.moveRight();
        }, (up) => {
            this.player.stop();
        });

        this.keyListener.for(65, (down) => {
            this.player.moveLeft();
        }, (up) => {
            this.player.stop();
        });

        this.MouseListener.for('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.MouseListener.for('click', (e) => {
            console.log(this.player);
            this.player.shoot();
        });
    }

    launch() {
        this.setBackground();
        this.spawnPlayer();
        this.setEventListeners();
    }
}

export default Main;