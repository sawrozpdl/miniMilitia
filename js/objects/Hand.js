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

    draw(context) { //OPT
        this.angle = Math.atan((this.mouse.y - (this.gPosition.y + this.dimensions.height * this.scale / 2)) /
                               (this.mouse.x - (this.gPosition.x + this.dimensions.width * this.scale / 2)));
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