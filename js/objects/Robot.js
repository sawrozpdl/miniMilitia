import Entity from '/js/objects/Entity.js';

class Robot extends Entity {

    constructor(sprite, spriteData, position) {
        super(sprite, spriteData, position);

        this.player = null;
        this.isBot = true;
    }

    chasePlayer(player) {
        this.player = player;
    }

    findPlayer() {

    }

    moveToPlayer() {

    }

    shootPlayer() {

    }
}

export default Robot;