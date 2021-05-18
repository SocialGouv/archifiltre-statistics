/* eslint-disable @typescript-eslint/naming-convention */
import { totalMonthlyDownloadLoader } from "./total-monthly-download-loader";

describe("total-monthly-download", () => {
  it("should return a correct matomo query", () => {
    const config = { idSite: 20, labelPattern: "(appDownload|download)" };
    const { query } = totalMonthlyDownloadLoader(config);

    const expectedResult =
      "date=2020-01-01%2Ctoday&idSite=20&period=month&filter_pattern=(appDownload%7Cdownload)&method=Events.getCategory";
    const matomoQuery = query(config);

    expect(matomoQuery).toEqual(expectedResult);
  });

  it("should return a correct total monthly download", () => {
    const apiParams = { idSite: 20, labelPattern: "(appDownload|download)" };
    const { aggregator } = totalMonthlyDownloadLoader(apiParams);
    const apiResponse = {
      "2020-01": [
        {
          avg_event_value: 0,
          idsubdatatable: 1,
          label: "appDownload",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 355,
          nb_events_with_value: 0,
          nb_visits: 282,
          segment: "eventCategory==appDownload",
          sum_daily_nb_uniq_visitors: 274,
          sum_event_value: 0,
        },
      ],
      "2020-02": [
        {
          avg_event_value: 0,
          idsubdatatable: 1,
          label: "appDownload",
          max_event_value: 0,
          min_event_value: 0,
          nb_events: 494,
          nb_events_with_value: 0,
          nb_visits: 378,
          segment: "eventCategory==appDownload",
          sum_daily_nb_uniq_visitors: 366,
          sum_event_value: 0,
        },
      ],
    };

    const expectedResult = [
      {
        label: "monthlyDownload",
        value: {
          "2020-01": 355,
          "2020-02": 494,
        },
      },
    ];

    const aggregatedValue = aggregator(apiResponse);

    expect(aggregatedValue).toEqual(expectedResult);
  });
});
