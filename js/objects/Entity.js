import Head from "/js/objects/Head.js";
import Hand from "/js/objects/Hand.js";
import Body from "/js/objects/Body.js";
import Leg from "/js/objects/Leg.js";

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
        this.thruster = 20;
        this.health = 20;
        this.isFacingRight = true;

        this.head = new Head(this);
        this.lHand = new Hand(this, true);
        this.rHand = new Hand(this, false);
        this.body = new Body(this);
        this.lLeg = new Leg(this, true);
        this.rLeg = new Leg(this, false);

        this.height = (this.head.getHeight() + 
                      this.body.getHeight() +
                      this.lLeg.getHeight()) * 0.93; //parts are intersected
        this.width = this.body.getWidth() + this.lHand.getWidth() / (3 / 2); //hands are intersected
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

    turnAround() {
        this.isFacingRight = !this.isFacingRight;
    }

    draw() {
        let buffer = document.createElement('canvas');
        buffer.height = this.height * this.scale;
        buffer.width = this.width * this.scale;
        buffer.fillstyle = 'green';

        //buffer.getContext('2d').fillRect(0,0,buffer.width, buffer.height);

        var body = {x : 10 * this.scale, y : (this.head.getHeight() - 10) * this.scale};
        var lleg = {x : 17 * this.scale, y : body.y + (this.body.getHeight() - 10) * this.scale}
        var rleg = {x : (this.body.getWidth() * this.scale + 5 * this.scale) / 2, y : lleg.y}
        var lhand = {x : this.scale * 15, y: body.y + 10 * this.scale}
        var rhand = {x : rleg.x + this.scale * 10, y : lhand.y}
        
        var speed = 1;
        var angle = 10 * speed;
        return (context) => {
            buffer.getContext('2d').clearRect(0, 0, buffer.width, buffer.height);
            this.rHand.draw(buffer.getContext('2d'), rhand.x, rhand.y);


            this.rLeg.rotate(buffer.getContext('2d'), rleg.x, rleg.y, angle * (Math.PI / 180));
            this.lLeg.rotate(buffer.getContext('2d'), lleg.x, lleg.y, -1 * angle * (Math.PI / 180));
            if (this.position.x % 12 == 0) {
                angle *= -1;
            }
            this.body.draw(buffer.getContext('2d'), body.x, body.y);
            this.head.draw(buffer.getContext('2d'), 0, 0);
            this.lHand.draw(buffer.getContext('2d'), lhand.x, lhand.y);

            this.lHand.position = {x : this.position.x + lhand.x, y : this.position.y + lhand.y};
            this.rHand.position = {x : this.position.x + rhand.x, y : this.position.y + rhand.y};

            if (this.position.x > 1000 || this.position.x < 300)
                speed *= -1;
            this.position.x += speed;
            context.drawImage(buffer, this.position.x, this.position.y);
        }

    }
    
}

export default Entity;