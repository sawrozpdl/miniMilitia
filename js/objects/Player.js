import Entity from "./entity.js";

class Player extends Entity {

    constructor(params) {
        super(params.sprite, params.spriteData, params.position, params.mouse, params.scale, params.audio);
        this.maxHealth = super.maxHealth * 3;
        this.health = super.health * 3;
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

    crouch() {
        this.isCrouching = true;
    }

    unCrouch() {
        this.isCrouching = false;
        this.position.y -= 10;
    }

    die() {
        // TODO
    }

    draw() {
        var defaultCallback = super.draw();
        return (context) => {
            this.isFacingRight = (this.position.x % window.screen.width) < this.mouse.x;
            this.resolveCollisions();
            defaultCallback(context);
            if (this.isFlying) {
                if (this.velocity.x > 0) this.rotationSpeed = 1;
                if (this.velocity.x < 0) this.rotationSpeed = -1;
                if (this.rotation > this.maxRotation) this.rotation = this.maxRotation;
                if (this.rotation < -this.maxRotation) this.rotation = -this.maxRotation;
            }
            if (!this.isFlying) {  // go back smoothly
                if (this.rotation < 0) this.rotationSpeed = 1;
                if (this.rotation > 0) this.rotationSpeed = -1;
                if (this.rotation == 0) this.rotationSpeed = 0;
            }
        
            this.rotation += this.rotationSpeed;
        }
    }

    
}

export default Player;