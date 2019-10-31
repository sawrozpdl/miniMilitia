import BodyPart from "./bodyPart.js";

class Body extends BodyPart{
    
    constructor(entity) {
        super(entity);
        this.spriteName = entity.spriteData + '-body';
        this.dimensions = this.sprite.getDim(this.spriteName);
    }

    draw(context) {
        this.spriteName = this.entity.spriteData + '-body';
        this.sprite.draw(this.spriteName, context, this.lPosition.x, this.lPosition.y, this.scale);
    }

}

export default Body;