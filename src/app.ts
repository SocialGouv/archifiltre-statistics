import express from "express";
import packageJson from "../package.json";
import { getMatomoData } from "./matomo/matomo-service";
import { port } from "./config";

const app = express();

app.get("/", (req, res) => {
  res.json({ version: packageJson.version });
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.get("/statistics", async (req, res) => {
  const matomoData = await getMatomoData();
  res.json(matomoData);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
