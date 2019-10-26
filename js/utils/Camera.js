class Camera {

    constructor(game) {
        this.game = game;
        this.scope = 2 * 0.3;
        this.visible = document.createElement('canvas');
        this.visibleCtx = this.visible.getContext('2d');
        this.width = this.game.GAME_WIDTH;
        this.height = this.game.GAME_HEIGHT;
        this.visible.width = this.width;
        this.visible.height = this.height;
        this.map = false;

        this.x = this.game.player.position.x - this.width / 2; // x cord
        this.y = this.game.player.position.y - this.height / 2; // y cord
        this.dx = 6; // change in x cord
        this.dy = 6; // change in y cord
        this.xx = 0; // final x cord
        this.yy = 0; // final y cord
        this.mapOpacity = 0.5;
        this.horizontalViewPoint = 0;
        this.verticalViewpoint = 0;
    }

    showMap() {
        this.map = true;
    }

    hideMap() {
        this.map = false;
        this.mapOpacity = 0.5;
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
            var width = this.width * this.scope; // scoped width
            var height = this.height * this.scope; // scoped height
            if (this.game.player.isFacingRight) this.horizontalViewPoint = width / 4;
            else this.horizontalViewPoint = - width / 4;
            this.verticalViewpoint = this.game.player.parts.lHand.angle * height / 10;
            
            if (this.game.player.position.x > width / 2) 
                this.xx = this.game.player.position.x - width / 2 + this.horizontalViewPoint;
            if (this.game.player.position.y > height / 2) 
                this.yy = this.game.player.position.y - height / 2 + this.verticalViewpoint;
           
            this.dx = (this.xx - this.x) / 50;
            this.dy = (this.yy - this.y) / 50;    
            this.x += this.dx;
            this.y += this.dy;

            this.visibleCtx.drawImage(this.background,0,0, this.width, this.height);
            this.visibleCtx.drawImage(
                this.game.mainBuffer,
                this.x , this.y,
                width, height,
                0, 0, this.width, this.height
            );
            this.game.mainContext.drawImage(this.visible, 0, 0, this.width, this.height);
            //context.fillRect(this.game.player.position.x, this.game.player.position.y, this.game.player.width, this.game.player.height);
            this.game.mainContext.globalAlpha = this.mapOpacity; 
            if (this.map) {
                this.game.mainContext.drawImage(this.game.mainBuffer, 0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height,
                                0, 0, 520, 180);
                this.mapOpacity += 0.005;
            }
            context.clearRect(0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height);
        }
    }
    
    setScope(scopeRatio) { // 2x, 4x, 6x (max)
        this.scope = scopeRatio * 0.3;
        this.game.audios.switch.play();
    }
}

export default Camera;