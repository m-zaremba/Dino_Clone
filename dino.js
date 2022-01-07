import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector("[data-dino]");
const jumpSound = document.querySelector("[data-jump]");
const dieSound = document.querySelector("[data-die]");

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0018;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let isSuperjumpActive = false;
let isImmortalActive = false;
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
  document.removeEventListener("touchstart", handleKeydown);
  document.removeEventListener("keydown", handleKeydown);

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleBow);
  document.addEventListener("touchstart", handleKeydown);
}

function handleKeydown(event) {
  onJump(event, isSuperjumpActive);
  handleBow(event);
}

export function updateDino(delta, speedScale, isPowerjumpActive, isInvincible) {
  handleRunAndBow(delta, speedScale);
  handleJump(delta);
  handleSuperpowers(isPowerjumpActive, isInvincible);
}

function handleSuperpowers (isPowerjumpActive, isInvincible) {
  isSuperjumpActive = isPowerjumpActive;
  isImmortalActive = isInvincible;
}

function handleRunAndBow(delta, speedScale) {
  if (isJumping) {
    dinoElement.src = `img/dino-stationary${isSuperjumpActive ? "-powerjump" : isImmortalActive ? "-invincible" : ""}.svg`;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT; // Crete dino animation frames loop
    dinoElement.src = `img/dino-${isBowing ? "bow" : "run"}-${isSuperjumpActive ? "powerjump-" : isImmortalActive ? "invincible-" : ""}${dinoFrame}.svg`;
    currentFrameTime -= FRAME_TIME;
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

function onJump(event, isSuperjumpActive) {
  if (event.code !== "ArrowDown") {
    if (isJumping && (!isSuperjumpActive || superJumpCounter <= 0)) return;
    if (isSuperjumpActive) {
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
  dieSound.play();
  // Adjust superJumpCounter for keypress needed to restart the game
  superJumpCounter = 3;
}
