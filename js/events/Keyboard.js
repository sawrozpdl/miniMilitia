class Keyboard {

    constructor() {
        this.keyMap = new Map();
        this.keyState = new Map();

        ['keyup', 'keydown'].forEach(item => {
            window.addEventListener(item, (event) => {
                this.handleClick(event);
            });
        });
    }

    handleClick(event) {
        const keyCode = event.keyCode;
        if (!this.keyMap.has(keyCode))
            return;
        event.preventDefault();

        const state = (event.type == 'keydown') ? 1 : -1;

        if (state == this.keyState.get(keyCode)) {
            console.log("equal");
            return
        }
            

        this.keyState.set(keyCode, state);

        this.keyMap.get(keyCode)(event);
    } 

    for(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

}

export default Keyboard;