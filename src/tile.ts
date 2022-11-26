import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { scaleLinear } from "d3";

const MAX_SCALE = 0.08;

const sizeScale = scaleLinear([0, 1], [0.03, MAX_SCALE]);
sizeScale.clamp(true);

export class Tile {
  sprite: PIXI.Sprite;
  static sizeScale = sizeScale;

  constructor(app: PIXI.Application, texture: PIXI.Texture) {
    // Create the sprite and add it to the stage
    // const sprite = PIXI.Sprite.from(typescriptLogoURL);
    const sprite = new Sprite(texture);
    this.sprite = sprite;
    sprite.anchor.set(0.5);
    sprite.scale.set(MAX_SCALE);
    app.stage.addChild(sprite);
  }
  setScale(scale: number) {
    this.sprite.scale.set(Tile.sizeScale(scale));
  }
}
