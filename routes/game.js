import express from "express";
import Game from "../src/game.js";

const router = express.Router();

router.post("/start", (req, res) => {
  const game = new Game();

  const names =
    req.body.gameType === "multi"
      ? [req.body.player1, req.body.player2]
      : [req.body.player1, "Bot"];

  game.setup(names, req.body.gameType);
  req.app.locals.game = game;

  res.render("play", {
    round: game.round,
    players: game.players,
    gameType: game.gameType,
  });
});

// p1 press submit =>
// show what bot chose and the result =>
// increment round && increment point to winner(if any)

router.post("/play-round", (req, res) => {
  const game = req.app.locals.game;

  game.gameType === "single"
    ? game.play(req.body.p1Choice)
    : game.play(req.body.p1Choice, req.body.p2Choice);

  res.render("roundResult", {
    round: game.round,
    players: game.players,
    gameType: game.gameType,
  });
});

router.get("/next-round", (req, res) => {
  const game = req.app.locals.game;

  game.incrementRound();

  res.render("play", {
    round: game.round,
    players: game.players,
    gameType: game.gameType,
  });
});

router.get("/end", (req, res) => {
  const game = req.app.locals.game;

  const winner = game.winner();

  res.render("end", {
    winner: winner.name,
    points: winner.points,
  });
});

router.get("/", (req, res) => {
  req.query.player === "single" ? res.render("single") : res.render("multi");
});

export default router;
