import cors from "cors";
import express from "express";
import { flatten } from "lodash/fp";

import packageJson from "../package.json";
import { corsOrigins, port } from "./config";
import { getGitHubData } from "./github/github-service";
import { matomoConfig } from "./matomo/matomo-config";
import { getMultiSiteMatomoData } from "./matomo/matomo-service";
import { getYoutubeData } from "./youtube/youtube-service";

const app = express();

app.use(
  cors({
    origin: corsOrigins,
  })
);

app.get("/", (req, res) => {
  res.json({ version: packageJson.version });
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.get("/statistics", (req, res) => {
  void Promise.all([
    getMultiSiteMatomoData(matomoConfig),
    getYoutubeData(),
    getGitHubData(),
  ])
    .then(flatten)
    .then((data) => res.json(data));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
