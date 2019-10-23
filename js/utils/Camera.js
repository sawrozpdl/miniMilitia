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
            var x = 0;
            var y = 0;
            if (this.game.player.position.x > this.width / (this.scope / 5)) {
                x = this.game.player.position.x - this.width / (this.scope / 5);
            }
            if (this.game.player.position.y > this.height / (this.scope / 5)) {
                y = this.game.player.position.y - this.height / (this.scope / 5);
            }
            this.visibleCtx.drawImage(this.background,0,0, this.width, this.height);
            this.visibleCtx.drawImage(
            this.game.mainBuffer,
                x / (this.scope / 10), y / (this.scope / 10),
                this.width / (this.scope / 10), this.height / (this.scope / 10),
                0, 0, this.width, this.height
            );
            context.clearRect(0, 0, this.game.mainBuffer.width, this.game.mainBuffer.height);
            this.game.mainContext.drawImage(this.visible, 0, 0, this.width, this.height);
        }
    }

    setScope(scope) { // 2x, 4x, 6x (max)
        this.scope = (scope + 10);
    }
}

export default Camera;