import Head from "./head.js";
import Hand from "./hand.js";
import Body from "./body.js";
import Leg from "./leg.js";
import {Vector} from '../utils/math.js';
import Polygon from "./polygon.js";

class Entity extends Polygon {

    constructor(sprite, spriteData, position, mouse, scale, audios) {
        super();
        this.sprite = sprite;
        this.spriteData = spriteData;
        this.mouse = mouse;
        this.position = position;
        this.scale = scale;
        this.audios = audios;
        this.gravity = 0.3;
        this.cstate = [];
        this.parts = {
            head : new Head(this),
            lHand : new Hand(this, true),
            rHand : new Hand(this, false),
            body : new Body(this),
            lLeg : new Leg(this, true),
            rLeg : new Leg(this, false)
        }
        this.mergeParts();
        this.width = this.parts.body.getWidth() + this.parts.lHand.getWidth();
    }

    spawn() {
        this.isKilled = false;
        this.thruster = 100;
        this.maxHealth = 100;
        this.health = 100;
        this.dHealth = 0.03;
        this.dthruster = 1.5;
        this.isFacingRight = true;
        this.isWalking = false;
        this.isFlying = false;
        this.isShifted = false;
        this.hasLanded = false;
        this.isCrouching = false;
        this.armourLevel = 1;
        this.cstate = [];
        this.velocity = new Vector(0, 0);
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
        return (this.cstate.includes(6) && this.cstate.includes(6.5) && 
                            !this.cstate.includes(7) &&
                            !this.cstate.includes(0) &&
                            !this.hasRockAbove());
    }

    canClimbRight() {
        return (this.cstate.includes(4) && this.cstate.includes(3.5) &&
                            !this.cstate.includes(2) &&
                            !this.cstate.includes(3) &&
                            !this.hasRockAbove());
    }

    resolveCollisions() {
        if (this.cstate.includes(1) && this.cstate.includes(7)) {
            this.position.x += 3;
            this.position.y += 3;
        }
        if (this.cstate.includes(1) && this.cstate.includes(3)) {
            this.position.x -= 3;
            this.position.y += 3;
        }
        if (this.cstate.includes(5) && !this.isCrouching && (this.cstate.includes(6.5) || this.cstate.includes(3.5))) {
            this.position.y -= 1;
        }
        if (this.hasRockAbove()) {
            this.position.y += 1;
        }
        if ((this.cstate.includes(3.5) && this.cstate.includes(6.5)) && this.hasRockBelow()) {
            this.position.y -= 1;
        }
    }

    shoot() {
        this.parts.lHand.shoot();
        this.parts.rHand.shoot();
    }

    reload() {
        this.parts.lHand.reload();
        this.parts.rHand.reload();
    }

    moveLeft() {
        if (this.isKilled) return;
        if (this.hasRockLeft()) {
            this.stopWalking();
            return;
        }
        this.isWalking = true;
        if (this.canClimbLeft()) {
            this.position.y -= 1;
            this.position.x -= 1;
            return;
        }
        this.velocity.x = -2 - (this.isFlying ? 1 : 0);
    }

    moveRight() {
        if (this.isKilled) return;
        if (this.hasRockRight()) {
            this.stopWalking();
            return;
        }
        this.isWalking = true;
        if (this.canClimbRight()) {
            this.position.y -= 1;
            this.position.x += 1;
            return;
        }
        this.velocity.x = 2 + (this.isFlying ? 1 : 0);
    }

    stopWalking() {
        this.isWalking = false;
        this.velocity.x = 0;
    }

    throwGuns() {
        if (this.parts.rHand.hasEquippedGun)
            this.parts.rHand.throw();
        else if (this.parts.lHand.hasEquippedGun)
            this.parts.lHand.throw();
    }

    flyUp() {
        if (this.isKilled) return;
        if (this.hasRockAbove() || this.thruster <= 0) {
            this.stopFlying();
            return;
        }
        this.isFlying = true;
        this.velocity.y = -4; 
        this.thruster -= this.dthruster;
    }

    stopFlying() {
        this.isFlying = false;
        this.velocity.y = 0;
    }

    getShot(bullet) {
        var damage = bullet.damage * (1 / this.armourLevel);
        if (this.health <= damage) this.kill();
        else {
            this.health -= damage * ((this.isCrouching) ? 0.6 : 1);
        }
    }
    
    kill() {
        this.isKilled = true;
        this.die();
    }

    die() { // different for both player and bot so define in sub class

    }

    updatePoints() { // for bots and players
        if (!this.isPlayer) return; //static rocks dont need update
        var offSetX = ((!this.isFacingRight) ? this.width * 0.35 / 2 : 0);
        var offSetY = (this.isCrouching) ? -10 : 0;
        //var angOffset = this.rotation * this.width * 0.005;
        this.points = [
            {
                x : this.position.x + offSetX,
                y : this.position.y,
                i : 0
            }, 
            {
                x : this.position.x + (offSetX + this.width * 0.15) / 2,
                y : this.position.y,
                i : 1
            }, 
            {
                x : this.position.x + offSetX + this.width * 0.15,
                y : this.position.y,
                i : 2
            },
            {
                x : this.position.x + offSetX + this.width * 0.15, //
                y : this.position.y + (this.height * 0.25) / 2,
                i : 3
            },
            {
                x : this.position.x + offSetX + this.width * 0.15, 
                y : this.position.y + (this.height * 0.25) - 7,
                i : 3.5
            },
            {
                x : this.position.x + offSetX + this.width * 0.15,
                y : this.position.y + offSetY + this.height * 0.25,
                i : 4
            },
            {
                x : this.position.x + offSetX + this.width * 0.15 / 2,
                y : this.position.y + offSetY + this.height * 0.25,
                i : 5
            },
            {
                x : this.position.x + offSetX,
                y : this.position.y + offSetY + this.height * 0.25,
                i : 6
            },
            {
                x : this.position.x + offSetX,
                y : this.position.y + offSetY + (this.height * 0.25) - 7, 
                i : 6.5
            },
            {
                x : this.position.x + offSetX,
                y : this.position.y + offSetY + (this.height * 0.25) / 2, //
                i : 7
            }
        ];
        //this.lineSegments = [];
        //this.setLineSegments();
    }


    draw() {
        let buffer = document.createElement('canvas');
        buffer.height = this.height * this.scale * 1.5;
        buffer.width = this.width * this.scale * 1.5;
        var bufferCtx = buffer.getContext('2d');
        this.updatePoints();

        return (context) => {
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
                if (this.thruster < 100) this.thruster += this.dthruster / 25;
            }
            if (this.isKilled) {
                this.gravity = 0;
                this.velocity.y = 0;
            }

            if (this.health < this.maxHealth) this.health += this.dHealth;
            
            this.velocity.y += this.gravity;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
    
            if (!this.isFacingRight) {
                this.sprite.flip(buffer);
            }

            this.updatePoints();
            this.sprite.rotate(buffer, context,
                this.position.x, this.position.y,
                0.5, this.rotation * (Math.PI / 180), {x : 1, y : 1});

            if (this.position.y > 1152 || this.position.y < 0 || this.position.x < 0 || this.position.x > 3328) {
                if (this.health < (this.dHealth * 4)) {
                    this.kill();
                }
                else this.health -= this.dHealth * 4;
                
            }

        }

    }

}

export default Entity;