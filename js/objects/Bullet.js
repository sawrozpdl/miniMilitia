class Bullet {

    constructor(gun) {
        this.gun = gun;
        this.hasHit = false;
        this.game = gun.collision.game;
        this.player = this.game.player;
        this.image = this.game.images.bullet;
        this.recoil = this.gun.data.recoil;
        this.damage = this.gun.data.damage;
        this.faceRight = this.gun.hand.entity.isFacingRight;
        this.c = 0;
        this.size = 0.7;
        this.angle = this.gun.hand.angle;
        this.origin = {
            x : this.player.position.x + (this.player.width * this.player.scale) * ((this.faceRight) ? 0.5 : 0),
            y : this.player.position.y + (this.player.height * this.player.scale / 5) 
        }
        this.position = {
            x : undefined,
            y : undefined
        }
        this.width = this.image.width * this.size;
        this.height = this.image.height * this.size;
    }

    update() {
        this.position.x = this.origin.x + this.c * Math.cos(this.angle) * ((this.faceRight) ? 1 : -1);
        this.position.y = this.origin.y + this.c * Math.sin(this.angle);

        if (!this.hasHit) this.game.sprite.rotate(this.image, this.game.context,
            this.position.x, this.position.y,
            this.size, this.angle, {x : 0, y : 1});
        this.c += this.recoil * 50;
    }
}

export default Bullet;