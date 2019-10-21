import BodyPart from '/js/objects/BodyPart.js';

class Leg extends BodyPart {

    constructor(entity, isLeft) {
        super(entity);
        this.spriteName = entity.spriteData.leg;
        this.dimensions = this.sprite.getDim(this.spriteName);
        this.isLeft = isLeft;
    }

    rotate(context, x, y, angle) {
        this.sprite.rotate(this.spriteName,
             context, x, y, this.scale,
              angle,
              {x : 1, y : 0});
    }

}

export default Leg;