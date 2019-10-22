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

    draw(context) {
        console.log();
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y, this.scale,
              Math.atan((this.mouse.y - this.gPosition.y) / (this.mouse.x - this.gPosition.x)),
              {x : 0, y : 1});
    }

    

}

export default Hand;