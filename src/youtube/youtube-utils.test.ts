import type { YoutubeData } from "./youtube-types";
import { convertYoutubeDataToApiData } from "./youtube-utils";

describe("youtube-utils", () => {
  describe("convertYoutubeDataToApiData", () => {
    it("should return ArchifiltreCountStatistic", () => {
      const youtubeData: YoutubeData = {
        items: [
          {
            statistics: {
              subscriberCount: "20",
              viewCount: "10",
            },
          },
        ],
      };

      expect(convertYoutubeDataToApiData(youtubeData)).toEqual([
        {
          label: "youtubeViews",
          value: 10,
        },
        {
          label: "youtubeSubscribers",
          value: 20,
        },
      ]);
    });
  });
});
