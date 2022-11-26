import * as PIXI from "pixi.js";
import {Sprite} from "pixi.js";
import {scaleLinear} from "d3";

let range = [0.03, 0.08];
const sizeScale = scaleLinear([0, 1], range);
sizeScale.clamp(true);

export class Tile {
  sprite: PIXI.Sprite;
  static sizeScale = sizeScale;
  cursorSize: number;

  constructor(app: PIXI.Application, texture: PIXI.Texture) {
    // Create the sprite and add it to the stage
    // const sprite = PIXI.Sprite.from(typescriptLogoURL);
    const sprite = new Sprite(texture);
    this.sprite = sprite;
    sprite.anchor.set(0.5);
    sprite.scale.set(range[0]);
    app.stage.addChild(sprite);
    this.cursorSize = 0;
  }
  setNoiseScale(size: number) {
    this.sprite.scale.set(Tile.sizeScale(Math.max(size, this.cursorSize)));
  }
  setCursorSize(size: number) {
    this.cursorSize = Math.min(Math.max(size, this.cursorSize), 0.7);
    this.sprite.scale.set(Tile.sizeScale(this.cursorSize));
  }
  tick(delta: number) {
    //  delta ~ 0.5 on 120 fps screen
    this.cursorSize -= 0.01 * delta;
  }
}
