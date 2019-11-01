class Mouse {

    constructor(object) {
        this.object = object;
    }

    for(event, callback) {
        window.addEventListener(event, (e) => {
            callback(e);
        });
    }
}

export default Mouse;
