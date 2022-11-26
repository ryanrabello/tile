import "./style.css";
import * as PIXI from "pixi.js";
import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";
import { scaleLinear } from "d3";
import { createNoise3D } from "simplex-noise";

const element = document.querySelector("#app");

// Create the application helper and add its render target to the page
const doc = document.documentElement;
const dimensions = { width: doc.clientWidth, height: doc.clientHeight };
// TODO: get resolution higher
const app = new PIXI.Application({
  ...dimensions,
  backgroundAlpha: 0,
  antialias: true,
});
// @ts-ignore
element!.appendChild(app.view);

// Create sprite texture
const R = 200;
const g = new Graphics();
// const c = '#0862ec';
g.beginFill(0x0862ec);
g.lineStyle(0);
g.drawCircle(0, 0, R);
g.endFill();
const texture = app.renderer.generateTexture(g) as unknown as PIXI.Texture;

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
    const tile = new Tile(app, texture);
    tile.sprite.x = xScale(x) + (isOffset ? 14 : 0);
    tile.sprite.y = yScale(y) + 14;

    tiles.push(tile);
  }
  isOffset = !isOffset;
}

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

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
const noise3D = createNoise3D();
app.ticker.add((delta) => {
  elapsed += delta;
  const tNoise = elapsed / 200;
  tiles.forEach((tile) => {
    const NOISE_SPACE_SCALE = 1000;
    const dist = Math.sqrt(
      (tile.sprite.x - mouseposition.x) ** 2 +
        (tile.sprite.y - mouseposition.y) ** 2
    );
    const cursorOffset = 40 / (dist + 1);
    tile.setScale(
      Math.max(
        cursorOffset,
        noise3D(
          tile.sprite.x / NOISE_SPACE_SCALE,
          tile.sprite.y / NOISE_SPACE_SCALE,
          tNoise
        )
      )
    );
  });
});
