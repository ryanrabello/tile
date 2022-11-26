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
    // app.stage.addChild(ironSprite);
  }

  private setScale(s: number) {
    if (s > 0.2) {
      const scale = this.ironSprite.scale;
      this.ironSprite.scale.set(Math.max(Tile.sizeScale(s), scale.x));
    }
  }

  setCursor(x: number, y: number) {
    const xDiff = this.hexSprite.x - x;
    const yDiff = this.hexSprite.y - y;
    const dist = Math.sqrt(xDiff ** 2 + yDiff ** 2);

    const asymptoticScale = 10 / (dist + 1);

    const angle = Math.atan2(-yDiff, -xDiff);

    this.setScale(asymptoticScale);
    if (asymptoticScale > 0.2) {
      this.setAngle(angle);
    }
  }

  set x(x: number) {
    this.hexSprite.x = x;
    this.ironSprite.x = x;
  }
  set y(y: number) {
    this.hexSprite.y = y;
    this.ironSprite.y = y;
  }

  private setAngle(angle: number) {
    const L = 5;
    const x = Math.cos(angle) * L;
    const y = Math.sin(angle) * L;

    this.ironSprite.x = this.hexSprite.x + x;
    this.ironSprite.y = this.hexSprite.y + y;
  }
}
