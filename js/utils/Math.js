export class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    bounceX() {
        this.x *= -1;
        this.y *= -1;
    }
} 