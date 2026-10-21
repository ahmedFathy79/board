# Canvas Board

Live website: https://board.generalahmed79.workers.dev

The production source is `index.html` in this repository. Cloudflare Workers Builds deploys the `main` branch automatically.

## Canvas navigation

- Scroll / two-finger trackpad movement pans the board.
- Pinch or Ctrl + wheel zooms around the pointer, including over cards.
- The background grid retains 24px spacing and a fixed dot radius at every zoom level.
- Embedded sites start in board-navigation mode. Choose **Interact** to use a player or embedded page; choose **Done** or move outside the card to restore board navigation. Events within an active cross-origin embed belong to that site.

## Appearance

Opaque rounded surfaces, a warm neutral canvas, and pastel note colors. Light/dark modes and custom colors remain available; glass blur has been removed.
