class Sprite {

    constructor(image) {
        this.image = image;
        this.objects = new Map();

        this.tempBuffer = document.createElement('canvas');
        this.tempCtx = this.tempBuffer.getContext('2d');
    }

    set(name, x, y, width, height) {
        let buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.getContext('2d').drawImage(this.image,
            x, y, width, height,
            0, 0, width, height);
        this.objects.set(name, buffer);
    }

    getDim(name) {
        var temp = this.objects.get(name);
        return {
            width: temp.width,
            height: temp.height
        };
    }

    setMap(json) {
        for (var key in json)
            this.set(key, json[key][0],
                json[key][1],
                json[key][2],
                json[key][3]);
    }

    draw(name, context, x, y, scale) {
        let buffer = this.objects.get(name);
        context.drawImage(
            buffer, x, y,
            buffer.width * scale, buffer.height * scale);
    }

    rotate(element, context, x, y, scale, angle, orientation) {
        let buffer = (element instanceof HTMLCanvasElement) ?
            element : this.objects.get(element);
        var coord = { // 0,0 for lefttop, 0,1 for leftcenter, 0,2 for leftbottom ...
            x: orientation.x * (buffer.width / 2) * scale,
            y: orientation.y * (buffer.height / 2) * scale
        };
        context.save();
        context.translate(x + coord.x, y + coord.y);
        context.rotate(angle);
        context.drawImage(
            buffer, -coord.x, -coord.y,
            buffer.width * scale, buffer.height * scale);
        context.restore();
    }

    flip(element) {
        this.tempBuffer.width = element.width;
        this.tempBuffer.height = element.height;
        this.tempCtx.scale(-1, 1); // horizontal flip 1, -1 for verical one
        this.tempCtx.drawImage(element,
            element.width * -1, 0,
            element.width, element.height);
        element.getContext('2d').clearRect(0, 0, element.width, element.height);
        element.getContext('2d').drawImage(this.tempBuffer, 0, 0);
    };

}

export default Sprite;