// constants.ts

export const DEBUG = false;

export const VOID = -1;
export const DIRT = 0;
export const GRASS = 1;
export const FARMLAND = 2;

export interface Tile {
    x: number;
    y: number;
}

export interface TileState {
    type: number;
    watered: boolean;
    cropID: number;
    growthStage: number;
}



export const TL_GRASS: Tile = { x: 0, y: 5 };
export const T_GRASS: Tile = { x: 1, y: 5 };
export const TR_GRASS: Tile = { x: 2, y: 5 };
export const L_GRASS: Tile = { x: 0, y: 6 };
export const PATH: Tile = { x: 1, y: 6 };
export const M_GRASS: Tile = { x: 5, y: 3 };
export const R_GRASS: Tile = { x: 2, y: 6 };
export const BL_GRASS: Tile = { x: 0, y: 7 };
export const B_GRASS: Tile = { x: 1, y: 7 };
export const BR_GRASS: Tile = { x: 2, y: 7 };

// Dirt edges
export const BR_DIRT: Tile = { x: 0, y: 8 };
export const BL_DIRT: Tile = { x: 1, y: 8 };
export const TR_DIRT: Tile = { x: 0, y: 9 };
export const TL_DIRT: Tile = { x: 1, y: 9 };

// Farmland
export const FL: Tile = { x: 0, y: 0 };


export const B_FL: Tile = { x: 0, y: 1 };
export const T_B_FL: Tile = { x: 0, y: 2 };
export const T_FL: Tile = { x: 0, y: 3 };

export const R_FL: Tile = { x: 1, y: 3 };
export const R_L_FL: Tile = { x: 2, y: 3 };
export const L_FL: Tile = { x: 3, y: 3 };

// (1, 0) to (3, 2)
export const R_BR_B_FL: Tile = { x: 1, y: 0 };
export const R_BR_B_BL_L_FL: Tile = { x: 2, y: 0 };
export const B_BL_L_FL: Tile = { x: 3, y: 0 };
export const T_TR_R_BR_B_FL: Tile = { x: 1, y: 1 };
export const T_TR_R_BR_B_BL_L_TL_FL: Tile = { x: 2, y: 1 };
export const T_B_BL_L_TL_FL: Tile = { x: 3, y: 1 };
export const T_TR_R_FL: Tile = { x: 1, y: 2 };
export const T_TR_R_L_TL_FL: Tile = { x: 2, y: 2 };
export const T_L_TL_FL: Tile = { x: 3, y: 2 };

// (4, 0) to (6, 2)
export const R_B_FL: Tile = { x: 4, y: 0 };
export const R_B_L_FL: Tile = { x: 5, y: 0 };
export const B_L_FL: Tile = { x: 6, y: 0 };
export const T_R_B_FL: Tile = { x: 4, y: 1 };
export const T_R_B_L_FL: Tile = { x: 5, y: 1 };
export const T_B_L_FL: Tile = { x: 6, y: 1 };
export const T_R_FL: Tile = { x: 4, y: 2 };
export const T_R_L_FL: Tile = { x: 5, y: 2 };
export const T_L_FL: Tile = { x: 6, y: 2 };

// (4, 3) to (6, 4)
export const T_TR_R_B_BL_L_TL_FL: Tile = { x: 4, y: 3 };
export const T_TR_R_BR_B_L_TL_FL: Tile = { x: 5, y: 3 };
export const T_R_BR_B_L_TL_FL: Tile = { x: 6, y: 3 };
export const T_R_BR_B_BL_L_TL_FL: Tile = { x: 4, y: 4 };
export const T_TR_R_BR_B_BL_L_FL: Tile = { x: 5, y: 4 };
export const T_TR_R_B_BL_L_FL: Tile = { x: 6, y: 4 };

// (0, 4) to (3, 5)
export const T_TR_R_B_FL: Tile = { x: 0, y: 4 }
export const R_B_BL_L_FL: Tile = { x: 1, y: 4 }
export const R_BR_B_L_FL: Tile = { x: 2, y: 4 }
export const T_B_L_TL_FL: Tile = { x: 3, y: 4 }
export const T_R_BR_B_FL: Tile = { x: 0, y: 5 }
export const T_R_L_TL_FL: Tile = { x: 1, y: 5 }
export const T_TR_R_L_FL: Tile = { x: 2, y: 5 }
export const T_B_BL_L_FL: Tile = { x: 3, y: 5 }

// (0, 6) to (3, 7)
export const T_TR_R_B_L_TL_FL: Tile = { x: 0, y: 6 };
export const T_R_B_BR_B_BL_L_FL: Tile = { x:1, y: 6 };
export const T_R_BR_B_L_FL: Tile = { x: 2, y: 6 };
export const T_R_B_BL_L_FL: Tile = { x: 3, y: 6 };
export const T_R_B_BL_L_TL_FL: Tile = { x: 0, y: 7 };
export const T_TR_R_BR_B_L_FL: Tile = { x: 1, y: 7 };
export const T_TR_R_B_L_FL: Tile = { x: 2, y: 7 };
export const T_R_B_L_TL_FL: Tile = { x: 3, y: 7 };


// Tile map size
export const TILE_SIZE = 16;
export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 10;
