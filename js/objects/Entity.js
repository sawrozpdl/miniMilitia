import Head from "./Head.js";
import Hand from "./Hand.js";
import Body from "./Body.js";
import Leg from "./Leg.js";
import {Vector} from '../utils/Math.js';
import Polygon from "./Polygon.js";

class Entity extends Polygon {

    constructor(sprite, spriteData, position, mouse, scale, audios) {
        super();
        this.sprite = sprite;
        this.spriteData = spriteData;
        this.mouse = mouse;
        this.position = position;
        this.scale = scale;
        this.audios = audios;
        this.parts = {
            head : new Head(this),
            lHand : new Hand(this, true),
            rHand : new Hand(this, false),
            body : new Body(this),
            lLeg : new Leg(this, true),
            rLeg : new Leg(this, false)
        }
        this.mergeParts();
    }

    spawn() {
        this.isKilled = false;
        this.thruster = 100;
        this.health = 100;
        this.dthruster = 2.5;
        this.isFacingRight = true;
        this.isWalking = false;
        this.isFlying = false;
        this.isShifted = false;
        this.hasLanded = false;
        this.isCrouching = false;
        this.velocity = new Vector(0, 0);
        this.gravity = 0.3;
        this.cstate = [];
        this.height = (this.parts.head.getHeight() + 
                      this.parts.body.getHeight() +
                      this.parts.lLeg.getHeight()) * 0.93; //parts are intersected
        
        this.setConfigs();
    }

    mergeParts() {
        this.parts.head.lPosition = {x : 0, y : 0}
        this.parts.body.lPosition = {x : 10 * this.scale, y : (this.parts.head.getHeight() - 10) * this.scale};
        this.parts.lLeg.lPosition = {x : 17 * this.scale, y : this.parts.body.lPosition.y + (this.parts.body.getHeight() - 15) * this.scale}
        this.parts.rLeg.lPosition = {x : (this.parts.body.getWidth() * this.scale + 5 * this.scale) / 2, y : this.parts.lLeg.lPosition.y}
        this.parts.lHand.lPosition = {x : this.scale * 17, y: this.parts.body.lPosition.y + 12 * this.scale}
        this.parts.rHand.lPosition = {x : this.parts.rLeg.lPosition.x + this.scale * 10, y : this.parts.lHand.lPosition.y}
    }

