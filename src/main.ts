import {
  DEBUG,
  VOID,
  DIRT,
  GRASS,
  FARMLAND,
  Tile,
  TileState,
  TILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  TL_GRASS,
  T_GRASS,
  TR_GRASS,
  L_GRASS,
  PATH,
  M_GRASS,
  R_GRASS,
  BL_GRASS,
  B_GRASS,
  BR_GRASS,
  BR_DIRT,
  BL_DIRT,
  TR_DIRT,
  TL_DIRT,
  FL,
  B_FL,
  T_B_FL,
  T_FL,
  R_FL,
  R_L_FL,
  L_FL,
  R_BR_B_FL,
  R_BR_B_BL_L_FL,
  B_BL_L_FL,
  T_TR_R_BR_B_FL,
  T_TR_R_BR_B_BL_L_TL_FL,
  T_B_BL_L_TL_FL,
  T_TR_R_FL,
  T_TR_R_L_TL_FL,
  T_L_TL_FL,
  R_B_FL,
  R_B_L_FL,
  B_L_FL,
  T_R_B_FL,
  T_R_B_L_FL,
  T_B_L_FL,
  T_R_FL,
  T_R_L_FL,
  T_L_FL,
  T_TR_R_B_BL_L_TL_FL,
  T_TR_R_BR_B_L_TL_FL,
  T_R_BR_B_L_TL_FL,
  T_R_BR_B_BL_L_TL_FL,
  T_TR_R_BR_B_BL_L_FL,
  T_TR_R_B_BL_L_FL,
  T_TR_R_B_FL,
  R_B_BL_L_FL,
  R_BR_B_L_FL,
  T_B_L_TL_FL,
  T_R_BR_B_FL,
  T_R_L_TL_FL,
  T_TR_R_L_FL,
  T_B_BL_L_FL,
  T_TR_R_B_L_TL_FL,
  T_R_B_BR_B_BL_L_FL,
  T_R_BR_B_L_FL,
  T_R_B_BL_L_FL,
  T_R_B_BL_L_TL_FL,
  T_TR_R_BR_B_L_FL,
  T_TR_R_B_L_FL,
  T_R_B_L_TL_FL,
} from './constants';


const canvas: HTMLCanvasElement = document.createElement('canvas');
document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

canvas.width = TILE_SIZE * MAP_WIDTH;
canvas.height = TILE_SIZE * MAP_HEIGHT;

const GRASS_TILES: HTMLImageElement = new Image();
GRASS_TILES.src = '/Grass_Tiles_1.png';

const GRASS_MIDDLE: HTMLImageElement = new Image();
GRASS_MIDDLE.src = '/Grass_1_Middle.png';

const FARM_TILES: HTMLImageElement = new Image();
FARM_TILES.src = '/FarmLand_Tile.png';

const WET_FARM_TILES: HTMLImageElement = new Image();
WET_FARM_TILES.src = '/FarmLand_Wet_Tile.png';

const map: TileState[][] = Array.from({ length: MAP_HEIGHT }, (_) =>
  Array.from({ length: MAP_WIDTH }, (_) => ({ type: GRASS, watered: false })),
);

for (let i: number = 1; i < MAP_WIDTH-1; i++) {
  for (let j: number = 1; j < MAP_HEIGHT-1; j++) {
    map[j][i].type = DIRT;
  }
}

function getTile(x: number, y: number): number {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
    return VOID;
  }
  return map[y][x].type;
}

function setTile(x: number, y: number, tile: TileState) {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
    return;
  }

  map[y][x] = tile;
}

// 0 1 2
// 3 X 4
// 5 6 7
// where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not
function getDirtSpots(x: number, y: number): number {
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
    const tile = getTile(x + dx, y + dy);
    if (tile == DIRT || tile == FARMLAND) {
      bits |= 1 << (positions.length - i - 1);
    }
  }

  return bits;
}

