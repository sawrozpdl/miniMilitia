import BodyPart from '/js/objects/BodyPart.js';

class Hand extends BodyPart{

    constructor(entity, isLeft) {
        super(entity);
        this.mouse = entity.mouse;
        this.isLeft = isLeft;
        this.spriteName = entity.spriteData + '-hand';
        this.dimensions = this.sprite.getDim(this.spriteName);
        this.hasEquippedGun = false;
        this.equippedGun = null;

        this.angle = 0;
        this.maxRotation = 60 * (Math.PI / 180);
    }

    punch() {

    }

    getWidth() {
        return this.dimensions.width + (this.hasEquippedGun) ? this.equippedGun.width * 0.5 : 0;
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
        this.angle = Math.atan((this.mouse.y - this.gPosition.y) /
                               (this.mouse.x - this.gPosition.x));
        if (!this.entity.isFacingRight) {
            this.angle *= -1;
        }
        if (this.hasEquippedGun) this.equippedGun.draw(context);
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y,
              this.scale,this.angle,
              {x : 0, y : 1});
    }

    

}

export default Hand;