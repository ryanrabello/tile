import './style.css'
import * as PIXI from 'pixi.js';
import typescriptLogoURL from './typescript.svg'

const element = document.querySelector('#app');

// Create the application helper and add its render target to the page
const doc = document.documentElement;
const app = new PIXI.Application({ width: doc.clientWidth, height: doc.clientHeight });
// @ts-ignore
element!.appendChild(app.view);

// Create the sprite and add it to the stage
const sprite = PIXI.Sprite.from(typescriptLogoURL);
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
  sprite.y = 100.0 + Math.sin(elapsed/25) * 100.0;
});
