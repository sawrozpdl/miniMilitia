import Head from "./Head.js";
import Hand from "./Hand.js";
import Body from "./Body.js";
import Leg from "./Leg.js";
import {Vector} from '../utils/Math.js';
import Gun from "./Gun.js";
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
        this.isLimited = false; // timespan infinite if not killed
        this.parts = {
            head : new Head(this),
            lHand : new Hand(this, true),
            rHand : new Hand(this, false),
            body : new Body(this),
            lLeg : new Leg(this, true),
            rLeg : new Leg(this, false)
        }
    }

    spawn() {
        this.isKilled = false;
        this.thruster = 100;
        this.health = 100;
        this.dthruster = 1;
        this.dhealth = 0.5;
        this.isFacingRight = true;
        this.isWalking = false;
        this.isFlying = false;
        this.isShifted = false;
        this.velocity = new Vector(0, 0);
        this.gravity = 0.3;
        this.collisionState = {
            "top" : false,
            "right" : false,
            "bottom" : false,
            "left" : false
        }
        this.height = (this.parts.head.getHeight() + 
                      this.parts.body.getHeight() +
                      this.parts.lLeg.getHeight()) * 0.93; //parts are intersected

        this.parts.lHand.equip(new Gun(this.parts.lHand, (Math.random() < 0.5) ? 'pistol' : 'uzi')); // spawn player with a gun at first
        this.parts.rHand.equip(new Gun(this.parts.rHand, (Math.random() < 0.5) ? 'pistol' : 'uzi')); // REMOVE
        
        this.width = this.parts.body.getWidth() + this.parts.lHand.getWidth() / (3 / 2); //hands are intersected
        this.setConfigs();
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
        this.velocity.x = -2;
    }

    moveRight() {
        this.isWalking = true;
        this.velocity.x = 2;
    }

    stopWalking() {
        this.isWalking = false;
        this.velocity.x = 0;
    }

    flyUp() {
        this.isFlying = true;
        this.velocity.y = -4; //fix this
    }

    stopFlying() {
        this.isFlying = false;
        this.velocity.y = 0;
    }

    pushUp() {
        this.position.y -= 2;
    }

    isColliding() {
        return this.collisionState.top ||
                this.collisionState.right ||
                this.collisionState.bottom ||
                this.collisionState.left 
    }

    

    draw() {
        let buffer = document.createElement('canvas');
        buffer.height = this.height * this.scale * 1.5;
        buffer.width = this.width * this.scale * 1.5;
        var bufferCtx = buffer.getContext('2d');
        buffer.fillstyle = 'green'; //  REMOVE
        bufferCtx.fillRect(0,0,buffer.width, buffer.height); // REMOVE

        this.parts.head.lPosition = {x : 0, y : 0}
        this.parts.body.lPosition = {x : 10 * this.scale, y : (this.parts.head.getHeight() - 10) * this.scale};
        this.parts.lLeg.lPosition = {x : 17 * this.scale, y : this.parts.body.lPosition.y + (this.parts.body.getHeight() - 15) * this.scale}
        this.parts.rLeg.lPosition = {x : (this.parts.body.getWidth() * this.scale + 5 * this.scale) / 2, y : this.parts.lLeg.lPosition.y}
        this.parts.lHand.lPosition = {x : this.scale * 17, y: this.parts.body.lPosition.y + 12 * this.scale}
        this.parts.rHand.lPosition = {x : this.parts.rLeg.lPosition.x + this.scale * 10, y : this.parts.lHand.lPosition.y}
        
        this.updatePoints();

        return (context) => {
            this.isFacingRight = (this.position.x % 1366) < this.mouse.x;
            if (this.isFlying) this.audios.jet.play();
            if (!this.isWalking && !this.isFlying) this.angle = 0;
            else this.audios.walk.play();

            
            bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

            this.parts.rHand.draw(bufferCtx);
            this.parts.rLeg.rotate(bufferCtx, this.angle * (Math.PI / 180));
            this.parts.lLeg.rotate(bufferCtx, -1 * this.angle* (Math.PI / 180));

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

            if (this.collisionState.bottom) {
                this.velocity.y = -this.gravity;
            }
            if (this.isFlying) this.gravity = 0;
            else this.gravity = 0.3;
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
            // if (!this.isFacingRight && !this.isShifted) {
            //     this.position.x -= this.width * this.scale * 0.8;
            //     this.isShifted = true;
            // }
            // if (this.isFacingRight && this.isShifted) {
            //     this.position.x += this.width * this.scale * 0.8;
            //     this.isShifted = false;   
            // }
            this.updatePoints();
            this.sprite.rotate(buffer, context,
                this.position.x, this.position.y,
                1, this.rotation * (Math.PI / 180), {x : 1, y : 1});

        }

    }

}

export default Entity;