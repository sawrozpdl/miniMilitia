class BodyPart {

    constructor(entity) {
        this.sprite = entity.sprite;
        this.spriteName = undefined;
        this.scale = entity.scale;

        this.dimensions = undefined;
    }

    getHeight() {
        return this.dimensions.height;
    }

    getWidth() {
        return this.dimensions.width;
    }

    draw(context, x, y) {
        this.sprite.draw(this.spriteName, context, x, y, this.scale);
    }
}

export default  BodyPart;