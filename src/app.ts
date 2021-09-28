import cors from "cors";
import express from "express";
import { flatten } from "lodash/fp";

import packageJson from "../package.json";
import { createCache } from "./caching/caching-service";
import { cacheTTL, corsOrigins, port } from "./config";
import { getGitHubData } from "./github/github-service";
import { matomoConfig } from "./matomo/matomo-config";
import { getMultiSiteMatomoData } from "./matomo/matomo-service";
import {
  matomoFileTreeDropFix,
  matomoMarkedToDeleteFix,
} from "./matomo-fix/matomo-fix-service";
import { getTypeformData } from "./typeform/typeform-service";
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

const statsCache = createCache(
  async () =>
    Promise.all([
      getMultiSiteMatomoData(matomoConfig()),
      getYoutubeData(),
      getGitHubData(),
      getTypeformData(),
    ]).then(flatten),

  cacheTTL
);

app.get("/statistics", (req, res) => {
  res.json({
    lastFetchTimestamp: statsCache.getLastFetchTimestamp(),
    result: statsCache.read(),
  });
});

const statsCacheFixed = createCache(
  async () => Promise.all([matomoFileTreeDropFix(), matomoMarkedToDeleteFix()]),
  cacheTTL
);

app.get("/statistics-fix", (req, res) => {
  res.json({
    lastFetchTimestamp: statsCacheFixed.getLastFetchTimestamp(),
    result: statsCacheFixed.read()?.flat(),
  });
});

app.post("/refresh", (req, res) => {
  void statsCache
    .refresh()
    .then(() => res.status(204).send())
    .catch(() => res.status(500).send("Error refreshing cache"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
