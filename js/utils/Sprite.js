class Sprite {

    constructor(image) {
        this.image = image;
        this.objects = new Map();
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
        return [temp.width, temp.height];
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

    rotate(name, context, x, y, scale, angle, orientation) {
        let buffer = this.objects.get(name);
        var coord = { // 0,0 for lefttop, 0,1 for leftcenter, 0,2 for leftbottom ...
            x: orientation.x * (buffer.width / 2),
            y: orientation.y * (buffer.height / 2)
        };
        context.save();
        context.translate(x + coord.x, y + coord.y);
        context.rotate(angle * Math.PI / 180);
        context.drawImage(
            buffer, -coord.x, -coord.y,
            buffer.width * scale, buffer.height * scale);
        context.restore();
    }
}

export default Sprite;