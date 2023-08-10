import { expect } from "chai";
import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

chai.use(chaiHttp);

describe("Index tests", () => {
  it("should render the landing page when / gets hit", async () => {
    const res = await chai.request(app).get("/");

    expect(res).to.have.status(200);
    expect(res.text).to.have.string("1 player");
    expect(res.text).to.have.string("2 players");
    expect(res.text).to.have.string("/game");
  });
});
