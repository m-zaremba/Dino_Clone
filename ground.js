import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const groundElements = document.querySelectorAll("[data-ground]");

const SPEED = 0.08;

export function setupGround() {
  setCustomProperty(groundElements[0], "--left", 0);
  setCustomProperty(groundElements[1], "--left", 300);
}

export function updateGround(delta, speedScale) {
  groundElements.forEach((groundElem) => {
    incrementCustomProperty(
      groundElem,
      "--left",
      delta * speedScale * SPEED * -1
    );

    if (getCustomProperty(groundElem, "--left") < -300) {
      incrementCustomProperty(groundElem, "--left", 600);
    }
  });
}
