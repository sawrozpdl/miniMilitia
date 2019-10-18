class Sprite {

    constructor(image, context) {
        this.image = image;
        this.context = context;
        //this.buffer = document.createElement('canvas');
    }

    draw(x, y, width, height) {
        this.context.drawImage(x, y, width, height);
    }
}

export default Sprite;