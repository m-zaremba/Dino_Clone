import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino } from "./dino.js";

const worldElement = document.querySelector("[data-world]");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-start-screen]");

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

let lastTime;
let speedScale;
let score;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  };
  const delta = time - lastTime;

  lastTime = time;
  
  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);

  window.requestAnimationFrame(update);
};

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
};

function updateScore(delta) {
  score += delta * 0.01;
  scoreElement.innerHTML = Math.floor(score);
};

function setPixelToWorldScale() {
  let worldPixelScale;
  
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldPixelScale = window.innerHeight / WORLD_HEIGHT;
  };
  
  worldElement.style.width = `${WORLD_WIDTH * worldPixelScale}px`;
  worldElement.style.height = `${WORLD_HEIGHT * worldPixelScale}px`;
};

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
};

window.addEventListener("keydown", handleStart, {once: true});
window.addEventListener("resize", setPixelToWorldScale);

setPixelToWorldScale();