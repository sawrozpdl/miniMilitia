class Camera {

    constructor(game) {
        this.game = game;
        this.scope = 2 * 0.3;
        this.visible = document.createElement('canvas');
        this.visibleCtx = this.visible.getContext('2d');
        this.width = this.game.GAME_WIDTH;
        this.height = this.game.GAME_HEIGHT;
        this.sWidth = 0;
        this.sHeight = 0;
        this.visible.width = this.width;
        this.visible.height = this.height;
        this.map = false;

        this.x = this.game.player.position.x - this.width / 2; // x cord
        this.y = this.game.player.position.y - this.height / 2; // y cord
        this.dx = 6; // change in x cord
        this.dy = 6; // change in y cord
        this.xx = 0; // final x cord
        this.yy = 0; // final y cord
        this.horizontalViewPoint = 0;
        this.verticalViewpoint = 0;
    }

    showMap() {
        this.map = true;
    }

    hideMap() {
        this.map = false;
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
            this.sWidth = this.width * this.scope; // scoped width
            this.sHeight = this.height * this.scope; // scoped height
            if (this.game.player.isFacingRight) this.horizontalViewPoint = this.sWidth / 4;
            else this.horizontalViewPoint = - this.sWidth / 4;
            this.verticalViewpoint = this.game.player.parts.lHand.angle * this.sHeight / 10;
            
            if (this.game.player.position.x > this.sWidth / 2) 
                this.xx = this.game.player.position.x - this.sWidth / 2 + this.horizontalViewPoint;
            else if (this.game.player.position.x < this.sWidth / 2) 
                this.xx = 0;
            if (this.game.player.position.y > this.sHeight / 2) 
                this.yy = this.game.player.position.y - this.sHeight / 2 + this.verticalViewpoint;
            else if (this.game.player.position.y < this.sHeight / 2) 
                this.yy = 0;

            this.dx = (this.xx - this.x) / 50;
            this.dy = (this.yy - this.y) / 50;    
            this.x += this.dx;
            this.y += this.dy;

            this.visibleCtx.drawImage(this.background,0,0, this.width, this.height);
            this.visibleCtx.drawImage(
                this.game.mainBuffer,
                this.x , this.y,
                this.sWidth, this.sHeight,
                0, 0, this.width, this.height
            );
            this.game.mainContext.drawImage(this.visible, 0, 0, this.width, this.height);
            context.strokeStyle = 'white';
            context.lineWidth = 20;
            context.strokeRect(0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height);
            this.game.collision.playerPolygons.forEach(player => {
                context.drawImage((player.isBot) ? this.game.images.arrowDownRed : this.game.images.arrowDown,
                                   player.position.x + (player.isFacingRight ? -10 : 20), player.position.y - 100, 70, 70);
            });
            if (this.map) {
                this.game.mainContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.game.mainContext.fillRect(20, this.height - 290, 780, 270);
                this.game.mainContext.drawImage(this.game.mainBuffer, 0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height,
                                20, this.height - 290, 780, 270);
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