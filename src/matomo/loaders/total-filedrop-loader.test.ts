import { totalFileDropLoaders } from "./total-filedrop-loader";
/* eslint-disable @typescript-eslint/naming-convention */

describe("total-filedrop-loader", () => {
  describe("totalFileDropLoader", () => {
    it("should return a valid matomo object", () => {
      // Given
      const apiParams = { categoryName: "fileDropTree" };
      const apiResult = [
        {
          avg_event_value: 0,
          label:
            "Total volume: 900 mo; \r\nFiles dropped: 153; \r\nFolders dropped: 50; \r\n[No extension]: 150; \r\n.txt: 3",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 200,
          nb_events_with_value: 0,
          nb_visits: 38,
          segment:
            "eventAction==Total+volume%3A+9+ko%3B+%0D%0AFiles+dropped%3A+153%3B+%0D%0AFolders+dropped%3A+50%3B+%0D%0A%5BNo+extension%5D%3A+150%3B+%0D%0A.txt%3A+3",
          sum_daily_nb_uniq_visitors: 20,
          sum_event_value: 0,
        },
        {
          avg_event_value: 0,
          label:
            "Total volume: 10 go; \r\nFiles dropped: 154; \r\nFolders dropped: 50; \r\n[No extension]: 150; \r\n.txt: 3; \r\n.csv: 1",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 62,
          nb_events_with_value: 0,
          nb_visits: 16,
          segment:
            "eventAction==Total+volume%3A+10+ko%3B+%0D%0AFiles+dropped%3A+154%3B+%0D%0AFolders+dropped%3A+50%3B+%0D%0A%5BNo+extension%5D%3A+150%3B+%0D%0A.txt%3A+3%3B+%0D%0A.csv%3A+1",
          sum_daily_nb_uniq_visitors: 9,
          sum_event_value: 0,
        },
        {
          avg_event_value: 0,
          label: "Files dropped: 2ko",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 32,
          nb_events_with_value: 0,
          nb_visits: 14,
          segment: "eventAction==Files+dropped%3A+2",
          sum_daily_nb_uniq_visitors: 14,
          sum_event_value: 0,
        },
      ];
      const [{ aggregator }] = totalFileDropLoaders(apiParams);
      const expectedValue = [{ label: "totalDropVolume", value: 1 }];

      // WHEN
      const aggregatedValue = aggregator(apiResult);

      // THEN
      expect(aggregatedValue).toEqual(expectedValue);
    });
  });
});
