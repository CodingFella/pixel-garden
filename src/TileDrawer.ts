// TileDrawer.ts
// Draws the tiles from the sprites to the screen

import { TileAssets } from './TileAssets';
import { TileMap } from './TileMap';
import {
  TILE_SIZE,
  GRASS,
  DIRT,
  FARMLAND,
  MAP_HEIGHT,
  MAP_WIDTH,
  PATH,
  Tile,
  M_GRASS,
  T_GRASS,
  B_GRASS,
  L_GRASS,
  R_GRASS,
  TL_GRASS,
  TR_GRASS,
  BL_GRASS,
  BR_GRASS,
  BR_DIRT,
  BL_DIRT,
  TR_DIRT,
  TL_DIRT,
  FL,
  T_TR_R_BR_B_BL_L_TL_FL,
  T_TR_R_BR_B_BL_L_FL,
  T_R_BR_B_BL_L_TL_FL,
  T_TR_R_B_BL_L_TL_FL,
  T_R_B_BR_B_BL_L_FL,
  T_TR_R_BR_B_L_TL_FL,
  T_TR_R_B_L_TL_FL,
  T_R_BR_B_L_TL_FL,
  T_R_B_BL_L_TL_FL,
  T_TR_R_B_BL_L_FL,
  T_B_BL_L_TL_FL,
  T_TR_R_BR_B_L_FL,
  T_TR_R_BR_B_FL,
  T_R_B_L_TL_FL,
  T_TR_R_L_TL_FL,
  R_BR_B_BL_L_FL,
  T_R_BR_B_L_FL,
  T_R_B_BL_L_FL,
  T_TR_R_B_L_FL,
  T_B_BL_L_FL,
  T_TR_R_B_FL,
  T_R_B_L_FL,
  R_B_BL_L_FL,
  R_BR_B_L_FL,
  T_B_L_TL_FL,
  T_R_BR_B_FL,
  T_R_L_TL_FL,
  T_TR_R_L_FL,
  T_L_TL_FL,
  R_BR_B_FL,
  T_R_B_FL,
  B_BL_L_FL,
  T_TR_R_FL,
  T_R_L_FL,
  R_B_L_FL,
  T_B_L_FL,
  R_B_FL,
  B_L_FL,
  T_R_FL,
  T_L_FL,
  R_L_FL,
  T_B_FL,
  B_FL,
  T_FL,
  R_FL,
  L_FL,
  DEBUG,
  TileState,
} from './constants';

export class TileRenderer {
  ctx: CanvasRenderingContext2D;
  tileAssets: TileAssets;
  tileMap: TileMap;

  TILE_BITS: { [key: string]: number } = {
    TL: 0b10000000,
    T: 0b01000000,
    TR: 0b00100000,
    L: 0b00010000,
    R: 0b00001000,
    BL: 0b00000100,
    B: 0b00000010,
    BR: 0b00000001,
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    tileAssets: TileAssets,
    tileMap: TileMap,
  ) {
    this.ctx = ctx;
    this.tileAssets = tileAssets;
    this.tileMap = tileMap;
  }

  // 0 1 2
  // 3 X 4
  // 5 6 7
  // where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not
  getDirtSpots(x: number, y: number): number {
    let bits = 0;
    const positions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (let i = 0; i < positions.length; i++) {
      const [dx, dy] = positions[i];
      const tile = this.tileMap.getTile(x + dx, y + dy).type;
      if (tile == DIRT || tile == FARMLAND) {
        bits |= 1 << (positions.length - i - 1);
      }
    }

    return bits;
  }

  checkLocation(farmBits: number, name: string): boolean {
    const directions: string[] = name.split('_');

    for (let i: number = 0; i < directions.length - 1; i++) {
      if ((farmBits & this.TILE_BITS[directions[i]]) === 0) {
        return false;
      }
    }
    return true;
  }

  // 0 1 2
  // 3 X 4
  // 5 6 7
  // where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not
  getFarmlandSpots(x: number, y: number): number {
    let bits = 0;
    const positions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (let i = 0; i < positions.length; i++) {
      const [dx, dy] = positions[i];
      const tile = this.tileMap.getTile(x + dx, y + dy).type;
      if (tile == FARMLAND) {
        bits |= 1 << (positions.length - i - 1);
      }
    }

    return bits;
  }

