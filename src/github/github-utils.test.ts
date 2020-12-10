import { GithubDataItem } from "./github-types";
import { convertGitHubDataToApiData, filterWikiItem } from "./github-utils";

describe("github-utils", () => {
  describe("filterWikiItem", () => {
    it("should filter wiki item", () => {
      const githubData: GithubDataItem[] = [
        { path: "test", count: 42 },
        { path: "/SocialGouv/archifiltre/wiki/Wiki-Archifiltre", count: 10 },
      ];

      expect(filterWikiItem(githubData)).toEqual([
        {
          path: "/SocialGouv/archifiltre/wiki/Wiki-Archifiltre",
          count: 10,
        },
      ]);
    });
  });

  describe("convertGithubDataToApiData", () => {
    it("should return ArchifiltreCountStatistic", () => {
      const githubData: GithubDataItem[] = [{ path: "test", count: 42 }];

      expect(convertGitHubDataToApiData(githubData)).toEqual([
        {
          label: "wikiViews",
          value: 42,
        },
      ]);
    });
  });
});
