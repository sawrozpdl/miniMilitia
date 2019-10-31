class Overlay {

    constructor(game) {
        this.game = game;
        this.init();
    }

    init() {
        this.player = this.game.player;
        this.sprite = this.game.sprite;
        this.canvas = this.game.canvas;
        this.context = this.game.mainContext;
        this.lHand = this.game.player.parts.lHand;
        this.rHand = this.game.player.parts.rHand;
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 3;
        this.timer = 0;
    }

    drawHealth() {
        this.sprite.draw('health', this.context, 50, 50, 0.7);
        this.context.strokeRect(135, 70, 300, 20);
        this.context.fillStyle = '#7676FF';
        this.context.fillRect(137, 72, 296 * (this.player.health / this.player.maxHealth), 16); 
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
            if (this.lHand.equippedGun.isReloading) this.context.fillText((Math.random() < 0.5) ? "+" : "x", 620, 150);
            else this.context.fillText(this.lHand.equippedGun.liveAmmo, 620, 150);
            this.context.fillText(this.lHand.equippedGun.ammo, 740, 150);
        }
        if (this.rHand.equippedGun) {
            this.sprite.draw(this.rHand.equippedGun.spriteName, this.context, 865, 80, 0.6);
            if (this.rHand.equippedGun.isReloading) this.context.fillText((Math.random() < 0.5) ? "+" : "x", 835, 150);
            else this.context.fillText(this.rHand.equippedGun.liveAmmo, 835, 150);
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
        var gameOver = this.game.images.gameOver;
        this.context.fillStyle = 'rgba(0,0,0,0.8)';
        this.context.fillRect(0, 0, this.game.GAME_WIDTH, this.game.GAME_HEIGHT);
        this.context.drawImage(gameOver, (this.game.GAME_WIDTH - gameOver.width) / 2, (this.game.GAME_HEIGHT - gameOver.height) / 3);
        this.context.fillStyle = 'white';
        this.context.fillText(`Kills : ${this.game.playerKills}`, 1200, 90);
        this.context.fillText(`Score : ${this.game.playerScore}`, 1500, 90);
        this.context.fillText("Press Enter to try again", this.game.GAME_WIDTH / 2.65, this.game.GAME_HEIGHT - 300);
        if (this.game.playerScore > this.game.highScore) {
            localStorage.setItem('highScore', this.game.playerScore);
            this.game.highScore = this.game.playerScore;
        }
        this.context.fillText(`HighScore : ${this.game.highScore}`, 830, 200);
        this.game.gameOver = true;
    }

    requestRespawn() {
        this.game.respawnPlayer();
    }

    nextLife() {
        this.timer += (1 / 60);
        this.sprite.draw(this.game.playerType + "-head", this.context, 2000, 70, 0.5);
        this.context.fillStyle = 'rgba(0,0,0,0.8)';
        this.context.fillRect(0, 0, this.game.GAME_WIDTH, this.game.GAME_HEIGHT);
        this.context.fillStyle = 'white';
        this.context.fillText(`x  ${this.game.remLives}`, 2080, 110);
        this.context.fillText('You were Killed!', 930, 360);
        this.context.fillText(`Respawning in  ${Math.floor(6 - this.timer)} Seconds`, 830, 450);

        if (this.timer < 5) return;
        else {
            this.requestRespawn();
            this.timer = 0;
        }
    }

    show() {
        return () => {
            if (!this.game.gameOver) {
                if (this.game.gameStarted) {
                    this.drawHealth();
                    this.drawThruster();
                    this.drawGun();
                    this.drawStatus();
                }
                else {
                    if (this.game.remLives < 0) this.showGameOver();
                    else {
                        this.nextLife();
                    }
                }
            }
            else {
                this.showGameOver();
            }
        }
    }
}

export default Overlay;