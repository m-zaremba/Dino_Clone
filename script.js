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
const powerSound = document.querySelector("[data-power]");
const powerIndicatorElement = document.querySelector("[data-power-info]");

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

let lastTime;
let speedScale;
let score;
let hiScore = 0;
let isPlaying = false;
let isPowerjumpActive = false;
let isInvincible = false;
let powerChooser = null;
let powerCounter = 11;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;
  
  lastTime = time;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale, isPowerjumpActive, isInvincible);
  updateCactus(delta, speedScale);
  updateCloud(delta, speedScale);
  updatePtero(delta, speedScale);
  updatePower(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (acquireSuperpower()) {
    setSuperpower();
  }
  if (isPowerjumpActive || isInvincible) {
    updatePowerCountdown(delta);
    showPowerStatus(powerChooser, powerCounter, isPowerjumpActive, isInvincible);
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
    (element === hiScoreElement ? "HI:" : "") +
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
  isPowerjumpActive = false;
  isInvincible = false;
  powerChooser = null;
  powerCounter = 11;
  powerIndicatorElement.classList.add("hide");
}

function setSuperpower() {
  powerSound.play();
  if (powerChooser === null) {
    powerChooser = Math.round(Math.random());
  }

  if (powerChooser === 0) {
    isPowerjumpActive = true;
  } else {
    isInvincible = true;
  }
}

function showPowerStatus() {
  powerIndicatorElement.textContent = `${isPowerjumpActive ? "POWERJUMP" : "INVINCIBLE"} ${Math.floor(powerCounter)}`;

  powerIndicatorElement.classList.remove("hide");

  // If below statement is not in showPowerStatus(), powerIndicatorElement won't hide after power time is up
  if (powerCounter <= 0.3) {
    cancelSuperpower();
  }
}

function updatePowerCountdown(delta) {
  powerCounter -= delta * 0.001;
  console.log(powerCounter);

  // Indicate with sound that the power time is running out
  if (
    (powerCounter < 3.9 && powerCounter > 3.8) || 
    (powerCounter < 2.9 && powerCounter > 2.8) || 
    (powerCounter < 1.9 && powerCounter > 1.8) || 
    (powerCounter < 0.9 && powerCounter > 0.8)
    ) {
    powerSound.play();
  }
}

function acquireSuperpower() {
  const dinoRect = getDinoRect();
  const superpowerAcquired = getPowerRect().some((powerRect) =>
    isCollision(powerRect, dinoRect)
  );
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
  isPlaying = false;
  isPowerjumpActive = false;
  isInvincible = false;
  powerChooser = null;
  powerCounter = 11;
  powerIndicatorElement.classList.add("hide");
  // Avoid restarting the game by keypress right after you lose
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    window.addEventListener("touchstart", handleStart, { once: true });
    startScreenElement.textContent = "PRESS ANY KEY TO RESTART";
    startScreenElement.classList.remove("hide");
  }, 500);
}

window.addEventListener("keydown", handleStart, { once: true });
window.addEventListener("touchstart", handleStart, { once: true });
window.addEventListener("resize", setPixelToWorldScale);

jumpSound.volume = 0.1;
powerSound.volume = 0.1;
dieSound.volume = 0.1;
setPixelToWorldScale();
loadHiScore();
