class Keyboard {

    constructor() {
        this.keyMap = new Map();
        this.keyState = new Map();
        window.addEventListener('keydown', (event) => {
            this.handleDown(event);
        });
        window.addEventListener('keyup', (event) => {
            this.handleUp(event);
        });
    }

    handleDown(event) {
        const keyCode = event.keyCode;
        if (!this.keyMap.has(keyCode))
            return;
        if (!this.keyState.get(keyCode)) return;
        event.preventDefault();
        this.keyMap.get(keyCode)[0](event);
        this.keyState.set(keyCode, false);
    } 

    handleUp(event) {
        const keyCode = event.keyCode;
        if (!this.keyMap.has(keyCode))
            return;
        event.preventDefault();
        this.keyMap.get(keyCode)[1](event);

    }

    for(keyCode, callbackDown, callbackUp) {
        this.keyMap.set(keyCode, [callbackDown, callbackUp]);
        this.keyState.set(keyCode, true);
    }

}

export default Keyboard;