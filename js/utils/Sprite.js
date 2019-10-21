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
            buffer,x, y,
            buffer.width * scale, buffer.height * scale);
    }

    drawR(name, x, y,ori, scale) {
        let rBuffer = document.createElement('canvas');
        let preBuffer = this.objects.get(name);
        let dominantSide = (preBuffer.width > preBuffer.height) ? preBuffer.width : preBuffer.height;
        rBuffer.width = dominantSide;
        rBuffer.height = dominantSide;
        var rBufferCtx = rBuffer.getContext('2d');

        var orien;
        switch (ori) {
            case "left":
                orien = {
                    x: 0,
                    y: rBuffer.height / 2
                }
                break;
            case "right":
                orien = {
                    x: rBuffer.width,
                    y: rBuffer.height / 2
                }
                break;
            case "top":
                orien = {
                    x: rBuffer.width / 2,
                    y: 0
                }
                break;
            case "bottom":
                orien = {
                    x: rBuffer.width / 2,
                    y: rBuffer.height
                }
                break;
            case "center":
                orien = {
                    x: rBuffer.width / 2,
                    y: rBuffer.height / 2
                }
                break;
        }
        return (context,x, y, angle) => {
            rBuffer.width = rBuffer.width; // cool hack
            rBufferCtx.translate(rBuffer.width / 2, rBuffer.height / 2);
            rBufferCtx.rotate(angle);
            rBufferCtx.drawImage(preBuffer,
                -preBuffer.width / 2, -preBuffer.height / 2,
                 preBuffer.width, preBuffer.height);
            context.drawImage(rBuffer, x, y, preBuffer.width * scale, preBuffer.height * scale);
        }    
    }
}

export default Sprite;