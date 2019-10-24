class Collision {

    constructor(game) {
        this.game = game;
        this.rockPolygons = [];
        this.playerPolygons = [];
        this.spans = [];

        this.playerPolygons.push(game.player);
    }


    pushRock(polygon) {
        this.rockPolygons.push(polygon);
    }

    pushPlayer(player) {
        this.playerPolygons.push(player);
    }

    pushSpan(span) {
        this.spans.push(span);
    }

    canCollide(player, rock) {
        return (player.position.x < (rock.position.x + rock.width) &&
            (player.position.x + player.width) > rock.position.x &&
            player.position.y < (rock.position.y + rock.height) &&
            (player.position.y + player.height * 0.6) > rock.position.y);
    }

    intersects(lineA, lineB) {
        var denominator, a, b, numerator1, numerator2;

        denominator = ((lineB.y2 - lineB.y1) * (lineA.x2 - lineA.x1)) - ((lineB.x2 - lineB.x1) * (lineA.y2 - lineA.y1)); // difference in slope
        if (denominator == 0) return false; // collinear

        numerator1 = ((lineB.x2 - lineB.x1) * (lineA.y1 - lineB.y1)) - ((lineB.y2 - lineB.y1) * (lineA.x1 - lineB.x1));
        numerator2 = ((lineA.x2 - lineA.x1) * (lineA.y1 - lineB.y1)) - ((lineA.y2 - lineA.y1) * (lineA.x1 - lineB.x1));

        a = numerator1 / denominator;
        b = numerator2 / denominator;

        return (a > 0 && a < 1 && b > 0 && b < 1);
    };

    check() {
        var temp = document.createElement('canvas');
        temp.width = this.game.mainBuffer.width;
        temp.height = this.game.mainBuffer.height;
        var cty = temp.getContext('2d');
        cty.strokeStyle = "#FF0000";
        this.rockPolygons.forEach(rock => {

            cty.moveTo(rock.points[0].x, rock.points[0].y);
            rock.points.forEach(point => {
                cty.lineTo(point.x, point.y);
                cty.stroke();
            });
            cty.closePath();
        })
        var temp2 = document.createElement('canvas');
        temp2.width = this.game.mainBuffer.width;
        temp2.height = this.game.mainBuffer.height;
        var cty2 = temp2.getContext('2d');

        console.log(this.game.player.lineSegments);
        return (ctx) => { // devlopment mode
            ctx.drawImage(temp, 0, 0);
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
                if (!this.game.player.isColliding()) {
                    this.game.player.collisionState = {
                        "top": false,
                        "right": false,
                        "bottom" : false,
                        //"bottom": this.game.player.collisionState.bottom && !this.game.player.isFlying,
                        "left": false
                    }
                }
                
                this.rockPolygons.forEach(rock => {
                    if (this.canCollide(player, rock)) {
                        player.getLineSegments().forEach(pline => {
                            
                            rock.getLineSegments().forEach(rline => {
                                if (this.intersects(pline, rline)) {
                                    this.game.player.collisionState[pline.i] = true;
                                    console.log("Collision at ", pline.i);
                                }
                            });
                        });

                    }
                });
                if (this.game.player.collisionState.left &&
                    this.game.player.collisionState.right)
                    this.game.player.collisionState.bottom = true;
            });
            ctx.drawImage(temp2, 0, 0);
            cty2.clearRect(0, 0, temp2.width, temp2.height);
        }
    }

}

export default Collision;