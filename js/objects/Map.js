import {
    loadImage
} from '/js/utils/Loader.js';

class Map {

    constructor(mapData) {
        this.mapData = mapData;
    }

    init() {
        this.width = this.mapData.map.width;
        this.height = this.mapData.map.height;
        this.tileWidth = this.mapData.map.tileWidth;
        this.tileHeight = this.mapData.map.tileHeight;
        this.tileData = this.mapData.tileSheet;
        this.margin = this.tileData.margin;

        this.background = this.mapData.map.layers.background;
        this.foreground = this.mapData.map.layers.foreground;
    }

    getTileGrid(gid) {
        var x = Math.floor(gid / this.width)
        var y = gid % this.width;;
        return [x, y];
    }

    getTileCoord(gid) {
        var grid = this.getTileGrid(gid);
        return [grid[1] * this.tileWidth, grid[0] * this.tileHeight];
    }

    getImageGrid(gid) {
        var x = Math.floor(gid / this.tileData.tileCount.x)
        var y = gid % this.tileData.tileCount.x;
        return [x, y];
    }

    getImageCoord(gid) {
        var grid = this.getImageGrid(gid);
        return [this.margin + grid[1] * (this.margin + this.tileWidth),
            this.margin + grid[0] * (this.margin + this.tileHeight)
        ];
    }

    getHeight() {
        return this.height * this.tileHeight;
    }

    getWidth() {
        return this.width * this.tileWidth;
    }

    ready() {
        return new Promise((resolve) => {
            loadImage(this.tileData.url).then(image => {
                this.tileSheet = image;
                this.buffer = document.createElement('canvas');
                this.bufferCtx = this.buffer.getContext('2d');
                this.buffer.width = this.getWidth();
                this.buffer.height = this.getHeight();
                this.c = 0;
                this.tile;
                this.loc;

                resolve('loaded');
            });
        });
    }

    drawBackground() {
        this.background.forEach(gid => {
            this.tile = this.getImageCoord(gid - 1);
            this.loc = this.getTileCoord(this.c);
            this.bufferCtx.drawImage(this.tileSheet, this.tile[0], this.tile[1], this.tileWidth, this.tileHeight,
            this.loc[0], this.loc[1], this.tileWidth, this.tileHeight);
            this.c++;
        });
        this.c = 0;
        return (context) => {
            context.drawImage(this.buffer, 0, 0);
        }

    }

    drawForeground() {
        this.foreground.forEach(gid => {
            if (this.c == 108) console.log(gid);
            this.tile = this.getImageCoord(gid - 1);
            this.loc = this.getTileCoord(this.c);
            this.bufferCtx.drawImage(this.tileSheet, this.tile[0], this.tile[1], this.tileWidth, this.tileHeight,
            this.loc[0], this.loc[1], this.tileWidth, this.tileHeight);
            this.c++;
        });
        this.c = 0;
        return (context) => {
            context.drawImage(this.buffer, 0, 0);
        }
    }
}

export default Map;