const TILE_BITS: { [key: string]: number } = {
  "TL": 0b10000000,
  "T": 0b01000000,
  "TR": 0b00100000,
  "L": 0b00010000,
  "R": 0b00001000,
  "BL": 0b00000100,
  "B": 0b00000010,
  "BR": 0b00000001
};


function checkLocation(farmBits: number, name: string): boolean {
  const directions: string[] = name.split("_");

  for(let i: number = 0; i < directions.length - 1; i++) {
    if((farmBits & TILE_BITS[directions[i]]) === 0) {
      return false;
    }
  }
  return true;
}


// 0 1 2
// 3 X 4
// 5 6 7
// where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not
function getFarmlandSpots(x: number, y: number): number {
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
    const tile = getTile(x + dx, y + dy);
    if (tile == FARMLAND) {
      bits |= 1 << (positions.length - i - 1);
    }
  }

  return bits;
}

function drawMap(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y: number = 0; y < MAP_HEIGHT; y++) {
    for (let x: number = 0; x < MAP_WIDTH; x++) {
      const tile: number = map[y][x].type;
      const watered: boolean = map[y][x].watered;
      if (tile == DIRT) {
        ctx.drawImage(
          GRASS_TILES,
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
      else if (tile == GRASS) {
        const dirtBits: number = getDirtSpots(x, y);
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

        ctx.drawImage(
          GRASS_TILES,
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
      else if (tile == FARMLAND) {
        const farmBits = getFarmlandSpots(x, y);
        let location: Tile = { x: -1, y: -1 };

        if (farmBits == 0b00000000) {
          location = FL;
        }
        else if (checkLocation(farmBits, "T_TR_R_BR_B_BL_L_TL_FL")) {
          location = T_TR_R_BR_B_BL_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_BR_B_BL_L_FL")) {
          location = T_TR_R_BR_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_R_BR_B_BL_L_TL_FL")) {
          location = T_R_BR_B_BL_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_B_BL_L_TL_FL")) {
          location = T_TR_R_B_BL_L_TL_FL;
        } else if (checkLocation(farmBits, "T_R_B_BR_B_BL_L_FL")) {
          location = T_R_B_BR_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_TR_R_BR_B_L_TL_FL")) {
          location = T_TR_R_BR_B_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_B_L_TL_FL")) {
          location = T_TR_R_B_L_TL_FL;
        } else if (checkLocation(farmBits, "T_R_BR_B_L_TL_FL")) {
          location = T_R_BR_B_L_TL_FL;
        } else if (checkLocation(farmBits, "T_R_B_BL_L_TL_FL")) {
          location = T_R_B_BL_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_B_BL_L_FL")) {
          location = T_TR_R_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_B_BL_L_TL_FL")) {
          location = T_B_BL_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_BR_B_L_FL")) {
          location = T_TR_R_BR_B_L_FL;
        } else if (checkLocation(farmBits, "T_TR_R_BR_B_FL")) {
          location = T_TR_R_BR_B_FL;
        } else if (checkLocation(farmBits, "T_R_B_L_TL_FL")) {
          location = T_R_B_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_L_TL_FL")) {
          location = T_TR_R_L_TL_FL;
        } else if (checkLocation(farmBits, "R_BR_B_BL_L_FL")) {
          location = R_BR_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_R_BR_B_L_FL")) {
          location = T_R_BR_B_L_FL;
        } else if (checkLocation(farmBits, "T_R_B_BL_L_FL")) {
          location = T_R_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_TR_R_B_L_FL")) {
          location = T_TR_R_B_L_FL;
        } else if (checkLocation(farmBits, "T_B_BL_L_FL")) {
          location = T_B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_TR_R_B_FL")) {
          location = T_TR_R_B_FL;
        } else if (checkLocation(farmBits, "T_R_B_L_FL")) {
          location = T_R_B_L_FL;
        } else if (checkLocation(farmBits, "R_B_BL_L_FL")) {
          location = R_B_BL_L_FL;
        } else if (checkLocation(farmBits, "R_BR_B_L_FL")) {
          location = R_BR_B_L_FL;
        } else if (checkLocation(farmBits, "T_B_L_TL_FL")) {
          location = T_B_L_TL_FL;
        } else if (checkLocation(farmBits, "T_R_BR_B_FL")) {
          location = T_R_BR_B_FL;
        } else if (checkLocation(farmBits, "T_R_L_TL_FL")) {
          location = T_R_L_TL_FL;
        } else if (checkLocation(farmBits, "T_TR_R_L_FL")) {
          location = T_TR_R_L_FL;
        } else if (checkLocation(farmBits, "T_L_TL_FL")) {
          location = T_L_TL_FL;
        } else if (checkLocation(farmBits, "R_BR_B_FL")) {
          location = R_BR_B_FL;
        } else if (checkLocation(farmBits, "T_R_B_FL")) {
          location = T_R_B_FL;
        } else if (checkLocation(farmBits, "B_BL_L_FL")) {
          location = B_BL_L_FL;
        } else if (checkLocation(farmBits, "T_TR_R_FL")) {
          location = T_TR_R_FL;
        } else if (checkLocation(farmBits, "T_R_L_FL")) {
          location = T_R_L_FL;
        } else if (checkLocation(farmBits, "R_B_L_FL")) {
          location = R_B_L_FL;
        } else if (checkLocation(farmBits, "T_B_L_FL")) {
          location = T_B_L_FL;
        } else if (checkLocation(farmBits, "R_B_FL")) {
          location = R_B_FL;
        } else if (checkLocation(farmBits, "B_L_FL")) {
          location = B_L_FL;
        } else if (checkLocation(farmBits, "T_R_FL")) {
          location = T_R_FL;
        } else if (checkLocation(farmBits, "T_L_FL")) {
          location = T_L_FL;
        } else if (checkLocation(farmBits, "R_L_FL")) {
          location = R_L_FL;
        } else if (checkLocation(farmBits, "T_B_FL")) {
          location = T_B_FL;
        } else if (checkLocation(farmBits, "B_FL")) {
          location = B_FL;
        } else if (checkLocation(farmBits, "T_FL")) {
          location = T_FL;
        } else if (checkLocation(farmBits, "R_FL")) {
          location = R_FL;
        } else if (checkLocation(farmBits, "L_FL")) {
          location = L_FL;
        }

        else {
          location = FL;
          console.log(farmBits);
        }

          // 0 1 2
          // 3 X 4
          // 5 6 7
            // where X is (x, y) and the numbers are binary digits locations, indicating 1 if dirt, False if not

          ctx.drawImage(
              FARM_TILES,
              location.x * TILE_SIZE,
              location.y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
          );

        if(watered) {
          ctx.drawImage(
              WET_FARM_TILES,
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
      }
    }
  }

  if (DEBUG) {
    // Draw gridlines
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= MAP_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * TILE_SIZE, 0);
      ctx.lineTo(x * TILE_SIZE, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= MAP_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * TILE_SIZE);
      ctx.lineTo(canvas.width, y * TILE_SIZE);
      ctx.stroke();
    }
  }
}

canvas.addEventListener('click', (e) => {
  const rect: DOMRect = canvas.getBoundingClientRect();
  const scaleX: number = canvas.width / rect.width;
  const scaleY: number = canvas.height / rect.height;

  const x: number = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
  const y: number = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    if (getTile(x, y) == DIRT) {
      let state: TileState = { type: FARMLAND, watered: false}
      setTile(x, y, state);
    }
    else if (getTile(x, y) == FARMLAND) {
      let state: TileState = { type: FARMLAND, watered: true}
      setTile(x, y, state);
    }
    drawMap();
  }
});


let loadedImages: number = 0;
const totalImages = 4;

function checkAllImagesLoaded() {
  loadedImages++;
  if (loadedImages === totalImages) {
    drawMap();
  }
}

GRASS_TILES.onload = checkAllImagesLoaded;
GRASS_MIDDLE.onload = checkAllImagesLoaded;
FARM_TILES.onload = checkAllImagesLoaded;
WET_FARM_TILES.onload = checkAllImagesLoaded;
