import BodyPart from './bodyPart.js';

class Leg extends BodyPart {

    constructor(entity, isLeft) {
        super(entity);
        this.spriteName = entity.spriteData + '-leg';
        this.dimensions = this.sprite.getDim(this.spriteName);
        this.isLeft = isLeft;
    }

    rotate(context, angle, crouch) {
        this.spriteName = this.entity.spriteData + '-leg';
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x + ((crouch) ? (10 + angle * 50) : 0), this.lPosition.y + ((crouch) ? 15 : 0), this.scale,
             (crouch) ? (Math.PI / 2) : angle,
              {x : 1, y : 0});

        if (this.entity.isFlying && (Math.random() < 0.9) && !crouch) {
            this.sprite.rotate('fire',
                context, this.lPosition.x, this.lPosition.y + this.getHeight() * this.scale, this.scale,
                 angle,
                 {x : 1, y : 0}); 
        }
    }

}

export default Leg;