class Layers {

    constructor(context) {
        this.context = context;

        this.layers = [];
    }

    setContext(context) {
        this.context = context;
    }

    setCamera(camLayer) {
        this.camera = camLayer;
    }

    setOverlay(overlay) {
        this.overlay = overlay;
    }

    push(layer) {
        this.layers.push(layer); // layer should be pushed in the order it needs to be drawn
    }

    pop() {
        this.layers.pop();
    }

    draw() {
        this.layers.forEach(layer => {
            layer(this.context); // draw on the context
        }); 
        if (this.camera)
            this.camera(this.context);
        if (this.overlay)
            this.overlay(); 
    }
    
}

export default Layers;