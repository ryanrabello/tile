import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { scaleLinear } from "d3";

let range = [0.0, 1];
const sizeScale = scaleLinear([0, 1], range);
sizeScale.clamp(true);

export class Tile {
  hexSprite: PIXI.Sprite;
  ironSprite: PIXI.Sprite;
  static sizeScale = sizeScale;

  constructor(
    app: PIXI.Application,
    texture: PIXI.Texture,
    ironTexture: PIXI.Texture
  ) {
    const sprite = new Sprite(texture);
    this.hexSprite = sprite;
    sprite.anchor.set(0.5); // TODO: remove extra scaling
    sprite.scale.set(0.08);
    app.stage.addChild(sprite);

    const ironSprite = new Sprite(ironTexture);
    this.ironSprite = ironSprite;
    ironSprite.anchor.set(0.5);
    ironSprite.scale.set(0);
    app.stage.addChild(ironSprite);
  }

  private setScale(s: number) {
    if (s > .2) {
      const scale = this.ironSprite.scale;
      this.ironSprite.scale.set(Math.max(Tile.sizeScale(s), scale.x));
    }
  }

  setCursor(x: number, y: number) {
    const dist = Math.sqrt(
    (this.hexSprite.x - x) ** 2 +
    (this.hexSprite.y - y) ** 2
    );

    const cursorOffset = 10 / (dist + 1);

    this.setScale(cursorOffset);
  }

  set x(x: number) {
    this.hexSprite.x = x;
    this.ironSprite.x = x;
  }
  set y(y: number) {
    this.hexSprite.y = y;
    this.ironSprite.y = y;
  }
}
