class Polygon {

    constructor() {
        this.points= [];
        this.lineSegments = [];
        this.position = {
            x : 0,
            y : 0
        }
        this.width = 0;
        this.height = 0;
        this.isPlayer = true;
        this.lines = ["top", "right", "bottom", "left"];
    }

    updatePoints() { // for bots and players
        if (!this.isPlayer) return; //static rocks dont need update
        this.points = [this.position, 
            {
                x : this.position.x + this.width * 0.2,
                y : this.position.y
            },
            {
                x : this.position.x + this.width * 0.2,
                y : this.position.y + this.height * 0.3
            },
            {
                x : this.position.x,
                y : this.position.y + this.height * 0.3
            }
        ];
        this.lineSegments = [];
        this.setLineSegments();
    }

    setDimensions(polygonObj) {
        var maxX = polygonObj.x;
        var minX = polygonObj.x;
        var maxY = polygonObj.y;
        var minY = polygonObj.y;
        polygonObj.polygon.forEach(point => {
            var pt = {
                x : point.x + polygonObj.x,
                y : point.y + polygonObj.y
            }
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            this.points.push(pt);
        });
        this.isPlayer = false;
        this.setLineSegments();
        this.position.x = minX;
        this.position.y = minY;
        this.width = Math.abs(maxX - minX);
        this.height = Math.abs(maxY - minY);
    }

    setLineSegments() {
        for (var i = 0; i < this.points.length - 1; i++) {
            this.lineSegments.push({
                x1: this.points[i].x,
                y1 : this.points[i].y,
                x2 : this.points[i + 1].x,
                y2 : this.points[i + 1].y,
                i : (this.isPlayer) ? this.lines[i] : null
            });
        }
        this.lineSegments.push({
            x1 : this.points[i].x,
            y1 : this.points[i].y,
            x2 : this.points[0].x,
            y2 : this.points[0].y,
            i : "left"
        });
    }

    getLineSegments() {
        return this.lineSegments;
    }
}

export default Polygon;