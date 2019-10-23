class Camera {

    constructor(game) {
        this.game = game;
        this.scope = 10;
        this.visible = document.createElement('canvas');
        this.visibleCtx = this.visible.getContext('2d');
        this.width = this.game.GAME_WIDTH;
        this.height = this.game.GAME_HEIGHT;
        this.visible.width = this.width;
        this.visible.height = this.height;

        this.x = this.game.player.position.x - this.width / 2; // x cord
        this.y = this.game.player.position.y - this.height / 2; // y cord
        this.dx = 3; // change in x cord
        this.dy = 3; // change in y cord
        this.xx = 0; // final x cord
        this.yy = 0; // final y cord
        this.horizontalViewPoint = 0;
        this.verticalViewpoint = 0;
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
        return (context) => {
            
            if (this.game.player.isFacingRight) this.horizontalViewPoint = this.width / 4;
            else this.horizontalViewPoint = - this.width / 4;
            this.verticalViewpoint = this.game.player.parts.lHand.angle * this.height / 10;
            
            if (this.game.player.position.x > this.width / 2) 
                this.xx = this.game.player.position.x - this.width / 2 + this.horizontalViewPoint;
            if (this.game.player.position.y > this.height / 2) 
                this.yy = this.game.player.position.y - this.height / 2 + this.verticalViewpoint;
           
            this.dx = (this.xx - this.x) / 100;
            this.dy = (this.yy - this.y) / 100;    
            this.x += this.dx;
            this.y += this.dy;

            this.visibleCtx.drawImage(this.background,0,0, this.width, this.height);
            this.visibleCtx.drawImage(
                this.game.mainBuffer,
                this.x / (this.scope / 10), this.y / (this.scope / 10),
                this.width / (this.scope / 10), this.height / (this.scope / 10),
                0, 0, this.width, this.height
            );
            context.clearRect(0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height);
            this.game.mainContext.drawImage(this.visible, 0, 0, this.width, this.height);
        }
    }

    setScope(scope) { // 2x, 4x, 6x (max)
        this.scope = scope;
    }
}

export default Camera;