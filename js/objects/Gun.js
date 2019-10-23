class Gun {

    constructor(hand, spriteName) {
        this.hand = hand;
        this.spriteName = spriteName;
        this.damage = 0;
        this.recoil = 0;
        this.scale = this.hand.scale / 1.5;
        this.width = this.hand.sprite.getDim(this.spriteName).width;
        this.height = this.hand.sprite.getDim(this.spriteName).height;

        switch (spriteName) {
            case "ak47":
                this.damage = 8;
                this.recoil = 1;
                break;
            case "m16":
                this.damage = 5;
                this.recoil = 0.5;
                break;
            case "uzi":
                this.damage = 5;
                this.recoil = 0.3;
                break;
            case "pistol":
                this.damage = 10;
                this.recoil = 1.5;
                break;
        }
    }

    getWidth() {
        return this.width;
    }

    getWidth() {
        return this.height;
    }

    shoot() {

    }

    draw(context) {
        this.hand.sprite.rotate(this.spriteName, context,
            this.hand.lPosition.x + this.width * 0.5 * this.scale,
            this.hand.lPosition.y - this.height * 0.4 * this.scale,
            this.scale, this.hand.angle, {
                x: 0,
                y: 1
            });
    }

}

export default Gun;