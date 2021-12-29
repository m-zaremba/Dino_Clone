import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const worldElement = document.querySelector("[data-world]");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-start-screen]");

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

let lastTime;
let speedScale;
let score;
let isPlaying = false;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  lastTime = time;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();
  window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElement.innerHTML = `SCORE: ${Math.floor(score)}`;
}

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

function handleStart() {
  // Avoid restarting the game with click if game was started by keypress (and vice versa)
  if (isPlaying) return;

  isPlaying = true;
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((cactusRect) =>
    isCollision(cactusRect, dinoRect)
  );
}

function isCollision(rect1, rect2) {
  return (
    (rect1.left + 10) < rect2.right &&
    rect1.top +20 < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top -10
  );
}

function handleLose() {
  setDinoLose();
  isPlaying = false;
  // Avoid restarting the game right after you lose
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, {once: true});
    window.addEventListener("touchstart", handleStart, { once: true });
    startScreenElement.classList.remove("hide");
  }, 500);
}

window.addEventListener("keydown", handleStart, { once: true });
window.addEventListener("touchstart", handleStart, { once: true });
window.addEventListener("resize", setPixelToWorldScale);

setPixelToWorldScale();
