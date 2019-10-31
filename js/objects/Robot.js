import Entity from './Entity.js';

class Robot extends Entity {

    constructor(params) {
        super(params.sprite, 'bot', params.position, params.mouse, params.scale, params.audios);
        this.isBot = true;
        this.gravity = 0;
        this.enemyDistance = 0;
        this.roamingDistance = this.genRandom(20, 320);
        this.dthruster = 0;
        this.rotation = 0;
        this.difficulty = params.difficulty;
    }

    stopFlying() {
        this.velocity.y = 0;
    }

    genRandom(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min); 
    }

    setEnemy(player) {
        this.enemy = player;
    }

    moveUp() {
        if (this.position.y < 200) return;
        if (this.hasRockAbove()) {
            return;
        }
        this.position.y -= 2;
    }

    moveLeft() {
        if (this.hasRockLeft()) {
            if (!this.hasRockAbove()) this.moveUp();
            else this.moveDown();
        }
        this.position.x -= 2;
    }

    moveRight() {
        if (this.hasRockRight()) {
            if (!this.hasRockAbove()) this.moveUp();
            else this.moveDown();
        }
        if (!this.hasRockBelow()) {
            this.moveUp();
        }
        this.position.x += 2;
    }

    moveDown() {
        if (this.hasRockBelow()) return;
        this.position.y += 2;
    }

    stop() {
        if (this.isKilled) return;
        this.velocity.y = 0;
        this.velocity.x = 0;
    }

    init() {
        this.spawn();
        this.isFlying = true;
        this.killEnemy();
    }

    killEnemy() { 
        if ((this.enemyDistance < this.roamingDistance)) { 
            if ((Math.random() < (0.05 * this.difficulty)) && !this.enemy.isKilled) this.shoot();
            this.stop();
            return;
        }
        if (this.isFacingRight) this.moveRight();
        else this.moveLeft();
    }

    die() {
        if (this.parts.lHand.equippedGun) this.parts.lHand.equippedGun.liveAmmo = 0;
        this.throwGuns();
    }

    draw() {
        var defaultCallback = super.draw();
        return (context) => {
            this.isFacingRight = this.position.x < this.enemy.position.x;
            this.enemyDistance = (this.position.x - this.enemy.position.x) * ((this.isFacingRight) ? -1 : 1);
            defaultCallback(context);
            this.killEnemy();
        }
    }

}

export default Robot;