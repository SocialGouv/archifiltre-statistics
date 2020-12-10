import express from "express";
import { flatten } from "lodash/fp";

import packageJson from "../package.json";
import { port } from "./config";
import { getGitHubData } from "./github/github-service";
import { getMatomoData } from "./matomo/matomo-service";
import { getYoutubeData } from "./youtube/youtube-service";

const app = express();

app.get("/", (req, res) => {
  res.json({ version: packageJson.version });
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.get("/statistics", (req, res) => {
  void Promise.all([getMatomoData(), getYoutubeData(), getGitHubData()])
    .then(flatten)
    .then((data) => res.json(data));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
