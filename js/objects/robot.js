import Entity from './entity.js';

class Robot extends Entity {

    constructor(params) {
        super(params.sprite, 'bot', params.position, params.mouse, params.scale, params.audios);
        this.isBot = true;
        this.gravity = 0;
        this.enemyDistance = 0;
        this.roamingDistance = this.genRandom(200, 300);
        this.dthruster = 0;
        this.rotation = 0;
        this.difficulty = params.difficulty;
        this.resolved = true;
        this.timer = 0;
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
        if (this.position.y < 400 || this.hasRockAbove()) {
            if (this.isFacingRight && !this.hasRockRight()) {
                this.moveRight();
                return;
            }
            else if ((!this.isFacingRight && !this.hasRockLeft())) {
                this.moveLeft();
                return;
            }
            else this.resolveWay();
        }
        this.position.y -= 2;
    }

    resolveWay() {
        if (this.isFacingRight) {
            this.position.x--;
            if (this.hasRockAbove()) this.position.y++;
            else this.position.y--;
            if (this.timer >= 2) {
                this.resolved = true;
                this.timer = 0;
            }
            this.timer += 1 / 60;
        }
        else {
            this.position.x++;
            if (this.hasRockAbove()) this.position.y++;
            else this.position.y--;
            if (this.timer >= 2) {
                this.resolved = true;
                this.timer = 0;
            }
            this.timer += 1 / 60;
        }
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
        this.position.x += 2;
    }

    moveDown() {
        if (this.position.y > 980 || this.hasRockBelow()) {
            if (this.isFacingRight && !this.hasRockRight()) {
                this.moveRight();
                return;
            }
            else if ((!this.isFacingRight && !this.hasRockLeft())) {
                this.moveLeft();
                return;
            }
            else this.resolveWay();
        }
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
            if ((this.enemyHeight > 0) && (this.enemyHeight > this.roamingDistance * 1.2))
                this.moveDown();
            else if ((this.enemyHeight < 0) && (Math.abs(this.enemyHeight) > this.roamingDistance * 1.2))
                this.moveUp();
            else if ((Math.random() < (0.03 * this.difficulty)) && !this.enemy.isKilled) {
                this.stop();
                this.shoot();
            }
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
            this.enemyHeight = (this.enemy.position.y - this.position.y);
            defaultCallback(context);
            if (this.resolved) this.killEnemy();
            else this.resolveWay();

            this.resolveCollisions();
        }
    }

}

export default Robot;