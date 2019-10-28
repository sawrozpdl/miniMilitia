import Entity from './Entity.js';

class Robot extends Entity {

    constructor(sprite, position, mouse, scale, audios) {
        super(sprite, 'bot', position, mouse, scale, audios);
        this.isBot = true;
        this.isFlying = true;
        this.dthruster = 0;
    }

    setEnemy(player) {
        this.enemy = player;
    }

    stopFlying() {
        this.velocity.y = 0;
    }

    stopMoving() {
        this.velocity.x = 0;
    }

    moveTopLeft() {
        if (this.position.y <= 0) this.stopFlying();
        else this.flyUp();
        this.moveLeft();
    }

    moveTopRight() {
        if (this.position.y <=0) this.stopFlying();
        else this.flyUp();
        this.moveRight();
    }

    flyDown() {
        if (this.hasRockBelow) return;
        this.velocity.y = 4;
    }

    init() {
        this.mouse = this.enemy.position;
        this.parts.lHand.mouse = this.mouse;
        this.parts.rHand.mouse = this.mouse;
        this.spawn();
        this.killEnemy();
    }

    killEnemy() {
        // AI
    }
}

export default Robot;