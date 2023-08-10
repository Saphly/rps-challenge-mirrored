import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

import app from "../app.js";
import Game from "../src/game.js";
import Player from "../src/player.js";

chai.use(chaiHttp);
const TESTPATH = "/game";

describe("Game tests", () => {
  let res;

  afterEach(() => {
    res = null;
  });

  it("should render single.ejs when GET /game was hit with query single player", async () => {
    res = await chai.request(app).get(TESTPATH).query({ player: "single" });

    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res.text).to.have.string("Player 1:");
    expect(res.text).to.have.string('value="single"');
  });

  it("should render multi.ejs when GET /game was hit with query multi player", async () => {
    res = await chai.request(app).get(TESTPATH).query({ player: "multi" });

    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res.text).to.have.string("Player 1:");
    expect(res.text).to.have.string("Player 2:");
    expect(res.text).to.have.string('value="multi"');
  });

  it("should render the end page when /end gets hit", async () => {
    res = await chai.request(app).post(`${TESTPATH}/start`).type("form").send({
      gameType: "single",
      player1: "squidward",
    });

    res = await chai.request(app).get(`${TESTPATH}/end`);

    expect(res).to.have.status(200);
    expect(res.text).to.have.string("Rematch");
  });

  describe("Single player case", () => {
    beforeEach(async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/start`)
        .type("form")
        .send({
          gameType: "single",
          player1: "squidward",
        });
    });

    it("should setup a Game instance with player 1 and BOT in app.locals when POST /start is hit with form submission of player 1's name", async () => {
      expect(res).to.have.status(200);
      expect(res).to.be.html;

      expect(app.locals.game).to.be.an.instanceOf(Game);
      expect(app.locals.game.players).to.be.an("array");
      expect(app.locals.game.players[0]).to.be.an.instanceOf(Player);
      expect(app.locals.game.players[1]).to.include({ name: "Bot" });
      expect(app.locals.game.gameType).to.equal("single");
      expect(app.locals.game.round).to.equal(1);
    });

    it("should render roundResult page when /play-round gets hit and show BOT has made a choice", async () => {
      expect(app.locals.game.players[1].choice).to.be.null;

      res = await chai
        .request(app)
        .post(`${TESTPATH}/play-round`)
        .type("form")
        .send({
          p1Choice: "rock",
        });

      expect(res).to.have.status(200);
      expect(app.locals.game.players[0].choice).to.equal("rock");
      expect(app.locals.game.players[1].choice).to.not.be.null;
      expect(res.text).to.not.have.string("<input");
      expect(res.text).to.have.string("/next-round");
    });

    it("should increment round 1 to round 2 when /next-round gets hit", async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/play-round`)
        .type("form")
        .send({
          p1Choice: "rock",
        });

      expect(app.locals.game.round).to.equal(1);

      res = await chai.request(app).get(`${TESTPATH}/next-round`);

      expect(res).to.have.status(200);
      expect(app.locals.game.round).to.equal(2);
    });
  });

  describe("Two players case", () => {
    beforeEach(async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/start`)
        .type("form")
        .send({
          gameType: "multi",
          player1: "squid",
          player2: "ward",
        });
    });

    it("should setup a Game instance with both player 1 and 2 in app.locals when POST /start is hit with form submission of both player's name", async () => {
      expect(res).to.have.status(200);
      expect(res).to.be.html;

      expect(app.locals.game).to.be.an.instanceOf(Game);
      expect(app.locals.game.players).to.be.an("array");
      expect(app.locals.game.players[0]).to.be.an.instanceOf(Player);
      expect(app.locals.game.players[1]).to.include({ name: "ward" });
      expect(app.locals.game.gameType).to.equal("multi");
      expect(app.locals.game.round).to.equal(1);
    });

    it("should render end page with the winner's (player 1) name when /end gets hit", async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/play-round`)
        .type("form")
        .send({
          p1Choice: "rock",
          p2Choice: "scissors",
        });

      res = await chai.request(app).get(`${TESTPATH}/end`);

      expect(res).to.have.status(200);
      expect(res.text).to.have.string("squid!");
    });

    it("should render end page with the winner's (player 1) name when /end gets hit", async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/play-round`)
        .type("form")
        .send({
          p1Choice: "lizard",
          p2Choice: "rock",
        });

      res = await chai.request(app).get(`${TESTPATH}/end`);

      expect(res).to.have.status(200);
      expect(res.text).to.have.string("ward!");
    });
  });
});
