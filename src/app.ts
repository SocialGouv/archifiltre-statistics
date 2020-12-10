import express from "express";

import packageJson from "../package.json";
import { port } from "./config";
import { getMatomoData } from "./matomo/matomo-service";

const app = express();

app.get("/", (req, res) => {
  res.json({ version: packageJson.version });
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/statistics", async (req, res) => {
  const matomoData = await getMatomoData();
  res.json(matomoData);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
