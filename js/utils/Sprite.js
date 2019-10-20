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
            buffer,x, y,
            buffer.width * scale, buffer.height * scale);
    }
}

export default Sprite;