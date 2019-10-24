class Polygon {

    constructor() {
        this.points= [];
        this.position = {
            x : 0,
            y : 0
        }
        this.width = 0;
        this.height = 0;
        this.isPlayer = true;
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
        this.position.x = minX;
        this.position.y = minY;
        this.width = Math.abs(maxX - minX);
        this.height = Math.abs(maxY - minY);
        this.isPlayer = false;
    }
}

export default Polygon;