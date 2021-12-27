import { updateGround, setupGround } from "./ground.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;

const worldElement = document.querySelector("[data-world]");

setupGround();

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);

let lastTime;
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  lastTime = time;

  updateGround(delta, 1);

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

function setPixelToWorldScale() {
  let worldPixelScale;

  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElement.style.width = `${WORLD_WIDTH * worldPixelScale}px`;
  worldElement.style.height = `${WORLD_HEIGHT * worldPixelScale}px`;
}
