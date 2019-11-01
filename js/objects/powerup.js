class Powerup {

    constructor(spriteName, sprite, context) {
        this.spriteName = spriteName;
        this.sprite = sprite;
        this.context = context;
        this.scale = 0.2;
        this.isActive = true;
        this.position = undefined;
        this.dimensions = this.sprite.getDim(spriteName + '-head');
        this.height = this.dimensions.height * this.scale;
        this.width = this.dimensions.width * this.scale;
        this.armourLevel = 1;
        switch (this.spriteName) {
            case "indian" : 
                this.armourLevel = 1;
                break;
            case "korean": 
                this.armourLevel = 2;
                break;
            case "biker": 
                this.armourLevel = 3;
        }
    }

    despawn() {
        this.isActive = false;
    }

    show() {
        this.sprite.draw(this.spriteName + '-head', this.context,
            this.position.x, this.position.y,
            this.scale);
    }
}

export default Powerup;