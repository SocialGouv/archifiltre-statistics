/* eslint-disable @typescript-eslint/naming-convention */
import { actionLoader, createMatomoEventActionMethod } from "./actions-loader";

describe("actions-loader", () => {
  describe("actionLoader", () => {
    it("should return a valid matomo query", () => {
      // Given
      const idSite = 9;
      const config = { categoryId: 1, filter_limit: -1 };
      const expectedResult =
        "date=2020-01-01%2Ctoday&idSite=9&period=range&filter_limit=-1&idSubtable=1&method=Events.getActionFromCategoryId";
      // When
      const query = createMatomoEventActionMethod({ config, idSite });

      // Then
      expect(query).toEqual(expectedResult);
    });

    it("should return a valid action matomo object", () => {
      // Given
      const apiParams = { categoryName: "download" };
      const apiResult = [
        {
          avg_event_value: 0,
          label: "v2.1.0 Windows 64 bits",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 1431,
          nb_events_with_value: 0,
          nb_visits: 1129,
          segment: "eventAction==v2.1.0+Windows+64+bits",
          sum_daily_nb_uniq_visitors: 1081,
          sum_event_value: 0,
        },
        {
          avg_event_value: 0,
          label: "v2.1.1 Windows 64 bits",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 765,
          nb_events_with_value: 0,
          nb_visits: 600,
          segment: "eventAction==v2.1.1+Windows+64+bits",
          sum_daily_nb_uniq_visitors: 585,
          sum_event_value: 0,
        },
      ];
      const { aggregator } = actionLoader(apiParams);
      const expectedValue = [
        { label: "v2.1.0 Windows 64 bits", value: 1431 },
        { label: "v2.1.1 Windows 64 bits", value: 765 },
      ];

      // WHEN
      const aggregatedValue = aggregator(apiResult);

      // THEN
      expect(aggregatedValue).toEqual(expectedValue);
    });
  });
});
