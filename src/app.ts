import express from "express";
import packageJson from "../package.json";
import { getMatomoData } from "./matomo/matomo-service";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({ version: packageJson.version });
});

app.get("/liveness", (req, res, next) => {
  res.send("Alive");
});

app.get("/readyness", (req, res, next) => {
  res.send("Ready");
});

app.get("/statistics", async (req, res) => {
  const matomoData = await getMatomoData();
  res.json(matomoData);
});

app.listen(port);
