class Collision {

    constructor(game) {
        this.game = game;
        this.rockPolygons = [];
        this.playerPolygons = [];
        this.spans = [];

        this.playerPolygons.push(game.player);
        
        this.state = [];

        this.showDev = false;
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

    contains(point, vs) {
        var x = point.x, y = point.y;
    
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].x, yi = vs[i].y;
            var xj = vs[j].x, yj = vs[j].y;
    
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    
        return inside;
    };


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
            
            this.playerPolygons.forEach(player => {
                this.state = [];
                this.rockPolygons.forEach(rock => {
                    if (this.canCollide(player, rock)) {  
                        player.points.forEach(point => {
                            if (this.contains(point, rock.points))
                                this.state.push(point.i);
                        });
                        //console.log(this.state);
                        player.cstate = this.state;
                        return;
                    }
                });
            });
        }
    }
}

export default Collision;