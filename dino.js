import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElement, "--bottom", 0);

  document.removeEventListener("keydown", onJump); // Remove event after game over/restart
  document.addEventListener("keydown", onJump);
};

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
};

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElement.src = "img/dino-stationary.png";
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT; // Crete frame loop
    dinoElement.src = `img/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME; // Reset animation frame value
  }
  currentFrameTime += delta * speedScale;
};

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElement, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElement, "--bottom") <= 0) {
    setCustomProperty(dinoElement, "--bottom", 0);
    isJumping = false;
  };

  yVelocity -= GRAVITY * delta;
};

function onJump(event) {
  if (event.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}