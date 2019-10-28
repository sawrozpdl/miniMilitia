import Entity from "./Entity.js";

class Player extends Entity {

    constructor(sprite, spriteData, position, mouse, scale, audio) {
        super(sprite, spriteData, position, mouse, scale, audio);

        this.health = super.health * 2;
        this.isBot =  false;
    }
    

    pickAmmo(gun) {
        if (this.parts.lHand.equippedGun.spriteName == gun.spriteName)
            this.parts.lHand.equippedGun.pickAmmo(gun);
        else if (this.parts.rHand.equippedGun.spriteName == gun.spriteName)
            this.parts.rHand.equippedGun.pickAmmo(gun);
    }

    equip(gun) {
        if (this.parts.lHand.hasEquippedGun && !this.parts.rHand.hasEquippedGun) {
            if (this.parts.lHand.equippedGun.spriteName === gun.spriteName) {
                this.parts.rHand.equip(gun);
                gun.setOwner(this.parts.rHand);
                return;
            }
            else {
                this.parts.lHand.throw();
                this.parts.lHand.equip(gun);
                gun.setOwner(this.parts.lHand);
                return;
            }   
        }
        else {
            if (this.parts.lHand.hasEquippedGun) this.parts.lHand.throw();
            if (this.parts.rHand.hasEquippedGun) this.parts.rHand.throw();
            this.parts.lHand.equip(gun);
            gun.setOwner(this.parts.lHand);
        }
        this.width = this.parts.body.getWidth() + this.parts.lHand.getWidth();
    }

    pickPowerup(powerUp) {
        this.spriteData = powerUp.spriteName;
        this.armourLevel = powerUp.armourLevel;
    }

    throwGuns() {
        if (this.parts.rHand.hasEquippedGun)
            this.parts.rHand.throw();
        else if (this.parts.lHand.hasEquippedGun)
            this.parts.lHand.throw();
    }

    crouch() {
        this.isCrouching = true;
    }

    unCrouch() {
        this.isCrouching = false;
        this.position.y -= 10;
    }

    
}

export default Player;