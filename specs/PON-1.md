# PON-1: Create a Pong game

## Goal

Build the most basic version of Pong — inspired by the original 1958/1972-era
two-paddle ball game — as a single-player experience: a human player against
a simple computer opponent. Deploy it live so it can be played in a browser.

## User-facing behaviour

- The game runs in a web browser, no login or account needed.
- A rectangular court is shown with two paddles (left and right) and one ball.
- The **left paddle** is controlled by the human player using the keyboard
  (e.g. Up/Down arrow keys or `W`/`S`).
- The **right paddle** is controlled by the computer: it tracks the ball's
  vertical position with simple logic (not unbeatable — a basic follow
  algorithm with limited speed is enough for "most basic").
- The ball starts in the middle of the court and moves toward one side.
  It bounces off the top and bottom walls, and off paddles when it hits them.
- If the ball passes a paddle (goes past the left or right edge), the other
  side scores a point, and the ball resets to the centre and relaunches.
- The current score (player vs. computer) is shown on screen at all times.
- There's no fixed "win" condition required for this first version — scoring
  just keeps going (a match-point/win screen can be added later if wanted).
- The game has a simple start state (e.g. a "click/press to start" or it just
  starts automatically) — kept minimal, no menus or settings.

## Acceptance criteria

1. Visiting the deployed URL loads a playable Pong game with no setup steps.
2. The player can move their paddle up and down with the keyboard, and the
   paddle stays within the court bounds (doesn't move off-screen).
3. The computer paddle moves on its own to track the ball, staying within
   the court bounds.
4. The ball bounces correctly off the top/bottom walls and off both paddles
   (angle/direction changes on paddle hit).
5. When the ball passes a paddle, the score for the other side increases by
   one and the ball resets to the centre and continues play.
6. The score is visible on screen and updates immediately after each point.
7. No JavaScript errors appear in the browser console during normal play.
8. The page has a favicon (no 404 in the console for it).
9. Works in a current desktop browser (Chrome/Firefox) at a reasonable
   window size; mobile/touch support is not required (see Out of scope).

## Out of scope

- Two-player (human vs human) mode.
- Difficulty levels, adjustable computer skill, or AI beyond simple tracking.
- Sound effects or music.
- Persistent high scores, accounts, or leaderboards.
- Mobile/touch controls.
- Match end screens, win conditions, or restart menus.
- Backend/server-side logic — this is a static, client-side game unless the
  design decides otherwise.
