(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const PADDLE_WIDTH = 12;
  const PADDLE_HEIGHT = 80;
  const PADDLE_MARGIN = 20;
  const BALL_RADIUS = 8;
  const PLAYER_SPEED = 400; // px/s
  const COMPUTER_SPEED = 300; // px/s, slower than the player so it's beatable

  // Game state. Ball movement/physics and scoring are added in later tasks.
  const state = {
    running: false,
    player: {
      x: PADDLE_MARGIN,
      y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    computer: {
      x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
      y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    ball: {
      x: WIDTH / 2,
      y: HEIGHT / 2,
      radius: BALL_RADIUS,
    },
  };

  function start() {
    if (state.running) return;
    state.running = true;
    overlay.classList.add("hidden");
  }

  overlay.addEventListener("click", start);
  window.addEventListener("keydown", start);

  const UP_KEYS = new Set(["ArrowUp", "w", "W"]);
  const DOWN_KEYS = new Set(["ArrowDown", "s", "S"]);
  const input = { up: false, down: false };

  window.addEventListener("keydown", (e) => {
    if (UP_KEYS.has(e.key)) input.up = true;
    if (DOWN_KEYS.has(e.key)) input.down = true;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  });

  window.addEventListener("keyup", (e) => {
    if (UP_KEYS.has(e.key)) input.up = false;
    if (DOWN_KEYS.has(e.key)) input.down = false;
  });

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function movePaddle(paddle, dy) {
    paddle.y = clamp(paddle.y + dy, 0, HEIGHT - paddle.height);
  }

  function updatePlayer(dt) {
    let dy = 0;
    if (input.up) dy -= PLAYER_SPEED * dt;
    if (input.down) dy += PLAYER_SPEED * dt;
    movePaddle(state.player, dy);
  }

  function updateComputer(dt) {
    const paddle = state.computer;
    const center = paddle.y + paddle.height / 2;
    const maxStep = COMPUTER_SPEED * dt;
    const dy = clamp(state.ball.y - center, -maxStep, maxStep);
    movePaddle(paddle, dy);
  }

  // Fixed-timestep update: ball physics and scoring are added in later
  // tasks. The loop and render pipeline are wired up now so that work can
  // plug into it.
  const STEP_MS = 1000 / 60;
  let accumulator = 0;
  let lastTime = null;

  function update(dtMs) {
    if (!state.running) return;
    const dt = dtMs / 1000;
    updatePlayer(dt);
    updateComputer(dt);
  }

  function drawCourt() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = "#444";
    ctx.setLineDash([10, 14]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawPaddle(paddle) {
    ctx.fillStyle = "#eee";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  function drawBall(ball) {
    ctx.fillStyle = "#eee";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function render() {
    drawCourt();
    drawPaddle(state.player);
    drawPaddle(state.computer);
    drawBall(state.ball);
  }

  function frame(time) {
    if (lastTime === null) lastTime = time;
    accumulator += time - lastTime;
    lastTime = time;

    while (accumulator >= STEP_MS) {
      update(STEP_MS);
      accumulator -= STEP_MS;
    }

    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
