/* eslint-disable @typescript-eslint/naming-convention */
import { createMatomoEventActionMethod } from "../matomo-action-query";
import { RELEASE_DATE_3_2 } from "./loader-utils";
import { markedToDeleteLoaders } from "./marked-to-delete-files-loader";

describe("marked-to-delete-files-loader", () => {
  it("should return a valid matomo query", () => {
    const expectedQuery =
      "date=2021-04-14&idSite=9&period=range&filter_limit=-1&idSubtable=9&method=Events.getActionFromCategoryId";
    const apiParams = {
      config: {
        categoryId: 9,
        date: RELEASE_DATE_3_2,
        filter_limit: -1,
      },
      idSite: 9,
    };
    const matomoQuery = createMatomoEventActionMethod(apiParams);
    expect(matomoQuery).toEqual(expectedQuery);
  });

  it("should return a valid matomo object", () => {
    const apiParams = {
      categoryName: "Element marked to delete",
      date: RELEASE_DATE_3_2,
      idSite: 9,
    };

    const apiResponse = [
      {
        avg_event_value: 0,
        label: "Volume to delete: 60662032o; Elements to delete: 901",
        max_event_value: 0,
        min_event_value: 0,
        nb_events: 5,
        nb_events_with_value: 0,
        nb_visits: 5,
        segment:
          "eventAction==Volume+to+delete%3A+60662032o%3B+Elements+to+delete%3A+901",
        sum_daily_nb_uniq_visitors: 5,
        sum_event_value: 0,
      },
      {
        avg_event_value: 0,
        label: "Volume to delete: 20443o; Elements to delete: 2",
        max_event_value: 0,
        min_event_value: 0,
        nb_events: 2,
        nb_events_with_value: 0,
        nb_visits: 2,
        segment:
          "eventAction==Volume+to+delete%3A+20443o%3B+Elements+to+delete%3A+2",
        sum_daily_nb_uniq_visitors: 2,
        sum_event_value: 0,
      },
    ];

    const [{ aggregator }] = markedToDeleteLoaders(apiParams);

    const expectedResult = [
      {
        label: "totalMarkedToDelete",
        value: 1,
      },
      { label: "carbonFootprintInKilo", value: 19 },
      {
        label: "carbonFootprintPaperEquivalence",
        value: 4142,
      },
    ];

    const aggregated = aggregator(apiResponse);
    expect(aggregated).toEqual(expectedResult);
  });
});