  checkWateredSpots(farmBits: number, name: string): boolean {
    const directions: string[] = name.split('_');

    for (let i: number = 0; i < directions.length - 1; i++) {
      if ((farmBits & this.TILE_BITS[directions[i]]) === 0) {
        return false;
      }
    }
    return true;
  }

  // 0 1 2
  // 3 X 4
  // 5 6 7
  // where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not
  getWateredSpots(x: number, y: number): number {
    let bits = 0;
    const positions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (let i = 0; i < positions.length; i++) {
      const [dx, dy] = positions[i];
      const tile = this.tileMap.getTile(x + dx, y + dy).watered;
      if (tile) {
        bits |= 1 << (positions.length - i - 1);
      }
    }

    return bits;
  }

  // picks correct farmland sprite depending on surrounding tiles
  pickFarmlandLocation(farmBits: number): Tile {
    let location: Tile;
    if (farmBits == 0b00000000) {
      location = FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_BR_B_BL_L_TL_FL')) {
      location = T_TR_R_BR_B_BL_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_BR_B_BL_L_FL')) {
      location = T_TR_R_BR_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_R_BR_B_BL_L_TL_FL')) {
      location = T_R_BR_B_BL_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_B_BL_L_TL_FL')) {
      location = T_TR_R_B_BL_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_BR_B_BL_L_FL')) {
      location = T_R_B_BR_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_BR_B_L_TL_FL')) {
      location = T_TR_R_BR_B_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_B_L_TL_FL')) {
      location = T_TR_R_B_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_R_BR_B_L_TL_FL')) {
      location = T_R_BR_B_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_BL_L_TL_FL')) {
      location = T_R_B_BL_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_B_BL_L_FL')) {
      location = T_TR_R_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_B_BL_L_TL_FL')) {
      location = T_B_BL_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_BR_B_L_FL')) {
      location = T_TR_R_BR_B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_BR_B_FL')) {
      location = T_TR_R_BR_B_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_L_TL_FL')) {
      location = T_R_B_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_L_TL_FL')) {
      location = T_TR_R_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'R_BR_B_BL_L_FL')) {
      location = R_BR_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_R_BR_B_L_FL')) {
      location = T_R_BR_B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_BL_L_FL')) {
      location = T_R_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_B_L_FL')) {
      location = T_TR_R_B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_B_BL_L_FL')) {
      location = T_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_B_FL')) {
      location = T_TR_R_B_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_L_FL')) {
      location = T_R_B_L_FL;
    } else if (this.checkLocation(farmBits, 'R_B_BL_L_FL')) {
      location = R_B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'R_BR_B_L_FL')) {
      location = R_BR_B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_B_L_TL_FL')) {
      location = T_B_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_R_BR_B_FL')) {
      location = T_R_BR_B_FL;
    } else if (this.checkLocation(farmBits, 'T_R_L_TL_FL')) {
      location = T_R_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_L_FL')) {
      location = T_TR_R_L_FL;
    } else if (this.checkLocation(farmBits, 'T_L_TL_FL')) {
      location = T_L_TL_FL;
    } else if (this.checkLocation(farmBits, 'R_BR_B_FL')) {
      location = R_BR_B_FL;
    } else if (this.checkLocation(farmBits, 'T_R_B_FL')) {
      location = T_R_B_FL;
    } else if (this.checkLocation(farmBits, 'B_BL_L_FL')) {
      location = B_BL_L_FL;
    } else if (this.checkLocation(farmBits, 'T_TR_R_FL')) {
      location = T_TR_R_FL;
    } else if (this.checkLocation(farmBits, 'T_R_L_FL')) {
      location = T_R_L_FL;
    } else if (this.checkLocation(farmBits, 'R_B_L_FL')) {
      location = R_B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_B_L_FL')) {
      location = T_B_L_FL;
    } else if (this.checkLocation(farmBits, 'R_B_FL')) {
      location = R_B_FL;
    } else if (this.checkLocation(farmBits, 'B_L_FL')) {
      location = B_L_FL;
    } else if (this.checkLocation(farmBits, 'T_R_FL')) {
      location = T_R_FL;
    } else if (this.checkLocation(farmBits, 'T_L_FL')) {
      location = T_L_FL;
    } else if (this.checkLocation(farmBits, 'R_L_FL')) {
      location = R_L_FL;
    } else if (this.checkLocation(farmBits, 'T_B_FL')) {
      location = T_B_FL;
    } else if (this.checkLocation(farmBits, 'B_FL')) {
      location = B_FL;
    } else if (this.checkLocation(farmBits, 'T_FL')) {
      location = T_FL;
    } else if (this.checkLocation(farmBits, 'R_FL')) {
      location = R_FL;
    } else if (this.checkLocation(farmBits, 'L_FL')) {
      location = L_FL;
    } else {
      location = FL;
    }

    return location;
  }

  // picks correct wet sprite depending on surrounding tiles
  pickWetLocation(wetBits: number): Tile {
    let wet_location: Tile;
    if (wetBits == 0b00000000) {
      wet_location = FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_BR_B_BL_L_TL_FL')) {
      wet_location = T_TR_R_BR_B_BL_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_BR_B_BL_L_FL')) {
      wet_location = T_TR_R_BR_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_BR_B_BL_L_TL_FL')) {
      wet_location = T_R_BR_B_BL_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_B_BL_L_TL_FL')) {
      wet_location = T_TR_R_B_BL_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_BR_B_BL_L_FL')) {
      wet_location = T_R_B_BR_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_BR_B_L_TL_FL')) {
      wet_location = T_TR_R_BR_B_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_B_L_TL_FL')) {
      wet_location = T_TR_R_B_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_BR_B_L_TL_FL')) {
      wet_location = T_R_BR_B_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_BL_L_TL_FL')) {
      wet_location = T_R_B_BL_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_B_BL_L_FL')) {
      wet_location = T_TR_R_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_B_BL_L_TL_FL')) {
      wet_location = T_B_BL_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_BR_B_L_FL')) {
      wet_location = T_TR_R_BR_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_BR_B_FL')) {
      wet_location = T_TR_R_BR_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_L_TL_FL')) {
      wet_location = T_R_B_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_L_TL_FL')) {
      wet_location = T_TR_R_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_BR_B_BL_L_FL')) {
      wet_location = R_BR_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_BR_B_L_FL')) {
      wet_location = T_R_BR_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_BL_L_FL')) {
      wet_location = T_R_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_B_L_FL')) {
      wet_location = T_TR_R_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_B_BL_L_FL')) {
      wet_location = T_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_B_FL')) {
      wet_location = T_TR_R_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_L_FL')) {
      wet_location = T_R_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_B_BL_L_FL')) {
      wet_location = R_B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_BR_B_L_FL')) {
      wet_location = R_BR_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_B_L_TL_FL')) {
      wet_location = T_B_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_BR_B_FL')) {
      wet_location = T_R_BR_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_L_TL_FL')) {
      wet_location = T_R_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_L_FL')) {
      wet_location = T_TR_R_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_L_TL_FL')) {
      wet_location = T_L_TL_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_BR_B_FL')) {
      wet_location = R_BR_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_B_FL')) {
      wet_location = T_R_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'B_BL_L_FL')) {
      wet_location = B_BL_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_TR_R_FL')) {
      wet_location = T_TR_R_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_L_FL')) {
      wet_location = T_R_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_B_L_FL')) {
      wet_location = R_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_B_L_FL')) {
      wet_location = T_B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_B_FL')) {
      wet_location = R_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'B_L_FL')) {
      wet_location = B_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_R_FL')) {
      wet_location = T_R_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_L_FL')) {
      wet_location = T_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_L_FL')) {
      wet_location = R_L_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_B_FL')) {
      wet_location = T_B_FL;
    } else if (this.checkWateredSpots(wetBits, 'B_FL')) {
      wet_location = B_FL;
    } else if (this.checkWateredSpots(wetBits, 'T_FL')) {
      wet_location = T_FL;
    } else if (this.checkWateredSpots(wetBits, 'R_FL')) {
      wet_location = R_FL;
    } else if (this.checkWateredSpots(wetBits, 'L_FL')) {
      wet_location = L_FL;
    } else {
      wet_location = FL;
    }

    return wet_location;
  }

  drawMap(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let y: number = 0; y < MAP_HEIGHT; y++) {
      for (let x: number = 0; x < MAP_WIDTH; x++) {
        const tile: TileState = this.tileMap.map[y][x];
        const watered: boolean = this.tileMap.map[y][x].watered;
        if (tile.type == DIRT) {
          this.ctx.drawImage(
            this.tileAssets.grassTiles,
            PATH.x * TILE_SIZE,
            PATH.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        }
        // grass
        else if (tile.type == GRASS) {
          const dirtBits: number = this.getDirtSpots(x, y);
          let location: Tile = { x: -1, y: -1 };
          if (dirtBits == 0b00000000) {
            location = M_GRASS;
          } else if (
            dirtBits == 0b00000010 ||
            dirtBits == 0b00000110 ||
            dirtBits == 0b00000011 ||
            dirtBits == 0b00000111
          ) {
            location = T_GRASS;
          } else if (
            dirtBits == 0b01000000 ||
            dirtBits == 0b11000000 ||
            dirtBits == 0b01100000 ||
            dirtBits == 0b11100000
          ) {
            location = B_GRASS;
          } else if (
            dirtBits == 0b00001000 ||
            dirtBits == 0b00101001 ||
            dirtBits == 0b00101000 ||
            dirtBits == 0b00001001
          ) {
            location = L_GRASS;
          } else if (
            dirtBits == 0b00010000 ||
            dirtBits == 0b10010100 ||
            dirtBits == 0b10010000 ||
            dirtBits == 0b00010100
          ) {
            location = R_GRASS;
          } else if (dirtBits == 0b00000001) {
            location = TL_GRASS;
          } else if (dirtBits == 0b00000100) {
            location = TR_GRASS;
          } else if (dirtBits == 0b00100000) {
            location = BL_GRASS;
          } else if (dirtBits == 0b10000000) {
            location = BR_GRASS;
          } else if (
            dirtBits == 0b11010000 ||
            dirtBits == 0b11110100 ||
            dirtBits == 0b11010100 ||
            dirtBits == 0b11110000
          ) {
            location = BR_DIRT;
          } else if (
            dirtBits == 0b01101000 ||
            dirtBits == 0b11101001 ||
            dirtBits == 0b01101001 ||
            dirtBits == 0b11101000
          ) {
            location = BL_DIRT;
          } else if (
            dirtBits == 0b00010110 ||
            dirtBits == 0b10010111 ||
            dirtBits == 0b00010111 ||
            dirtBits == 0b10010110
          ) {
            location = TR_DIRT;
          } else if (
            dirtBits == 0b00001011 ||
            dirtBits == 0b00101111 ||
            dirtBits == 0b00001111 ||
            dirtBits == 0b00101011
          ) {
            location = TL_DIRT;
          }

          this.ctx.drawImage(
            this.tileAssets.grassTiles,
            location.x * TILE_SIZE,
            location.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        }

        // Farmland!! moo
        else if (tile.type == FARMLAND) {
          const farmBits = this.getFarmlandSpots(x, y);
          const wetBits = this.getWateredSpots(x, y);
          let location = this.pickFarmlandLocation(farmBits);

          this.ctx.drawImage(
            this.tileAssets.farmTiles,
            location.x * TILE_SIZE,
            location.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );

          // 0 1 2
          // 3 X 4
          // 5 6 7
          // where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not

          if (watered) {
            let wet_location = this.pickWetLocation(wetBits);

            this.ctx.drawImage(
              this.tileAssets.wetFarmTiles,
              wet_location.x * TILE_SIZE,
              wet_location.y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
            );
          }

          // there is a crop planted!
          if (tile.cropID > -1) {
            this.ctx.drawImage(
              this.tileAssets.crops,
              (2 + (tile.growthStage === undefined ? 0 : tile.growthStage)) *
                TILE_SIZE,
                (2 * tile.cropID) * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
            );
          }
        }
      }
    }

    if (DEBUG) {
      // Draw gridlines
      this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      this.ctx.lineWidth = 1;
      for (let x = 0; x <= MAP_WIDTH; x++) {
        this.ctx.beginPath();
        this.ctx.moveTo(x * TILE_SIZE, 0);
        this.ctx.lineTo(x * TILE_SIZE, this.ctx.canvas.height);
        this.ctx.stroke();
      }
      for (let y = 0; y <= MAP_HEIGHT; y++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y * TILE_SIZE);
        this.ctx.lineTo(this.ctx.canvas.width, y * TILE_SIZE);
        this.ctx.stroke();
      }
    }
  }
}
