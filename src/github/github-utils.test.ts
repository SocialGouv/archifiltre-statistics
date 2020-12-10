import type { GithubDataItem } from "./github-types";
import { convertGitHubDataToApiData, filterWikiItem } from "./github-utils";

describe("github-utils", () => {
  describe("filterWikiItem", () => {
    it("should filter wiki item", () => {
      const githubData: GithubDataItem[] = [
        { count: 42, path: "test" },
        { count: 10, path: "/SocialGouv/archifiltre/wiki/Wiki-Archifiltre" },
      ];

      expect(filterWikiItem(githubData)).toEqual([
        {
          count: 10,
          path: "/SocialGouv/archifiltre/wiki/Wiki-Archifiltre",
        },
      ]);
    });
  });

  describe("convertGithubDataToApiData", () => {
    it("should return ArchifiltreCountStatistic", () => {
      const githubData: GithubDataItem[] = [{ count: 42, path: "test" }];

      expect(convertGitHubDataToApiData(githubData)).toEqual([
        {
          label: "wikiViews",
          value: 42,
        },
      ]);
    });
  });
});
