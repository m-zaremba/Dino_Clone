import { setCustomProperty, incrementCustomProperty, getCustomProperty } from "./updateCustomProperty.js";

const SPEED = 0.06;
const POWER_INTERVAL_MIN = 2000;
const POWER_INTERVAL_MAX = 300000;
const POWER_VELOCITY_MIN = 20;
const POWER_VELOCITY_MAX = 42;
const worldElement = document.querySelector("[data-world]");

let nextPowerTime;

export function setupPower() {
  nextPowerTime = POWER_INTERVAL_MIN;
  // Remove all powers at game restart
  document.querySelectorAll("[data-power]").forEach((power) => {
    power.remove();
  });
}

export function updatePower(delta, speedScale) {
  document.querySelectorAll("[data-power]").forEach((power) => {
    incrementCustomProperty(power, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(power, "--left") <= -100) {
      power.remove();
    }
  });

  if (nextPowerTime <= 0) {
    createPower();
    // Adjust power appear rate for increased speed of the game
    nextPowerTime = randomNumberBetween(POWER_INTERVAL_MIN, POWER_INTERVAL_MAX) / speedScale; 
  };
  // 'Countdown' till next power appears on screen
  nextPowerTime -= delta;
}

// Get dimensions of the cactus
export function getPowerRect() {
  return [...document.querySelectorAll("[data-power]")].map((power) => {
    return power.getBoundingClientRect();
  });
}

function createPower() {
  const power = document.createElement("img");
  power.dataset.power = true;
  power.src = "img/power.svg";
  power.classList.add("power");
  setCustomProperty(power, "--left", 100);
  setCustomProperty(power, "--bottom", randomNumberBetween(POWER_VELOCITY_MIN, POWER_VELOCITY_MAX));
  worldElement.append(power);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
