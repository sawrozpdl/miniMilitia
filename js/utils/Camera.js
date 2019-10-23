class Camera {

    constructor(game) {
        this.game = game;
        this.player = this.game.player;

        this.visible = document.createElement('canvas');
        this.visibleCtx = this.visible.getContext('2d');
        this.width = this.game.GAME_WIDTH;
        this.height = this.game.GAME_HEIGHT;

        this.visible.width = this.width;
        this.visible.height = this.height;
        console.log(this.width, this.height, "yoyo");
    }

    generateBackground(image) { // stores the backgroud in buffer and passes to layers to draw
        let buffer = document.createElement('canvas');
        buffer.height = this.game.GAME_HEIGHT;
        buffer.width = this.game.GAME_WIDTH;
        buffer.getContext('2d').drawImage(image, 0, 0, this.game.GAME_WIDTH, this.game.GAME_HEIGHT);
        this.background = buffer;
    }

    update() {
        this.generateBackground(this.game.images.background);
        //return (ctx) => {}
        return (context) => {
            var x = 0;
            var y = this.game.canvas.height - this.height;
            this.visibleCtx.clearRect(0, 0, this.width, this.height);
            this.visibleCtx.drawImage(this.background,0,0, this.width, this.height);
            this.visibleCtx.drawImage(
            this.game.canvas,
                x,y, this.width, this.height,
                0, 0, this.width, this.height
            );
            context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            context.drawImage(this.visible, 0, 0, this.width, this.height);
        }
        
    }

    setScope(scope) { // 2x, 4x, 6x (max)

    }
}

export default Camera;