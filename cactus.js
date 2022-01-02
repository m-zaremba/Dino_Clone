import { setCustomProperty, incrementCustomProperty, getCustomProperty } from "./updateCustomProperty.js";

const SPEED = 0.08;
const CACTUS_INTERVAL_MIN = 900;
const CACTUS_INTERVAL_MAX = 2000;
const CACTUS_HEIGHT_MIN = 20;
const CACTUS_HEIGHT_MAX = 42;
const worldElement = document.querySelector("[data-world]");

let nextCactusTime;

export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  // Remove all cactuses at game restart
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove();
  });
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0) {
    createCactus();
    // Adjust cactus appear rate for increased speed of the game
    nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale; 
  };
  // 'Countdown' till next cactus appears on screen
  nextCactusTime -= delta;
}

// Get dimensions of the cactus
export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
}

function createCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = `img/cactus-${randomNumberBetween(0, 2)}.svg`;
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  setCustomProperty(cactus, "--height", randomNumberBetween(CACTUS_HEIGHT_MIN, CACTUS_HEIGHT_MAX));
  worldElement.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
