import { ArchifiltreCountStatistic } from "../api-types";
import { GithubDataItem } from "./github-types";
import { filter } from "lodash/fp";

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
