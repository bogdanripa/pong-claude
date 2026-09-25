(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const scoreEl = document.getElementById("score");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const PADDLE_WIDTH = 12;
  const PADDLE_HEIGHT = 80;
  const PADDLE_MARGIN = 20;
  const BALL_RADIUS = 8;

  const BASE_BALL_SPEED = 5; // px per fixed step
  const MAX_BALL_SPEED = 12; // px per fixed step
  const SPEED_UP_FACTOR = 1.05; // ball speeds up slightly on every paddle hit
  const SERVE_ANGLE_RANGE = Math.PI / 6; // +/-30 degrees off the horizontal
  const MAX_BOUNCE_ANGLE = Math.PI / 3; // +/-60 degrees off the horizontal
  const SERVE_DELAY_MS = 1000;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Game state. Paddle input/AI are added in another task; this task drives
  // ball movement, collisions and scoring.
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
      vx: 0,
      vy: 0,
    },
    score: {
      player: 0,
      computer: 0,
    },
    serveTimer: 0,
    pendingServeDirection: 1,
  };

  function updateScoreDisplay() {
    if (scoreEl) {
      scoreEl.textContent = `${state.score.player}   ${state.score.computer}`;
    }
  }

  function serveBall(direction) {
    const ball = state.ball;
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    const angle = (Math.random() * 2 - 1) * SERVE_ANGLE_RANGE;
    ball.vx = Math.cos(angle) * BASE_BALL_SPEED * direction;
    ball.vy = Math.sin(angle) * BASE_BALL_SPEED;
  }

  function start() {
    if (state.running) return;
    state.running = true;
    overlay.classList.add("hidden");
    serveBall(Math.random() < 0.5 ? 1 : -1);
  }

  overlay.addEventListener("click", start);
  window.addEventListener("keydown", start);

  // Fixed-timestep update: ball movement, collisions and scoring live here.
  // Player input and computer AI paddle movement land in another task.
  const STEP_MS = 1000 / 60;
  let accumulator = 0;
  let lastTime = null;

  function ballHitsPaddle(ball, paddle) {
    const closestX = clamp(ball.x, paddle.x, paddle.x + paddle.width);
    const closestY = clamp(ball.y, paddle.y, paddle.y + paddle.height);
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    return dx * dx + dy * dy <= ball.radius * ball.radius;
  }

  function bounceOffPaddle(paddle, side) {
    const ball = state.ball;
    const relativeIntersect =
      (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    const bounceAngle = clamp(relativeIntersect, -1, 1) * MAX_BOUNCE_ANGLE;
    const speed = Math.min(
      MAX_BALL_SPEED,
      Math.hypot(ball.vx, ball.vy) * SPEED_UP_FACTOR
    );
    const direction = side === "left" ? 1 : -1;
    ball.vx = Math.cos(bounceAngle) * speed * direction;
    ball.vy = Math.sin(bounceAngle) * speed;
    ball.x =
      side === "left"
        ? paddle.x + paddle.width + ball.radius
        : paddle.x - ball.radius;
  }

  function scorePoint(side) {
    state.score[side] += 1;
    updateScoreDisplay();

    const ball = state.ball;
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = 0;
    ball.vy = 0;

    // Serve toward whichever side just conceded the point.
    state.pendingServeDirection = side === "player" ? 1 : -1;
    state.serveTimer = SERVE_DELAY_MS;
  }

  function moveBall() {
    const ball = state.ball;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
    } else if (ball.y + ball.radius >= HEIGHT) {
      ball.y = HEIGHT - ball.radius;
      ball.vy = -Math.abs(ball.vy);
    }

    if (ball.vx < 0 && ballHitsPaddle(ball, state.player)) {
      bounceOffPaddle(state.player, "left");
    } else if (ball.vx > 0 && ballHitsPaddle(ball, state.computer)) {
      bounceOffPaddle(state.computer, "right");
    }

    if (ball.x + ball.radius < 0) {
      scorePoint("computer");
    } else if (ball.x - ball.radius > WIDTH) {
      scorePoint("player");
    }
  }

  function update(dtMs) {
    if (!state.running) return;

    if (state.serveTimer > 0) {
      state.serveTimer -= dtMs;
      if (state.serveTimer <= 0) {
        state.serveTimer = 0;
        serveBall(state.pendingServeDirection);
      }
      return;
    }

    moveBall();
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

  updateScoreDisplay();
  requestAnimationFrame(frame);
})();
