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

    canCollide() {
        this.playerPolygons.forEach(player => {
            this.rockPolygons.forEach(rock => {
                var col = (player.position.x < (rock.position.x + rock.width) &&
                (player.position.x + player.width) > rock.position.x &&
                player.position.y < (rock.position.y + rock.height) &&
                (player.position.y + player.height * 0.6) > rock.position.y);
                console.log(col);
            })
        });
        return false;
    }

    intersects(x1, y1, x2, y2, X1, Y1, X2, Y2) {        
        var denominator, a, b, numerator1, numerator2;

        denominator = ((Y2 - Y1) * (x2 - x1)) - ((X2 - X1) * (y2 - y1)); // difference in slope
        if (denominator == 0) return false; // collinear

        numerator1 = ((X2 - X1) * (y1 - Y1)) - ((Y2 - Y1) * (x1 - X1));
        numerator2 = ((x2 - x1) * (y1 - Y1)) - ((y2 - y1) * (x1 - X1));
        
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        return (a > 0 && a < 1 && b > 0 && b < 1);
    };

    check() {
        
        return (context) => {

                
        }
    }

}

export default Collision;