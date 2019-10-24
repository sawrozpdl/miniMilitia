import BodyPart from './BodyPart.js';

class Leg extends BodyPart {

    constructor(entity, isLeft) {
        super(entity);
        this.spriteName = entity.spriteData + '-leg';
        this.dimensions = this.sprite.getDim(this.spriteName);
        this.isLeft = isLeft;
    }

    rotate(context, angle) {
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y, this.scale,
              angle,
              {x : 1, y : 0});

        if (this.entity.isFlying && (Math.random() < 0.95)) {
            this.sprite.rotate('fire',
                context, this.lPosition.x, this.lPosition.y + this.getHeight() * this.scale, this.scale,
                 angle,
                 {x : 1, y : 0}); 
        }
    }

}

export default Leg;