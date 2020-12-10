import axios from "axios";
import { githubApiKey, githubApiUrl } from "../config";
import { convertGitHubDataToApiData, filterWikiItem } from "./github-utils";
import { GithubDataItem } from "./github-types";
import { ArchifiltreCountStatistic } from "../api-types";

export const getGitHubData = async (): Promise<ArchifiltreCountStatistic[]> =>
  axios
    .get(`${githubApiUrl}/repos/SocialGouv/archifiltre/traffic/popular/paths`, {
      headers: {
        Authorization: `token ${githubApiKey}`,
      },
    })
    .then(({ data }: { data: GithubDataItem[] }) => data)
    .then(filterWikiItem)
    .then(convertGitHubDataToApiData);
