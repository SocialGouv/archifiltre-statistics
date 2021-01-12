import cors from "cors";
import express from "express";
import { flatten } from "lodash/fp";

import packageJson from "../package.json";
import { createCache } from "./caching/caching-service";
import { corsOrigins, port } from "./config";
import { getGitHubData } from "./github/github-service";
import { matomoConfig } from "./matomo/matomo-config";
import { getMultiSiteMatomoData } from "./matomo/matomo-service";
import { getYoutubeData } from "./youtube/youtube-service";

const CACHE_TTL = 10 * 60 * 1000;

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
      getMultiSiteMatomoData(matomoConfig),
      getYoutubeData(),
      getGitHubData(),
    ]).then(flatten),
  CACHE_TTL
);

app.get("/statistics", (req, res) => {
  res.json({
    lastFetchTimestamp: statsCache.getLastFetchTimestamp(),
    result: statsCache.read(),
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
