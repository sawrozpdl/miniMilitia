import BodyPart from './bodyPart.js';

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
        this.spriteName = this.entity.spriteData + '-hand';
        var dy = (this.mouse.y - (this.gPosition.y % window.screen.height));
        var dx = (this.mouse.x - (this.gPosition.x % window.screen.width));
        if (this.entity.isBot) {
            dx =  this.entity.enemy.position.x - this.gPosition.x;
            dy = this.entity.enemy.position.y - this.gPosition.y;
        }
        this.angle = (this.entity.isFacingRight) ? Math.atan2(dy, dx) : -Math.atan(dy / dx);
        if (this.hasEquippedGun) this.equippedGun.draw(context);
        this.sprite.rotate(this.spriteName,
             context, this.lPosition.x, this.lPosition.y,
              this.scale,this.angle,
              {x : 0, y : 1});
    }

}

export default Hand;