    setConfigs() {
        this.angle = 0;
        this.angularSpeed = 1;
        this.rotation = 0;
        this.rotationSpeed = 1;
        this.maxRotation = 60;
        this.audios.walk.playbackRate = 0.5;
        this.audios.jet.volume = 0.6;
        this.audios.walk.volume = 0.5;
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

    throwGuns() {
        if (this.parts.rHand.hasEquippedGun)
            this.parts.rHand.throw();
        else if (this.parts.lHand.hasEquippedGun)
            this.parts.lHand.throw();
    }

    shoot() {
        this.parts.lHand.shoot();
        this.parts.rHand.shoot();
    }

    reload() {
        this.parts.lHand.reload();
        this.parts.rHand.reload();
    }

    crouch() {
        this.isCrouching = true;
    }

    unCrouch() {
        this.isCrouching = false;
        this.position.y -= 10;
    }

    moveLeft() {
        if (this.hasRockLeft()) {
            this.stopWalking();
            return;
        }
        this.isWalking = true;
        if (this.hasRockBelow() && this.canClimbLeft()) {
            this.position.y -= 1;
            this.position.x -= 1;
            return;
        }
        this.velocity.x = -2;
    }

    moveRight() {
        if (this.hasRockRight()) {
            this.stopWalking();
            return;
        }
        this.isWalking = true;
        if (this.hasRockBelow() && this.canClimbRight()) {
            this.position.y -= 1;
            this.position.x += 1;
            return;
        }
        this.velocity.x = 2;
    }

    stopWalking() {
        this.isWalking = false;
        this.velocity.x = 0;
    }

    flyUp() {
        if (this.hasRockAbove() || this.thruster <= 0) {
            this.stopFlying();
            return;
        }
        this.isFlying = true;
        this.velocity.y = -4; //fix this
        this.thruster -= this.dthruster;
    }

    stopFlying() {
        this.isFlying = false;
        this.velocity.y = 0;
    }

    hasRockBelow() {
        return this.cstate.includes(4) ||
                this.cstate.includes(5) ||
                this.cstate.includes(6);
    }

    hasRockAbove() {
        return this.cstate.includes(0) ||
                this.cstate.includes(1) ||
                this.cstate.includes(2);
    }

    hasRockLeft() {
        return (this.cstate.includes(7)) ||
               (this.cstate.includes(0)) 
    }

    hasRockRight() {
        return (this.cstate.includes(3)) ||
               (this.cstate.includes(2)) 
    }

    canClimbLeft() {
        return (this.cstate.includes(6) && !this.cstate.includes(7) && !this.cstate.includes(0));
    }

    canClimbRight() {
        return (this.cstate.includes(4) && !this.cstate.includes(2) && !this.cstate.includes(3));
    }
    
    checkCols() {
        if (this.cstate.includes(2) && this.cstate.includes(7)) {
            this.position.x += 3;
            this.position.y += 3;
        }
        if (this.cstate.includes(2) && this.cstate.includes(3)) {
            this.position.x -= 3;
            this.position.y += 3;
        }
        if (this.cstate.includes(5) && this.cstate.includes(7)) {
            this.position.x += 3;
            this.position.y -= 3;
        }
        if (this.cstate.includes(5) && this.cstate.includes(3)) {
            this.position.x -= 3;
            this.position.y -= 3;
        }
        if ((this.cstate.includes(0) && this.cstate.includes(2)) ||
        (this.cstate.includes(1) && this.cstate.includes(2)) || (this.cstate.includes(0) && this.cstate.includes(3))) {
            this.position.y += 3;
        }
    }

    getShot(bullet) {
        if (this.health <= bullet.damage) this.kill();
        else {
            this.health -= bullet.damage;
        }
    }

    

    kill() {
        console.log('killed!');
    }

    reSpawn() {

    }

    draw() {
        let buffer = document.createElement('canvas');
        buffer.height = this.height * this.scale * 1.5;
        buffer.width = this.width * this.scale * 1.5;
        var bufferCtx = buffer.getContext('2d');
        buffer.fillstyle = 'green'; //  REMOVE
        bufferCtx.fillRect(0,0,buffer.width, buffer.height); // REMOVE

        this.updatePoints();

        return (context) => {
            this.checkCols();
            this.isFacingRight = (this.position.x % 1920) < this.mouse.x;
            if (this.isFlying) this.audios.jet.play();
            if (!this.isWalking && !this.isFlying) this.angle = 0;
            else if (!this.isCrouching) this.audios.walk.play();
            
            bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

            this.parts.rHand.draw(bufferCtx);

            this.parts.rLeg.rotate(bufferCtx, this.angle * (Math.PI / 180), this.isCrouching);
            this.parts.lLeg.rotate(bufferCtx, -1 * this.angle* (Math.PI / 180), this.isCrouching);

            this.angle += this.angularSpeed;
            if (this.angle > 10 || this.angle < -10) 
                this.angularSpeed *= -1;
            
            this.parts.body.draw(bufferCtx);
            this.parts.head.draw(bufferCtx);
            this.parts.lHand.draw(bufferCtx);

            for (var part in this.parts) {
                var bPart = this.parts[part];
                bPart.gPosition.x = this.position.x + bPart.lPosition.x;
                bPart.gPosition.y = this.position.y + bPart.lPosition.y;
            }

            if (this.hasRockBelow() && !this.isFlying) {
                this.velocity.y = -this.gravity;
                if (!this.hasLanded) {
                    this.hasLanded = true;
                    this.audios.land.play();
                }
            }
            
            if (this.isFlying) {
                this.gravity = 0;
                this.hasLanded = false;
            }
            else {
                this.gravity = 0.3;
                if (this.thruster < 100) this.thruster += this.dthruster / 50;
            }
            
            this.velocity.y += this.gravity;
            this.position.add(this.velocity);
           
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
    
            if (!this.isFacingRight) {
                this.sprite.flip(buffer);
            }

            this.updatePoints();
            this.sprite.rotate(buffer, context,
                this.position.x, this.position.y,
                0.5, this.rotation * (Math.PI / 180), {x : 1, y : 1});

        }

    }

}

export default Entity;