import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import gameRouter from "./routes/game.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/favicon.ico", express.static("public/images/favicon.ico"));
app.use("/public", express.static("public"));

app.use("/game", gameRouter);
app.use("/", indexRouter);
app.use((req, res) => res.status(404).send(`Page not found`));

app.listen(process.env.PORT, () => {
  console.log(
    `Example app listening at http://${process.env.HOST}:${process.env.PORT}`
  );
});

export default app;
