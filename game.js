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

  // Game state. Paddle/ball movement, AI and scoring are added in later tasks;
  // this scaffold only renders the static layout each frame.
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

  // Fixed-timestep update: game logic (movement, AI, physics, scoring) is
  // added in later tasks. The loop and render pipeline are wired up now so
  // that work can plug into it.
  const STEP_MS = 1000 / 60;
  let accumulator = 0;
  let lastTime = null;

  function update(dtMs) {
    // no-op placeholder: paddle/ball movement lands in later tasks
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
