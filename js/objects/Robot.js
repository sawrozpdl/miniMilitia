import Entity from './Entity.js';

class Robot extends Entity {

    constructor(sprite, spriteData, position) {
        super(sprite, spriteData, position);

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