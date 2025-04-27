// TileAssets.ts

export class TileAssets {
    grassTiles: HTMLImageElement;
    grassMiddle: HTMLImageElement;
    farmTiles: HTMLImageElement;
    wetFarmTiles: HTMLImageElement;

    private loadedImages: number = 0;
    private totalImages: number = 4;

    constructor(private onAllImagesLoaded: () => void) {
        this.grassTiles = this.loadImage('/Grass_Tiles_1.png');
        this.grassMiddle = this.loadImage('/Grass_1_Middle.png');
        this.farmTiles = this.loadImage('/FarmLand_Tile.png');
        this.wetFarmTiles = this.loadImage('/FarmLand_Wet_Tile.png');
    }

    private loadImage(src: string): HTMLImageElement {
        const img = new Image();
        img.src = src;
        img.onload = () => this.checkAllImagesLoaded();
        return img;
    }

    private checkAllImagesLoaded() {
        this.loadedImages++;
        if (this.loadedImages === this.totalImages) {
            this.onAllImagesLoaded();
        }
    }
}