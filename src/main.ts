import "./style.css";
import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import { Graphics, Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";
import { scaleLinear } from "d3";

const element = document.querySelector("#app");

// Create the application helper and add its render target to the page
const doc = document.documentElement;
const dimensions = { width: doc.clientWidth, height: doc.clientHeight };
// TODO: get resolution higher
const app = new PIXI.Application({
  ...dimensions,
  antialias: true,
  backgroundColor: 0xffffff,
});
// @ts-ignore
element!.appendChild(app.view);

// Create sprite textures
const R = 200;
const hexG = new Graphics();
// const c = '#0862ec';
hexG.beginFill(0xffffff);
hexG.lineStyle(40, 0xeeeeee, 1);
hexG.drawRegularPolygon?.(0, 0, R, 6, 0);
hexG.endFill();
const hexTexture = app.renderer.generateTexture(
  hexG
) as unknown as PIXI.Texture;

const iron = new Graphics();
// const c = '#0862ec';
iron.beginFill(0x0);
iron.lineStyle(0);
iron.drawCircle(0, 0, 7);
iron.endFill();
const ironTexture = app.renderer.generateTexture(
  iron
) as unknown as PIXI.Texture;

// Create tile coordinates
const TILE_DENSITY = 4 / 100; // tile per pixel (linear)

const tiles: Tile[] = [];

const xCount = Math.ceil(TILE_DENSITY * dimensions.width);
const yCount = Math.ceil(TILE_DENSITY * dimensions.height);

const xScale = scaleLinear([0, xCount], [0, dimensions.width]);
const yScale = scaleLinear([0, yCount], [0, dimensions.height]);

let isOffset = true;
for (let y = 0; y < yCount; y++) {
  for (let x = isOffset ? 0 : 1; x < xCount; x++) {
    const tile = new Tile(app, hexTexture, ironTexture);
    tile.x = xScale(x) + (isOffset ? R * 0.06 : 0);
    tile.y = yScale(y) + 14;

    tiles.push(tile);
  }
  isOffset = !isOffset;
}

// Add iron sprite after hex tile
tiles.forEach((tile) => {
  app.stage.addChild(tile.ironSprite);
})

// Mouse following
const interactor = new Sprite(Texture.EMPTY);
interactor.x = 0;
interactor.y = 0;
interactor.width = dimensions.width;
interactor.height = dimensions.height;
app.stage.addChild(interactor);

const mouseposition = { x: 0, y: 0 };
let handler = (event: { global: { x: number; y: number } }) => {
  mouseposition.x = event.global.x;
  mouseposition.y = event.global.y;
};
interactor.interactive = true;
interactor.on("pointermove", handler);

let isPressed = false;
interactor.on("pointerdown", () => (isPressed = true));
interactor.on("pointerup", () => (isPressed = false));
interactor.on("pointerupoutside", () => (isPressed = false));

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  tiles.forEach((tile) => {
    if (isPressed) {
      tile.setCursor(mouseposition.x, mouseposition.y);
    }
  });
});
