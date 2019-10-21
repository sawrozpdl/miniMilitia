import Sprite from '/js/utils/Sprite.js';
import Animator from '/js/utils/Animator.js';
import Layers from '/js/utils/Layers.js';
import Keyboard from '/js/events/Keyboard.js';
import Mouse from '/js/events/Mouse.js';
import {
    loadImage,
    loadJson,
    loadAudio
} from '/js/utils/Loader.js';


class Main {

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
        this.FRAME_LIMIT = 30;
        this.context = this.canvas.getContext('2d');
        this.layers = new Layers(this.context);
        this.animation = new Animator(this.FRAME_LIMIT);
        this.background = null;
        this.sprite = null;
        this.keyListener = new Keyboard();
        this.MouseListener = new Mouse(this.canvas);
        this.setDimensions();
    }

    setDimensions() {
        this.canvas.width = this.GAME_WIDTH;
        this.canvas.height = this.GAME_HEIGHT;
    }

    generateBackground(image) {
        let buffer = document.createElement('canvas');
        buffer.height = this.GAME_HEIGHT;
        buffer.width = this.GAME_WIDTH;

        buffer.getContext('2d').drawImage(image, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        return (context) => {
            context.drawImage(buffer, 0, 0);
        }
    }


    generateHead(sprite) { // this function is for experimental purposes only
        let buffer = document.createElement('canvas');
        var ibpx = 100;
        var ibpy = 100;
        sprite.draw('indian-body', buffer.getContext('2d'), 0, 0, 0.5);
        var i = 0;
        var speed = 1;
        var rotateCallback = this.sprite.drawR('indian-hand', ibpx , ibpy,"left", 1);
        return (context) => {
            if (ibpx > 300 || ibpx < 0) speed *= -1;
            context.drawImage(buffer, ibpx += speed, ibpy);
            rotateCallback(context,ibpx, ibpy, 0);
            i++;
            i %= 90;
        }
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

    dumpLoadingScreen() {
        this.layers.pop();
    }

    loadAssets() {
        this.deployLoadingScreen();
        Promise.all([
            loadImage('/assets/images/background.png'),
            loadImage('/assets/images/objects.png'),
            loadJson('/json/spriteMap.json')
        ]).then(([background, spritesheet, spriteMap]) => {
            this.background = background;

            this.sprite = new Sprite(spritesheet);
            this.sprite.setMap(spriteMap);

            this.dumpLoadingScreen();
            //this.animation.setFrameLimit(this.FRAME_LIMIT);
            this.launch();
        });
    }

    launch() {
        this.setLayers();
        this.keyListener.for(32, (e) => {console.log("space!")});
        this.MouseListener.for('mouseenter', (e) => {console.log(e.clientX, e.clientY)});
    }

    setLayers() {
        this.layers.push(this.generateBackground(this.background)); // stores the backgroud in buffer and passes to layers to draw
        this.layers.push(this.generateHead(this.sprite));
    }

    startAnimation() {
        this.animation.callback = () => {
            this.layers.draw();
        };
        this.animation.animate();
    }
}

export default Main;