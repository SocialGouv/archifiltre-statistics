/* eslint-disable @typescript-eslint/naming-convention */
import { eventLoader } from "./event-loader";

describe("event-loader", () => {
  describe("eventLoader", () => {
    it("should return a valid matomo query", () => {
      // given
      const apiParams = { idSite: 9, label: "FileTreeDrop" };
      const expectedValue =
        "date=2020-01-01,today&idSite=9&period=range&label=FileTreeDrop&method=Events.getCategory";
      const { query } = eventLoader(apiParams);
      // when
      const matomoQuery = query(apiParams);
      // then
      expect(matomoQuery).toEqual(expectedValue);
    });

    it("should return a correct matomo object", () => {
      // given
      const apiParams = { idSite: 9, label: "FileTreeDrop" };
      const apiResponse = [
        {
          avg_event_value: 0,
          idsubdatatable: 1,
          label: "FileTreeDrop",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 26140,
          nb_events_with_value: 0,
          nb_visits: 22640,
          segment: "eventCategory==FileTreeDrop",
          sum_daily_nb_uniq_visitors: 22470,
          sum_event_value: 0,
        },
      ];
      const expectedValue = [
        {
          label: "FileTreeDrop",
          value: 26140,
        },
      ];
      const { aggregator } = eventLoader(apiParams);

      // when
      const aggregatedValue = aggregator(apiResponse);

      expect(aggregatedValue).toEqual(expectedValue);
    });
  });
});
