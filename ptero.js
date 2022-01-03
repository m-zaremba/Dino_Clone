import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const worldElement = document.querySelector("[data-world]");

const SPEED = 0.1;
const PTERO_INTERVAL_MIN = 5000;
const PTERO_INTERVAL_MAX = 10000;
const PTERO_ALTITUDE_MIN = 20;
const PTERO_ALTITUDE_MAX = 70;
const PTERO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let pteroFrame;
let nextPteroTime;
let currentFrameTime;

export function setupPtero() {
  pteroFrame = 0;
  currentFrameTime = 0;

  nextPteroTime = PTERO_INTERVAL_MIN;
  // Remove all clouds at game restart
  document.querySelectorAll("[data-ptero]").forEach((ptero) => {
    ptero.remove();
  });
}

export function updatePtero(delta, speedScale) {
  document.querySelectorAll("[data-ptero]").forEach((ptero) => {
    handleFly(ptero, delta, speedScale);
    incrementCustomProperty(ptero, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(ptero, "--left") <= -100) {
      ptero.remove();
    }
  });

  if (nextPteroTime <= 0) {
    createPtero();
    // Adjust ptero appear rate for increased speed of the game
    nextPteroTime = randomNumberBetween(PTERO_INTERVAL_MIN, PTERO_INTERVAL_MAX) / speedScale; 
  }
  // 'Countdown' till next ptero appears on screen
  nextPteroTime -= delta;
}

function createPtero() {
  const ptero = document.createElement("img");
  ptero.dataset.ptero = true;
  ptero.src = "img/ptero-1.svg";
  ptero.classList.add("ptero");
  setCustomProperty(ptero, "--left", 100);
  setCustomProperty(ptero, "--bottom", randomNumberBetween(PTERO_ALTITUDE_MIN, PTERO_ALTITUDE_MAX));
  worldElement.append(ptero);
}

function handleFly(ptero, delta, speedScale) {
  if (currentFrameTime >= FRAME_TIME) {
    pteroFrame = (pteroFrame + 1) % PTERO_FRAME_COUNT; // Crete frame loop
    ptero.src = `img/ptero-${pteroFrame}.svg`;
    currentFrameTime -= FRAME_TIME; // Reset animation frame value
  }
  currentFrameTime += delta * speedScale;
}

export function getPteroRects() {
  return [...document.querySelectorAll("[data-ptero]")].map((ptero) => {
    return ptero.getBoundingClientRect();
  });
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
