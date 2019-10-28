class Overlay {

    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.sprite = game.sprite;
        this.canvas = game.canvas;
        this.context = game.mainContext;
        this.lHand = game.player.parts.lHand;
        this.rHand = game.player.parts.rHand;
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 3;
        console.log(game.player.parts.lHand.equippedGun);
    }

    drawHealth() {
        this.sprite.draw('health', this.context, 50, 50, 0.7);
        this.context.strokeRect(135, 70, 300, 20);
        this.context.fillStyle = '#7676FF';
        this.context.fillRect(137, 72, 296 * (this.player.health / 100), 16); 
    }

    drawThruster() {
        this.sprite.draw('thruster', this.context, 50, 130, 0.7);
        this.context.strokeRect(135, 145, 300, 20);
        this.context.fillStyle = '#FF4706';
        this.context.fillRect(137, 147, 296 * (this.player.thruster / 100), 16); 
    }

    drawGun() {
        this.context.strokeRect(700, 60, 200, 100);
        this.context.strokeRect(920, 60, 200, 100);
        this.context.fillStyle = 'rgba(0,0,0,0.3)';
        this.context.fillRect(703, 63, 195, 95);
        this.context.fillRect(923, 63, 195, 95);
        this.context.fillStyle = 'white';
        this.context.font = '15px militia';
        if (this.lHand.equippedGun) {
            this.sprite.draw(this.lHand.equippedGun.spriteName, this.context,  755, 80, 0.6);
            this.context.fillText(this.lHand.equippedGun.liveAmmo, 720, 150);
            this.context.fillText(this.lHand.equippedGun.ammo, 840, 150);
        }
        if (this.rHand.equippedGun) {
            this.sprite.draw(this.rHand.equippedGun.spriteName, this.context, 965, 80, 0.6);
            this.context.fillText(this.rHand.equippedGun.liveAmmo, 935, 150);
            this.context.fillText(this.rHand.equippedGun.ammo, 1055, 150);
        }   
    }


    drawStatus() {
        this.context.font = "30px militia";
        this.context.fillStyle = 'white';
        this.context.fillText(`Kills : ${this.game.playerKills}`, 1250, 80);
        this.context.fillText(`Scope : ${this.game.gameScope} X`, 1550, 80);
        this.sprite.draw(this.game.playerType + "-head", this.context, 2000, 40, 0.5);
        this.context.fillText(`x  ${this.game.remLives}`, 2080, 80);
    }

    showGameOver() {

    }

    requestRespawn() {
        this.game.respawnPlayer();
    }


    show() {
        return () => {
            if (!this.game.gameOver) {
                if (!this.game.player.hasDied) {
                    this.drawHealth();
                    this.drawThruster();
                    this.drawGun();
                    this.drawStatus();
                }
                else {
                    if (this.game.numLives == 0) this.showGameOver();
                    else this.requestRespawn();
                }
            }
            else {
                this.showGameOver();
            }
        }
    }
}

export default Overlay;