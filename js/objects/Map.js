import {loadImage} from '/js/utils/Loader.js';

class Map {

    constructor(mapData) {
        this.mapData = mapData;
        this.hasLoaded = false;
        this.matrix = [];
    }

    init() {
        this.width = this.mapData.map.width;
        this.height = this.mapData.map.height;
        this.tileWidth = this.mapData.map.tileWidth;
        this.tileHeight = this.mapData.map.tileHeight;
        this.tileData = this.mapData.tileSheet;
        this.margin = this.tileData.margin;
        

        loadImage(this.tileData.url).then(image => {
            this.tileSheet = image;
            this.hasLoaded = true;
        });
    }


    getHeight() {
        return this.height * this.tileHeight;
    }

    getWidth() {
        return this.width * this.tileWidth;
    }

    draw() {
        while (!this.hasLoaded) {console.log('loading tiles...')}

        
        return (context) => {

        }
    }
}

export default Map;