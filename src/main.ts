import {
  DIRT,
  FARMLAND,
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  TileState,
} from './constants';
import { TileAssets } from './TileAssets.ts';
import { TileMap } from "./TileMap.ts";
import { TileRenderer } from "./TileDrawer.ts";

const POINTER = 0;
const WATERING_CAN = 1;
const HOE = 2;
const PICKAXE = 3;
const SEED = 4;

let currentCropID: number = 0;

const WHEAT = 0;
const TOMATO = 1;

let currentTool: number = POINTER;

const canvas: HTMLCanvasElement = document.createElement('canvas');
document.body.appendChild(canvas);

const hotbarSlots: NodeListOf<Element> = document.querySelectorAll('.hotbar-slot');

const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

canvas.width = TILE_SIZE * MAP_WIDTH;
canvas.height = TILE_SIZE * MAP_HEIGHT;

const tileMap = new TileMap();
let tileRenderer: TileRenderer;

const tileAssets = new TileAssets(() => {
  tileRenderer = new TileRenderer(ctx, tileAssets, tileMap);
  tileRenderer.drawMap();
});



// when interacting with the field
canvas.addEventListener('click', (e) => {
  const rect: DOMRect = canvas.getBoundingClientRect();
  const scaleX: number = canvas.width / rect.width;
  const scaleY: number = canvas.height / rect.height;

  const x: number = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
  const y: number = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {

    // Hoe
    if (tileMap.getTile(x, y).type == DIRT && currentTool == HOE) {
      let state: TileState = { type: FARMLAND, watered: false, cropID: -1, growthStage: 0 };
      tileMap.setTile(x, y, state);
    }

    // Watering Can
    else if (tileMap.getTile(x, y).type == FARMLAND && currentTool == WATERING_CAN) {
      let state: TileState = tileMap.getTile(x, y);
      state.watered = true;
      tileMap.setTile(x, y, state);
    }

    // Pickaxe
    else if (tileMap.getTile(x, y).type == FARMLAND && currentTool == PICKAXE) {
      let state: TileState = { type: DIRT, watered: false, cropID: -1, growthStage: 0 };
      tileMap.setTile(x, y, state);
    }

    // Seed
    else if (tileMap.getTile(x, y).type == FARMLAND && currentTool == SEED && tileMap.getTile(x, y).cropID < 0) {
      let state: TileState = tileMap.getTile(x, y);
      state.cropID = currentCropID;
      state.growthStage = 0;
      tileMap.setTile(x, y, state);
    }
    tileRenderer.drawMap();
  }
});

const fakeCursor = document.createElement('div');
fakeCursor.style.position = 'fixed';
fakeCursor.style.pointerEvents = 'none';
fakeCursor.style.width = '64px';
fakeCursor.style.height = '64px';
fakeCursor.style.backgroundImage = 'none';
fakeCursor.style.backgroundSize = 'contain';
fakeCursor.style.backgroundRepeat = 'no-repeat';
fakeCursor.style.imageRendering = 'pixelated';
document.body.appendChild(fakeCursor);

document.addEventListener('mousemove', (e) => {
  fakeCursor.style.left = `${e.clientX + 16}px`;
  fakeCursor.style.top = `${e.clientY + 16}px`;
});


hotbarSlots.forEach((slot) => {
  slot.addEventListener('click', () => {
    // put 'selected' on current tool
    hotbarSlots.forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');

    if (slot.classList.contains('watering-can')) {
      fakeCursor.style.backgroundImage = 'url("watering-can.png")';
      currentTool = WATERING_CAN;
    } else if (slot.classList.contains('hoe')) {
      fakeCursor.style.backgroundImage = 'url("hoe.png")';
      currentTool = HOE;
    } else if (slot.classList.contains('pickaxe')) {
      fakeCursor.style.backgroundImage = 'url("pickaxe.png")';
      currentTool = PICKAXE;
    } else if (slot.classList.contains('seed')) {
      if (slot.classList.contains('wheat-seed')) {
        fakeCursor.style.backgroundImage = 'url("wheat-seed.png")';
        currentCropID = WHEAT;
      } else if (slot.classList.contains('tomato-seed')) {
        fakeCursor.style.backgroundImage = 'url("tomato-seed.png")';
        currentCropID = TOMATO;
      }
      currentTool = SEED;
    } else {
      // Default pointer
      fakeCursor.style.backgroundImage = 'none';
    }
  });
});

const skipButton: HTMLDivElement | null = document.querySelector('.skip-btn');

if(skipButton) {
  skipButton.addEventListener('click', () => {
    advanceGrowth();
  });
}


// grow watered plants by 1 growth stage
function advanceGrowth() {
  for(let i = 0; i < MAP_WIDTH; i++) {
    for(let j = 0; j < MAP_HEIGHT; j++) {
      let state: TileState = tileMap.getTile(i, j);
      if(state.watered) {
        state.growthStage += 1;
        if (state.growthStage == 4) {
          state.growthStage = 3;
        }
      }
      //state.watered = false;
      tileMap.setTile(i, j, state);
    }
  }
  tileRenderer.drawMap();
}



