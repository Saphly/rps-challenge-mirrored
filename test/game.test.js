import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import Game from "../src/game.js";
import Player from "../src/player.js";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

chai.use(chaiHttp);
const TESTPATH = "/game";

describe("Game tests", () => {
  let res;

  beforeEach(() => {
    res = null;
  });

  describe("Single player case", () => {
    it("should render single.ejs when GET /game was hit with query single player", async () => {
      res = await chai.request(app).get(TESTPATH).query({ player: "single" });

      expect(res).to.have.status(200);
      expect(res).to.be.html;
      expect(res.text).to.have.string("Player 1:");
      expect(res.text).to.have.string('value="single"');
    });

    it("should setup a Game instance with player 1 and BOT in app.locals when POST /start is hit with form submission of player 1's name", async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/start`)
        .type("form")
        .send({
          gameType: "single",
          player1: "squidward",
        });

      expect(res).to.have.status(200);
      expect(res).to.be.html;

      expect(app.locals.game).to.be.an.instanceOf(Game);
      expect(app.locals.game.players).to.be.an("array");
      expect(app.locals.game.players[0]).to.be.an.instanceOf(Player);
      expect(app.locals.game.players[1]).to.include({ name: "Bot" });
      expect(app.locals.game.gameType).to.equal("single");
      expect(app.locals.game.round).to.equal(1);
    });

    it("should increment round number when a game is played ", async () => {
      await chai.request(app).post(`${TESTPATH}/start`).type("form").send({
        gameType: "single",
        player1: "squidward",
      });

      res = await chai
        .request(app)
        .post(`${TESTPATH}/play-round`)
        .type("form")
        .send({
          p1Choice: "rock",
        });

      expect(res).to.have.status(200);
      expect(app.locals.game.round).to.equal(2);
    });
  });

  describe("Two players case", () => {
    it("should render multi.ejs when GET /game was hit with query multi player", async () => {
      res = await chai.request(app).get(TESTPATH).query({ player: "multi" });

      expect(res).to.have.status(200);
      expect(res).to.be.html;
      expect(res.text).to.have.string("Player 1:");
      expect(res.text).to.have.string("Player 2:");
      expect(res.text).to.have.string('value="multi"');
    });

    it("should setup a Game instance with both player 1 and 2 in app.locals when POST /start is hit with form submission of both player's name", async () => {
      res = await chai
        .request(app)
        .post(`${TESTPATH}/start`)
        .type("form")
        .send({
          gameType: "multi",
          player1: "squid",
          player2: "ward",
        });

      expect(res).to.have.status(200);
      expect(res).to.be.html;

      expect(app.locals.game).to.be.an.instanceOf(Game);
      expect(app.locals.game.players).to.be.an("array");
      expect(app.locals.game.players[0]).to.be.an.instanceOf(Player);
      expect(app.locals.game.players[1]).to.include({ name: "ward" });
      expect(app.locals.game.gameType).to.equal("multi");
      expect(app.locals.game.round).to.equal(1);
    });
  });

  it("should end the game and render the end page", () => {});
});
