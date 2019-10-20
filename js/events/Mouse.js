class Mouse {

    constructor(object) {
        this.object = object;
    }

    for(event, callback) {
        console.log(event);
        this.object.addEventListener(event, (e) => {
            console.log(e);
            callback(e);
        });
    }
}

export default Mouse;
