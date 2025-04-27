// TileMap.ts

import {
  MAP_WIDTH,
  MAP_HEIGHT,
  GRASS,
  DIRT,
  TileState,
  VOID,
} from './constants.ts';

export class TileMap {
  map: TileState[][];

  constructor() {
    this.map = Array.from(
      { length: MAP_HEIGHT },
      (_: any): { type: number; watered: boolean }[] =>
        Array.from(
          { length: MAP_WIDTH },
          (_: any): { type: number; watered: boolean } => ({
            type: GRASS,
            watered: false,
          }),
        ),
    );

    for (let i: number = 1; i < MAP_WIDTH - 1; i++) {
      for (let j: number = 1; j < MAP_HEIGHT - 1; j++) {
        this.map[j][i].type = DIRT;
      }
    }
  }

  getTile(x: number, y: number): TileState {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
      return { type: VOID, watered: false };
    }
    return this.map[y][x];
  }

  setTile(x: number, y: number, tile: TileState) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
      return;
    }

    this.map[y][x] = tile;
  }
}
