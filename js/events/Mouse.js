class Mouse {

    constructor(object) {
        this.object = object;
    }

    for(event, callback) {
        this.object.addEventListener(event, (e) => {
            callback(e);
        });
    }
}

export default Mouse;
