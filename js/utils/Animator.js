class Animator {

    constructor(frameLimit) {
        this.frameLimit = frameLimit;
        this.callback = undefined;
        this.timeOffset = 0;
        this.previousTime = 0;

        // 1 / FrameLimit gives time gap between 2 frames
        this.update = (time) => {
            this.timeOffset += (time - this.previousTime) / 1000; // ms to s
            while (this.timeOffset > (1 / this.frameLimit)) {  // greater than dt
                this.callback();  // multiple callbacks for syncing with the one with 60fps
                this.timeOffset -= (1 / this.frameLimit); 
            }
            this.previousTime = time;
            console.log("helo");
            requestAnimationFrame(this.update);
            //setTimeout(this.update, 1000 / 15, performance.now()); // simulation
        }
    }

    animate() {
        requestAnimationFrame(this.update);
        //setTimeout(this.update, 1000 / 15, performance.now());
    }

    
}

export default Animator;
