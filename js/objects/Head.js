import BodyPart from '/js/objects/BodyPart.js';

class Head extends BodyPart{

    constructor(entity) {
        super(entity);
        this.spriteName = entity.spriteData + '-head';
        this.mouse = entity.mouse;
        this.dimensions = this.sprite.getDim(this.spriteName);
    }

    draw(context) { //OPT
        this.angle = this.entity.parts.lHand.angle / 4;
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y,
              this.scale,this.angle,
              {x : 1, y : 1});
    }
}

export default  Head;