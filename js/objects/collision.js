class Collision {

    constructor(game) {
        this.game = game;
        this.rockPolygons = [];
        this.playerPolygons = [];
        this.guns = [];
        this.powerUps = [];
        this.playerPolygons.push(game.player);
        this.mainPlayer = game.player;
        this.state = [];
        this.bullets = [];
        this.showDev = false;
        this.timer = 0;
    }


    pushRock(polygon) {
        this.rockPolygons.push(polygon);
    }

    pushPlayer(player) {
        this.playerPolygons.push(player);
    }


    canCollide(player, object) {
        return (player.position.x < (object.position.x + object.width) &&
            (player.position.x + player.width) > object.position.x &&
            player.position.y < (object.position.y + object.height) &&
            (player.position.y + player.height * 0.6) > object.position.y);
    }

    touches(player, gun) {
        return (player.position.x < (gun.position.x + gun.width * gun.scale) &&
            (player.position.x + player.width * 0.25) > gun.position.x &&
            player.position.y < (gun.position.y + gun.height * gun.scale) &&
            (player.position.y + player.height * 0.3) > gun.position.y);
    }

    hits(player, bullet) {
        return (player.position.x < (bullet.position.x + bullet.width*bullet.size) &&
            (player.position.x + player.width * 0.25) > bullet.position.x &&
            player.position.y < (bullet.position.y + bullet.height*bullet.size) &&
            (player.position.y + player.height * 0.3) > bullet.position.y);
    }

    contains(point, points) {
        let x = point.x;
        let y = point.y;
        let isInside = false;
        let x1, y1, x2, y2;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            x1 = points[i].x,
            y1 = points[i].y;
            x2 = points[j].x,
            y2 = points[j].y;
            if ((y1 > y) == (y2 > y)) continue; // we need only the required lines to check 
            if ((x < (x2 - x1) * (y - y1) / (y2 - y1) + x1))   // y - y1 = M (x - x1)
                 isInside = !isInside;
        }
        return isInside;
    }

    setCollisionState() {
        let c = 0;
        this.playerPolygons.forEach(player => {
            if (!player.isKilled) {
                if (player.isBot) player.draw()(this.game.context);
                if (player.isBot && player.enemy.isKilled) {
                    player.enemy = this.mainPlayer;
                }
                this.state = [];
                this.rockPolygons.forEach(rock => {
                    if (this.canCollide(player, rock)) {
                        player.points.forEach(point => {
                            if (this.contains(point, rock.points))
                                this.state.push(point.i);
                        });
                        // console.log(this.state);
                        player.cstate = this.state;
                    }
                });
                c++;
            } else if (player.isBot) {
                this.game.audios.dead.play();
                this.playerPolygons.splice(c, 1);
                this.game.botCount--;
                this.game.playerKills++;
                this.game.playerScore += 20;
                c++;
            } else if (this.game.gameStarted){
                this.game.audios.dead.play();
                this.game.remLives--;
                this.game.gameStarted = false;
            }
        });
    }


    check() {
        var temp = document.createElement('canvas');
        var cty = temp.getContext('2d');
        var temp2 = document.createElement('canvas');
        var cty2 = temp2.getContext('2d');
        temp.width = this.game.mainBuffer.width;
        temp.height = this.game.mainBuffer.height;
        cty.strokeStyle = "#FF0000";
        this.rockPolygons.forEach(rock => {

            cty.moveTo(rock.points[0].x, rock.points[0].y);
            rock.points.forEach(point => {
                cty.lineTo(point.x, point.y);
                cty.stroke();
            });
            cty.closePath();
            cty.stroke();
        })
        temp2.width = this.game.mainBuffer.width;
        temp2.height = this.game.mainBuffer.height;

        return (context) => {
            let i = 0;
            this.bullets.forEach(bullet => {
                bullet.update();
                this.playerPolygons.forEach(player => {
                    if (player == bullet.player) return;
                    else if (bullet.player.isBot && player.isBot && (bullet.player.enemy != player)) return;
                    if (this.hits(player, bullet)) {
                        bullet.hasHit = true;
                        player.getShot(bullet);
                    }
                });
                this.rockPolygons.forEach(rock => {
                    if (this.contains(bullet.position, rock.points)) { // OPT
                        bullet.hasHit = true;
                    }
                });
                if (bullet.hasHit) this.bullets.splice(i, 1);
                i++;
            });

            this.game.canEquip = null;
            this.guns.forEach(gun => {
                if (!gun.hasBeenEquipped) {
                    gun.show(this.game.context);
                    if (this.touches(this.mainPlayer, gun)) {
                        this.game.canEquip = gun;
                    }
                    if (!gun.hasSettled) {
                        gun.velocity += gun.gravity;
                        gun.position.y += gun.velocity;
                        this.rockPolygons.forEach(rock => {
                            if (this.canCollide(rock, gun)) {
                                if (this.contains(gun.centerPoint, rock.points)) { // OPT
                                    gun.hasSettled = true;
                                    gun.velocity = 0;
                                }
                            }
                        });
                    }

                }
            });

            let k = 0;
            this.powerUps.forEach(powerUp => {
                if (!powerUp.isActive) {
                    this.powerUps.splice(k++, 1);
                } else {
                    powerUp.show();
                    if (this.touches(this.mainPlayer, powerUp)) {
                        this.game.player.pickPowerup(powerUp);
                        this.game.playerScore += 20;
                        this.game.audios.switch.play();
                        powerUp.despawn();
                    }
                    k++;
                }
            });

            if (this.showDev) {
                context.drawImage(temp, 0, 0);
                temp2.width = temp2.width;
                cty2.strokeStyle = "#FF0000";
                this.playerPolygons.forEach(player => {
                    cty2.moveTo(player.points[0].x, player.points[0].y);
                    player.points.forEach(point => {
                        cty2.lineTo(point.x, point.y);
                        cty2.stroke();
                    });
                    cty2.closePath();
                    cty2.stroke();
                    context.drawImage(temp2, 0, 0);
                    cty2.clearRect(0, 0, temp2.width, temp2.height);
                });
            }

            this.setCollisionState();

            if (!(Math.floor(this.timer) % 5)) {
                if (this.game.botCount < 3) {
                    this.game.genBots();
                }
            }

            if (this.game.botCount > 3) {
                this.playerPolygons[2].setEnemy(this.playerPolygons[4]);
                this.playerPolygons[4].setEnemy(this.playerPolygons[2]);
            }

            if (this.timer > 45) {
                let c = 0;
                this.guns.forEach(gun => {
                    if (!gun.hasBeenEquipped) {
                        this.guns.splice(c, 1);
                        c++;
                    } else c++;
                });
                for (c = 0; c < this.powerUps.length; c++) {
                    this.powerUps.splice(c, 1);
                }
                this.game.genGuns();
                this.game.genPowerups();
                this.timer = 0;
            }
            this.timer += (1 / 60);
        }
    }

}

export default Collision;