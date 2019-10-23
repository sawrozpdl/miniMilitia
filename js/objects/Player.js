import Entity from "/js/objects/Entity.js";

class Player extends Entity {

    constructor(sprite, spriteData, position, mouse, scale, audio) {
        super(sprite, spriteData, position, mouse, scale, audio);

        this.health = super.health * 2;
        this.isBot = false;
    }
    

    punch() {
        if (this.isTurningLeft)
            this.lHand.punch();
        else 
            this.rHand.punch();
    }

    pickWeapn() {

    }

    switchWeapon() {

    }

    dropWeapon() {
        
    }

    
}

export default Player;