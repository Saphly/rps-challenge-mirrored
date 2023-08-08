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

  it("should setup a Game instance with the right players in app.locals when POST /start is hit with the form details", async () => {
    res = await chai.request(app).post(`${TESTPATH}/start`).type("form").send({
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
});
