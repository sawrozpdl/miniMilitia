class BodyPart {

    constructor(entity) {
        this.sprite = entity.sprite;
        this.spriteName = undefined;
        this.scale = entity.scale;
        this.entity = entity;
        this.dimensions = undefined;
        this.lPosition = {x : 0, y : 0}
        this.gPosition = {x : 0, y : 0}
    }

    getHeight() {
        return this.dimensions.height;
    }

    getWidth() {
        return this.dimensions.width;
    }

    draw(context) {
        this.sprite.draw(this.spriteName, context, this.lPosition.x, this.lPosition.y, this.scale);
    }
}

export default  BodyPart;