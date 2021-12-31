import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";
import { updatePtero, setupPtero, getPteroRects } from "./ptero.js";
import { updateCloud, setupCloud } from "./cloud.js";

const worldElement = document.querySelector("[data-world]");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-start-screen]");
const hiScoreElement = document.querySelector("[data-hiscore]");
const dieSound = document.querySelector("[data-die]");
const jumpSound = document.querySelector("[data-jump]");

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

let lastTime;
let speedScale;
let score;
let hiScore;
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
  updateCloud(delta, speedScale);
  updatePtero(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();
  window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

// Format score to consist of 5 digits with leading zeros and show it on screen
function formatScoreValue(element, score) {
  element.textContent =
    (element === hiScoreElement ? "HI: " : "SCORE: ") +
    Math.floor(score).toString().padStart(5, "0");
}

function loadHiScore() {
  if (localStorage.hiScore) {
    hiScore = localStorage.hiScore;
  }
  formatScoreValue(hiScoreElement, hiScore);
}

function saveHiScore() {
  if (score > hiScore) {
    localStorage.setItem("hiScore", JSON.stringify(Math.floor(score)));
  }
}

function updateScore(delta) {
  score += delta * 0.01;
  formatScoreValue(scoreElement, score);
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
  setupPtero();
  setupCloud();
  loadHiScore();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  const collision =
    getCactusRects().some((cactusRect) => isCollision(cactusRect, dinoRect)) ||
    getPteroRects().some((pteroRect) => isCollision(pteroRect, dinoRect));
  return collision;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left + 10 < rect2.right + 10 && //OK
    rect1.top < rect2.bottom - 10 && //OK
    rect1.right - 15 > rect2.left && //OK
    rect1.bottom > rect2.top
  );
}

function handleLose() {
  setDinoLose();
  saveHiScore();
  dieSound.play();
  isPlaying = false;
  // Avoid restarting the game right after you lose
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    window.addEventListener("touchstart", handleStart, { once: true });
    startScreenElement.classList.remove("hide");
  }, 500);
}

window.addEventListener("keydown", handleStart, { once: true });
window.addEventListener("touchstart", handleStart, { once: true });
window.addEventListener("resize", setPixelToWorldScale);

jumpSound.volume = 0.1;
dieSound.volume = 0.1;
setPixelToWorldScale();
loadHiScore();
