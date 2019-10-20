import Sprite from '/js/utils/Sprite.js';
import Animator from '/js/utils/Animator.js';
import Layers from '/js/utils/Layers.js';
import {loadImage, loadJson} from '/js/utils/Loader.js';


class Main {

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
        this.FRAME_LIMIT = 60;
        this.context = this.canvas.getContext('2d');
        this.i = 0;
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

        return function drawBackground(context) {
            context.drawImage(buffer, 0, 0);
        }
    }

    generateHead(sprite) {
        let buffer = document.createElement('canvas');
        sprite.draw('indian-head', buffer.getContext('2d'), 0, 0, 0.5);
        var i = 0;
        var speed = 5;
        return function drawBackground(context) {
            if (i > 300 || i < 0) speed *= -1;
            context.drawImage(buffer, i+=speed, 0);
        }
    }

    launch() {
        this.setDimensions();
        Promise.all([
            loadImage('/assets/images/background.png'),
            loadImage('/assets/images/objects.png'),
            loadJson('/json/spriteMap.json')
        ]).then(([background, spritesheet, spriteMap]) => {
            var sprite = new Sprite(spritesheet);
            sprite.setMap(spriteMap);

            var layers = new Layers(this.context);
            layers.push(this.generateBackground(background));
            layers.push(this.generateHead(sprite));
            
            const anim = new Animator(this.FRAME_LIMIT);
            anim.callback = () => {
                layers.draw();
            };
            anim.animate();
        }); 
    }
}

export default Main;