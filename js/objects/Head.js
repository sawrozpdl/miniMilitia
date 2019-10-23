import BodyPart from '/js/objects/BodyPart.js';

class Head extends BodyPart{

    constructor(entity) {
        super(entity);
        this.spriteName = entity.spriteData + '-head';
        this.mouse = entity.mouse;
        this.dimensions = this.sprite.getDim(this.spriteName);
    }
}

export default  Head;