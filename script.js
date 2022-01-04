import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";
import { updatePower, setupPower, getPowerRect } from "./power.js";
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
let isSuperpowerActive = false;
let isInvincible = false;
let powerChooser = null;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  lastTime = time;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale, isSuperpowerActive);
  updateCactus(delta, speedScale);
  updateCloud(delta, speedScale);
  updatePtero(delta, speedScale);
  updatePower(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (acquireSuperpower()) {
    setSuperpower()
  };
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
  setupPower();
  setupCloud();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

function checkLose() {
  if (isInvincible) return;
  const dinoRect = getDinoRect();
  const collision =
    getCactusRects().some((cactusRect) => isCollision(cactusRect, dinoRect)) ||
    getPteroRects().some((pteroRect) => isCollision(pteroRect, dinoRect));
  return collision;
}

function cancelSuperpower() {
  isSuperpowerActive = false;
  isInvincible = false;
  powerChooser = null;
}

function setSuperpower() {
  if (powerChooser === null) {
  powerChooser = Math.round(Math.random());
  };

  if (powerChooser === 0) {
    isSuperpowerActive = true;
  } else {
    isInvincible = true;
  };
  
  setSuperpowerTimeout();
};

function setSuperpowerTimeout() {
  setTimeout(cancelSuperpower, 5000);
}

function acquireSuperpower() {
  const dinoRect = getDinoRect();
  const superpowerAcquired = getPowerRect().some((powerRect) => isCollision(powerRect, dinoRect));
  return superpowerAcquired;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left + 10 < rect2.right + 10 &&
    rect1.top < rect2.bottom - 30 &&
    rect1.right - 40 > rect2.left &&
    rect1.bottom > rect2.top + 34
  );
}

function handleLose() {
  setDinoLose();
  saveHiScore();
  loadHiScore();
  dieSound.play();
  isPlaying = false;
  isSuperpowerActive = false;
  isInvincible = false;
  powerChooser = null;
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
