import { setCustomProperty, incrementCustomProperty, getCustomProperty } from "./updateCustomProperty.js";

const SPEED = 0.0075;
const CLOUD_INTERVAL_MIN = 3000;
const CLOUD_INTERVAL_MAX = 8000;
const CLOUD_HEIGHT_MIN = 15;
const CLOUD_HEIGHT_MAX = 90;
const CLOUD_WIDTH_MIN = 5;
const CLOUD_WIDTH_MAX = 15;
const worldElement = document.querySelector("[data-world]");

let nextCloudTime;

export function setupCloud() {
  nextCloudTime = CLOUD_INTERVAL_MIN;
  // Remove all clouds at game restart
  document.querySelectorAll("[data-cloud]").forEach((cloud) => {
    cloud.remove();
  });
};

export function updateCloud(delta, speedScale) {
  document.querySelectorAll("[data-cloud]").forEach((cloud) => {
    incrementCustomProperty(cloud, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(cloud, "--left") <= -100) {
      cloud.remove();
    }
  });

  if (nextCloudTime <= 0) {
    createCloud();
    nextCloudTime =
      randomNumberBetween(CLOUD_INTERVAL_MIN, CLOUD_INTERVAL_MAX) /
      speedScale; // Adjust cloud appear rate for increased speed of the game
  };
  nextCloudTime -= delta; // 'Countdown' till next cloud appears on screen
};

function createCloud() {
  const cloud = document.createElement("img");
  cloud.dataset.cloud = true;
  cloud.src = "img/cloud.png";
  cloud.classList.add("cloud");
  setCustomProperty(cloud, "--left", 100);
  setCustomProperty(cloud, "--bottom", randomNumberBetween(CLOUD_HEIGHT_MIN, CLOUD_HEIGHT_MAX));
  setCustomProperty(cloud, "--width", randomNumberBetween(CLOUD_WIDTH_MIN, CLOUD_WIDTH_MAX));
  worldElement.append(cloud);
};

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
