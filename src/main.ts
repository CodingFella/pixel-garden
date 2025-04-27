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




canvas.addEventListener('click', (e) => {
  const rect: DOMRect = canvas.getBoundingClientRect();
  const scaleX: number = canvas.width / rect.width;
  const scaleY: number = canvas.height / rect.height;

  const x: number = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
  const y: number = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    if (tileMap.getTile(x, y).type == DIRT && currentTool == HOE) {
      let state: TileState = { type: FARMLAND, watered: false };
      tileMap.setTile(x, y, state);
    } else if (tileMap.getTile(x, y).type == FARMLAND && currentTool == WATERING_CAN) {
      let state: TileState = { type: FARMLAND, watered: true };
      tileMap.setTile(x, y, state);
    }
    tileRenderer.drawMap();
  }
});

hotbarSlots[0].addEventListener('click', () => {
  hotbarSlots[0].classList.add('selected');
  hotbarSlots[1].classList.remove('selected');
  hotbarSlots[2].classList.remove('selected');
  console.log('pointer slot');
  currentTool = POINTER;
});

hotbarSlots[1].addEventListener('click', () => {
  hotbarSlots[1].classList.add('selected');
  hotbarSlots[0].classList.remove('selected');
  hotbarSlots[2].classList.remove('selected');
  console.log('watering can slot');
  currentTool = WATERING_CAN;
});

hotbarSlots[2].addEventListener('click', () => {
  hotbarSlots[2].classList.add('selected');
  hotbarSlots[0].classList.remove('selected');
  hotbarSlots[1].classList.remove('selected');
  console.log('hoe slot');
  currentTool = HOE;
});


