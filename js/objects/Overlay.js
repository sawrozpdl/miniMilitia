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
        this.context.strokeRect(600, 60, 200, 100);
        this.context.strokeRect(820, 60, 200, 100);
        this.context.fillStyle = 'rgba(0,0,0,0.3)';
        this.context.fillRect(603, 63, 195, 95);
        this.context.fillRect(823, 63, 195, 95);
        this.context.fillStyle = 'white';
        this.context.font = '15px militia';
        if (this.lHand.equippedGun) {
            this.sprite.draw(this.lHand.equippedGun.spriteName, this.context,  655, 80, 0.6);
            this.context.fillText(this.lHand.equippedGun.liveAmmo, 620, 150);
            this.context.fillText(this.lHand.equippedGun.ammo, 740, 150);
        }
        if (this.rHand.equippedGun) {
            this.sprite.draw(this.rHand.equippedGun.spriteName, this.context, 865, 80, 0.6);
            this.context.fillText(this.rHand.equippedGun.liveAmmo, 835, 150);
            this.context.fillText(this.rHand.equippedGun.ammo, 955, 150);
        }   
    }

    drawStatus() {
        this.context.font = "25px militia";
        this.context.fillStyle = 'white';
        this.context.strokeRect(1188, 57, 600, 101);
        this.context.fillStyle = 'rgba(0,0,0,0.3)';
        this.context.fillRect(1191, 60, 595, 95);
        this.context.fillStyle = 'white';
        this.context.fillText(`Kills : ${this.game.playerKills}`, 1200, 90);
        this.context.fillText(`Score : ${this.game.playerScore}`, 1500, 90);
        this.context.fillText(`Armour : ${this.game.player.armourLevel}`, 1200, 140);
        this.context.fillText(`Scope : ${this.game.gameScope} X`, 1500, 140);
        this.sprite.draw(this.game.playerType + "-head", this.context, 2000, 70, 0.5);
        this.context.fillText(`x  ${this.game.remLives}`, 2080, 110);
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