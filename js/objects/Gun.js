import Bullet from './Bullet.js';

class Gun {

    constructor(spriteName, sprite, gunData, collision) {
        this.spriteName = spriteName;  
        this.sprite = sprite;
        this.collision = collision;
        this.data = gunData[spriteName];
        this.ammo = this.data.maxAmmo;
        this.liveAmmo = this.data.maxLiveAmmo;
        this.scope = 2;
        this.isEmpty = false;
        this.hasBeenEquipped = false;
        this.isReloading = false;
        this.reloadTimer = 0;
        this.reloadSound = collision.game.audios.reload;
        this.sound = collision.game.audios[this.spriteName];
        this.sound.playbackRate = 2;
        this.scale = 0.25; // Default
        this.width = this.sprite.getDim(this.spriteName).width * this.scale;
        this.height = this.sprite.getDim(this.spriteName).height * this.scale;
        this.timeout = 0;
        this.position = {
            x : undefined,
            y : undefined
        }
    }

    setOwner(playerHand) {
        this.hand = playerHand;
        this.hasBeenEquipped = true;
        this.init();
    }

    resetOwner() {
        this.hand = undefined;
        this.hasBeenEquipped = false;
    }

    init() {
        this.scale = this.hand.scale / 1.5;
        this.width = this.sprite.getDim(this.spriteName).width * this.scale;
        this.height = this.sprite.getDim(this.spriteName).height * this.scale;
        this.lPosition = {
            x : this.hand.lPosition.x + this.width * this.data.holdingPoint.x * this.scale,
            y : this.hand.lPosition.y + this.height * this.data.holdingPoint.y * this.scale
        }
        this.position = {
            x : this.lPosition.x + this.hand.entity.position.x,
            y : this.lPosition.y + this.hand.entity.position.y
        }
    }

    getWidth() {
        return this.width;
    }

    getWidth() {
        return this.height;
    }

    shoot() {
        if (this.liveAmmo == 0 || this.timeout > 0) return;
        this.collision.bullets.push(new Bullet(this));
        this.sound.play();
        this.timeout = this.data.recoil * 1000;
        this.liveAmmo--;
    }
    
    reload() {
        if (this.liveAmmo >= this.data.maxLiveAmmo) return;
        this.isReloading = true;
        this.reloadTimer += (1 / 60);
        if (this.reloadTimer < (this.data.recoil * 5)) return;
        if (this.ammo == 0) {
            this.isEmpty = true;
            return;
        }
        this.reloadSound.play();
        let neededAmmo = this.data.maxLiveAmmo - this.liveAmmo;
        if (this.ammo < neededAmmo) {
            this.liveAmmo += this.ammo;
            this.ammo = 0;
        }
        else {
            this.liveAmmo += neededAmmo;
            this.ammo -= neededAmmo;
        }
        this.isReloading = false;
        this.reloadTimer = 0;
    }

    pickAmmo(gun) {
        if (gun) {
            if (gun.ammo ==0) return;
            let neededAmmo = this.data.maxAmmo - this.ammo;
            if (gun.ammo < neededAmmo) {
                this.ammo += gun.ammo;
                gun.ammo = 0;
            }
            else {
                this.ammo += neededAmmo;
                gun.ammo -= neededAmmo;
        }
        }
    } 

    throw() {
        this.hasBeenEquipped = false;
        this.position.x = this.hand.gPosition.x;
        this.position.y = this.hand.gPosition.y - this.height * this.scale;
        this.reloadSound.play();
        this.scale = 0.25; 
    }

    draw(context) {
        if (this.isReloading) this.reload();
        this.hand.sprite.rotate(this.spriteName, context,
            this.lPosition.x,
            this.lPosition.y,
            this.scale, this.hand.angle, {
                x: 0,
                y: 1
            });

        if (this.timeout > 0) this.timeout -= 1000 / 60;
    }

    show(context) {
        this.sprite.draw(this.spriteName, context,
            this.position.x, this.position.y,
            this.scale);
    }

}

export default Gun;