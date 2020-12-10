import axios from "axios";

import type { ArchifiltreCountStatistic } from "../api-types";
import { githubApiKey, githubApiUrl } from "../config";
import type { GithubDataItem } from "./github-types";
import { convertGitHubDataToApiData, filterWikiItem } from "./github-utils";

export const getGitHubData = async (): Promise<ArchifiltreCountStatistic[]> =>
  axios
    .get(`${githubApiUrl}/repos/SocialGouv/archifiltre/traffic/popular/paths`, {
      headers: {
        authorization: `token ${githubApiKey}`,
      },
    })
    .then(({ data }: { data: GithubDataItem[] }) => data)
    .then(filterWikiItem)
    .then(convertGitHubDataToApiData);
