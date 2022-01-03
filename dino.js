import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector("[data-dino]");
const jumpSound = document.querySelector("[data-jump]");

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0018;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let isPowerjumpActive;
let superJumpCounter = 2;
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

  // Remove event listeners after game over/restart
  document.removeEventListener("keyup", handleBow);
  document.removeEventListener("touchstart", onJump);
  document.removeEventListener("keydown", handleKeydown);

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleBow);
  document.addEventListener("touchstart", onJump);
}

function handleKeydown(event) {
  onJump(event, isPowerjumpActive);
  handleBow(event);
}

export function updateDino(delta, speedScale, isSuperpowerActive) {
  handleRunAndBow(delta, speedScale);
  handleJump(delta);
  handleSuperpowers(isSuperpowerActive);
}

function handleSuperpowers (isSuperpowerActive) {
  isPowerjumpActive = isSuperpowerActive;
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

function superJumpCountUpdate () {
  if (superJumpCounter === 0) {
    superJumpCounter = 2;
  }
  superJumpCounter -= 1;
}

function onJump(event, isPowerjumpActive) {
  if (event.code !== "ArrowDown") {
    if (isJumping && (!isPowerjumpActive || superJumpCounter <= 0)) return;
    if (isPowerjumpActive) {
      superJumpCountUpdate();
    }

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
  // Adjust superJumpCounter for restart keypress
  superJumpCounter = 3;
}
