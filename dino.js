import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector("[data-dino]");
const jumpSound = document.querySelector("[data-jump]");

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0018;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let isBowing;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  isBowing = false;
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElement, "--bottom", 0);

  // Remove events after game over/restart
  document.removeEventListener("keyup", handleBow);
  document.removeEventListener("touchstart", onJump);
  document.removeEventListener("keydown", (event) => {
    onJump(event);
    handleBow(event);
  });
  document.addEventListener("keydown", (event) => {
    onJump(event);
    handleBow(event);
  });
  document.addEventListener("keyup", handleBow);
  document.addEventListener("touchstart", onJump);
}

export function updateDino(delta, speedScale) {
  handleRunAndBow(delta, speedScale);
  handleJump(delta);
}

function handleRunAndBow(delta, speedScale) {
  if (isJumping) {
    dinoElement.src = "img/dino-stationary.svg";
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT; // Crete frame loop
    dinoElement.src = `img/dino-${isBowing ? "bow" : "run"}-${dinoFrame}.svg`;
    currentFrameTime -= FRAME_TIME; // Reset animation frame value
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(dinoElement, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElement, "--bottom") <= 0) {
    setCustomProperty(dinoElement, "--bottom", 0);
    isJumping = false;
  };
  yVelocity -= GRAVITY * delta;
}

function onJump(event) {
  if (event.code !== "ArrowDown") {
    if (isJumping) return;

    jumpSound.play();
    yVelocity = JUMP_SPEED;
    isJumping = true;
  };
}

function handleBow(event) {
  if (event.code === "ArrowDown" && event.type === "keydown") {
    isBowing = true;
    return;
  }
  isBowing = false;
}

export function getDinoRect() {
  return dinoElement.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElement.src = "img/dino-lose.svg";
}
