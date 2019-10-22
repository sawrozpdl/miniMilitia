import Head from "/js/objects/Head.js";
import Hand from "/js/objects/Hand.js";
import Body from "/js/objects/Body.js";
import Leg from "/js/objects/Leg.js";
import {Vector} from '/js/utils/Math.js';
import Gun from "/js/objects/Gun.js";

class Entity {

    constructor(sprite, spriteData, position, mouse, scale, audios) {
        this.sprite = sprite;
        this.spriteData = spriteData;
        this.mouse = mouse;
        this.scale = scale;
        this.audios = audios;
        this.isLimited = false; // timespan infinite if not killed
        this.isKilled = false;
        this.position = position;
        this.thruster = 100;
        this.health = 100;
        this.dthruster = 1;
        this.dhealth = 0.5;
        this.isFacingRight = true;
        this.isWalking = false;
        this.isFlying = false;
        this.velocity = new Vector(0, 0);
        this.gravity = new Vector(0, 0.3);
        this.parts = {
            head : new Head(this),
            lHand : new Hand(this, true),
            rHand : new Hand(this, false),
            body : new Body(this),
            lLeg : new Leg(this, true),
            rLeg : new Leg(this, false)
        }
        

        this.height = (this.parts.head.getHeight() + 
                      this.parts.body.getHeight() +
                      this.parts.lLeg.getHeight()) * 0.93; //parts are intersected
        this.width = this.parts.body.getWidth() + this.parts.lHand.getWidth() / (3 / 2); //hands are intersected
    }

    thruster() {
        return this.thruster;
    }

    health() {
        return this.health;
    }

    isKilled() {
        return this.isKilled;
    }

    getHeight() {
        return this.height;
    }

    move(vector) {
        this.position.add(vector);
    }

    shoot() {

    }

    moveLeft() {
        this.isWalking = true;
        this.isFacingRight = false;
        this.velocity.x = -2;
    }

    moveRight() {
        this.isWalking = true;
        this.isFacingRight = true;
        this.velocity.x = 2;
    }

    stopWalking() {
        this.isWalking = false;
        this.velocity.x = 0;
    }

    flyUp() {
        this.isFlying = true;
        this.velocity.y = -6;
    }

    stopFlying() {
        this.isFlying = false;
        this.velocity.y = 0;
    }

    draw() {
        let buffer = document.createElement('canvas');
        buffer.height = this.height * this.scale * 1.5;
        buffer.width = this.width * this.scale * 1.5;
        var bufferCtx = buffer.getContext('2d');
        buffer.fillstyle = 'green';
        bufferCtx.fillRect(0,0,buffer.width, buffer.height);

        this.parts.head.lPosition = {x : 0, y : 0}
        this.parts.body.lPosition = {x : 10 * this.scale, y : (this.parts.head.getHeight() - 10) * this.scale};
        this.parts.lLeg.lPosition = {x : 17 * this.scale, y : this.parts.body.lPosition.y + (this.parts.body.getHeight() - 15) * this.scale}
        this.parts.rLeg.lPosition = {x : (this.parts.body.getWidth() * this.scale + 5 * this.scale) / 2, y : this.parts.lLeg.lPosition.y}
        this.parts.lHand.lPosition = {x : this.scale * 17, y: this.parts.body.lPosition.y + 12 * this.scale}
        this.parts.rHand.lPosition = {x : this.parts.rLeg.lPosition.x + this.scale * 10, y : this.parts.lHand.lPosition.y}
        
        var angle = 0;
        var angularSpeed = 1;
        var rotation = 0;
        var rotationSpeed = 1;
        var maxRotation = 45;
        this.audios.walk.playbackRate = 0.5;
        this.audios.jet.volume = 0.6;
        this.audios.walk.volume = 0.5;

        this.parts.lHand.equip(new Gun(this.parts.lHand, 'uzi')); // spawn player with a gun at first
        this.parts.rHand.equip(new Gun(this.parts.rHand, 'uzi'));
        return (context) => {
            if (this.isFlying) this.audios.jet.play();
            if (!this.isWalking && !this.isFlying) angle = 0;
            else this.audios.walk.play();

            bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

            this.parts.rHand.draw(bufferCtx);
            this.parts.rLeg.rotate(bufferCtx, angle * (Math.PI / 180));
            this.parts.lLeg.rotate(bufferCtx, -1 * angle* (Math.PI / 180));

            angle += angularSpeed;
            if (angle > 10 || angle < -10) 
                angularSpeed *= -1;
            
            this.parts.body.draw(bufferCtx);
            this.parts.head.draw(bufferCtx);
            this.parts.lHand.draw(bufferCtx);

            for (var part in this.parts) {
                var bPart = this.parts[part];
                bPart.gPosition.x = this.position.x + bPart.lPosition.x;
                bPart.gPosition.y = this.position.y + bPart.lPosition.y;
            }
            
            if (!this.isFlying && this.position.y <= 499) this.velocity.add(this.gravity);

            this.position.add(this.velocity);

            if (this.isFlying) {
                if (this.velocity.x > 0) rotationSpeed = 1;
                if (this.velocity.x < 0) rotationSpeed = -1;
                if (rotation > maxRotation) rotation = maxRotation;
                if (rotation < -maxRotation) rotation = -maxRotation;
            }
            if (!this.isFlying) {  // go back smoothly
                if (rotation < 0) rotationSpeed = 1;
                if (rotation > 0) rotationSpeed = -1;
                if (rotation == 0) rotationSpeed = 0;
            }
            rotation += rotationSpeed;

            this.sprite.rotate(buffer, context,
                this.position.x, this.position.y,
                1, rotation * (Math.PI / 180), {x : 1, y : 1});
        }

    }

}

export default Entity;