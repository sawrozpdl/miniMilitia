import Sprite from '/js/utils/Sprite.js';
import Animator from '/js/utils/Animator.js';
import {loadImage, loadJson} from '/js/utils/Loader.js';


class MiniMilitia {

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
        this.FRAME_LIMIT = 60;
        this.context = this.canvas.getContext('2d');

        
    }

    setDimensions() {
        this.canvas.width = this.GAME_WIDTH;
        this.canvas.height = this.GAME_HEIGHT;
    }

    launch() {
        this.setDimensions();
        Promise.all([
            loadImage('/assets/images/background-main.png'),
            loadImage('/assets/images/objects.png'),
            loadJson('/json/spriteMap.json')
        ]).then(([backgroundMain, spritesheet, spriteMap]) => {

            this.context.drawImage(backgroundMain, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

            var sprite = new Sprite(spritesheet);
            sprite.setMap(spriteMap);

            const anim = new Animator(this.FRAME_LIMIT);
            var i = 0;
            var speed = 5;
            anim.callback = () => {
                this.context.drawImage(backgroundMain, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
                sprite.draw('korean-head',this.context, 40 + i, 40, 0.5);
                if (i > 300 || i < 0) speed *= -1;
                i += speed;
            };
            anim.animate();
       
        });

        
    }
}

export default MiniMilitia;