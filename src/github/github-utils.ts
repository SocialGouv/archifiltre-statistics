import { filter } from "lodash/fp";

import type { ArchifiltreCountStatistic } from "../api-types";
import type { GithubDataItem } from "./github-types";

export const filterWikiItem = filter<GithubDataItem>({
  path: "/SocialGouv/archifiltre/wiki/Wiki-Archifiltre",
});

export const convertGitHubDataToApiData = (
  githubDataItems: GithubDataItem[]
): ArchifiltreCountStatistic[] =>
  githubDataItems.map(({ count }) => ({
    label: "wikiViews",
    value: count,
  }));
