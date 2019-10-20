class Layers {

    constructor(context) {
        this.context = context;

        this.layers = [];
    }

    push(layer) {
        this.layers.push(layer); // layer should be pushed in the order it needs to be drawn
    }

    draw() {
        this.layers.forEach(layer => {
            layer(this.context); // draw on the context
        }); 
    }
}

export default Layers;