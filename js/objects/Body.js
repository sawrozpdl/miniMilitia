import BodyPart from "/js/objects/BodyPart.js";

class Body extends BodyPart{
    
    constructor(entity) {
        super(entity);
        this.spriteName = entity.spriteData.body;
        this.dimensions = this.sprite.getDim(this.spriteName);
        console.log(this.dimensions);
    }

}

export default Body;