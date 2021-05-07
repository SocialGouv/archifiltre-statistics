/* eslint-disable @typescript-eslint/naming-convention */
import { eventLoader, monthlyEventLoaders } from "./event-loader";

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

    it("should return a valid matomo object", () => {
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

  describe("monthlyEventLoaders", () => {
    beforeEach(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(2021, 4, 7));
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return a valid matomo query", () => {
      // given
      const config = {
        label: "FileTreeDrop",
      };
      const apiParams = {
        idSite: 20,
      };
      const { query } = monthlyEventLoaders(config)[0];
      const expectedResult =
        "date=2021-05-01,2021-05-07&idSite=20&period=range&label=FileTreeDrop&method=Events.getCategory";
      // when
      const matomoQuery = query(apiParams);

      expect(matomoQuery).toEqual(expectedResult);
    });

    it("should return a valid matomo object", () => {
      // given
      const apiResponse = [
        {
          avg_event_value: 0,
          idsubdatatable: 14,
          label: "FileTreeDrop",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 1287,
          nb_events_with_value: 0,
          nb_visits: 1218,
          segment: "eventCategory==FileTreeDrop",
          sum_daily_nb_uniq_visitors: 1264,
          sum_event_value: 0,
        },
      ];
      const config = {
        label: "FileTreeDrop",
      };
      const { aggregator } = monthlyEventLoaders(config)[0];
      const expectedResult = [{ label: "FileTreeDrop:2021-05", value: 1287 }];

      // when
      const aggregatedValue = aggregator(apiResponse);
      expect(aggregatedValue).toEqual(expectedResult);
    });
  });
});
