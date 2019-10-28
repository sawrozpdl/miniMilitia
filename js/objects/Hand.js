import BodyPart from './BodyPart.js';

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
    }

    punch() {

    }

    getWidth() {
        if (this.hasEquippedGun)
            return (this.dimensions.width + this.equippedGun.width * 0.5);
        return this.dimensions.width;
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

    reload() {
        if (this.hasEquippedGun) 
            this.equippedGun.reload();
    }

    shoot() {
        if (this.hasEquippedGun)
            this.equippedGun.shoot();
    }

    draw(context) { //OPT
        var dy = (this.mouse.y - (this.gPosition.y % 1080));
        var dx = (this.mouse.x - (this.gPosition.x % 1920));
        this.angle = (this.entity.isFacingRight) ? Math.atan2(dy, dx) : -Math.atan(dy / dx);
        if (this.hasEquippedGun) this.equippedGun.draw(context);
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y,
              this.scale,this.angle,
              {x : 0, y : 1});
    }

}

export default Hand;