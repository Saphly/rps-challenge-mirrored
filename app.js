import express from "express";
import indexRouter from "./routes/index.js";
import gameRouter from "./routes/game.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/favicon.ico", express.static("public/images/favicon.ico"));
app.use("/public", express.static("public"));

app.use("/game", gameRouter);
app.use("/", indexRouter);
app.use((req, res) => res.status(404).send(`Page not found`));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;

// TODO: FORMAT game.js LOGIC
