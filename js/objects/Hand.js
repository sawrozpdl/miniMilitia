import BodyPart from '/js/objects/BodyPart.js';

class Hand extends BodyPart{

    constructor(entity, isLeft) {
        super(entity);
        this.entity = entity;
        this.mouse = entity.mouse;
        this.isLeft = isLeft;
        this.spriteName = entity.spriteData.hand;
        this.dimensions = this.sprite.getDim(this.spriteName);
        this.hasEquippedGun = false;
        this.equippedGun = null;

        this.position = {}
    }

    getWidth() { //Override
        //return this.dimensions.width + ((this.hasEquippedGun) ? this.equippedGun.width : 0);
        return this.dimensions.width;
    }

    punch() {

    }

    equip(gun) {
        this.equippedGun = gun;
        this.hasEquippedGun = true;
    }

    throw() {
        this.equippedGun.throw();
        this.equippedGun = null;
        this.hasEquippedGun = false;
    }

    draw(context, x, y) {
        this.sprite.rotate(this.spriteName,
             context, x, y, this.scale,
              Math.atan((this.mouse.y - this.position.y) / (this.mouse.x - this.position.x)),
              {x : 0, y : 1});
    }

    

}

export default Hand;