import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

chai.use(chaiHttp);

describe("Game tests", () => {
  beforeEach(() => {
    res = null;
  });

  it("should render single.ejs if it was a get request with query one player", async () => {
    const res = await chai.request(app).get("/game").query({ player: "one" });
    console.log(res);
    expect(res.statusCode).to.equal(200);
    expect(res).to.be.html;
    expect(res.text).to.have.string("Player 1:");
    expect(res.text).to.have.string('value="single"');
  });
});
