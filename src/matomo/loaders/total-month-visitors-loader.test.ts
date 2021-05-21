import { totalMonthVisitorsLoader } from "./total-month-visitors-loader";

describe("total-month-visitors", () => {
  it("should return a correct matomo query", () => {
    const { query } = totalMonthVisitorsLoader();
    const apiParams = { date: ["2019-11-01", "today"], idSite: 9 };
    const matomoQuery = query(apiParams);
    const expectedQuery =
      "date=2019-11-01%2Ctoday&idSite=9&period=month&method=VisitsSummary.getVisits";

    expect(matomoQuery).toEqual(expectedQuery);
  });

  it("should return a correct matomo objects", () => {
    const { aggregator } = totalMonthVisitorsLoader();

    const apiResult = {
      "2019-11": 7,
      "2019-12": 131,
      "2020-01": 380,
      "2020-02": 562,
      "2020-03": 1372,
      "2020-04": 1211,
      "2020-05": 1244,
      "2020-06": 1058,
      "2020-07": 1149,
      "2020-08": 619,
      "2020-09": 1191,
      "2020-10": 1452,
      "2020-11": 1950,
      "2020-12": 1658,
      "2021-01": 1927,
      "2021-02": 1865,
      "2021-03": 2210,
      "2021-04": 1974,
      "2021-05": 916,
    };

    const aggregatedValue = aggregator(apiResult);
    const expectedValue = [
      {
        label: "totalMonthVisitors",
        value: {
          "2019-11": 7,
          "2019-12": 131,
          "2020-01": 380,
          "2020-02": 562,
          "2020-03": 1372,
          "2020-04": 1211,
          "2020-05": 1244,
          "2020-06": 1058,
          "2020-07": 1149,
          "2020-08": 619,
          "2020-09": 1191,
          "2020-10": 1452,
          "2020-11": 1950,
          "2020-12": 1658,
          "2021-01": 1927,
          "2021-02": 1865,
          "2021-03": 2210,
          "2021-04": 1974,
          "2021-05": 916,
        },
      },
    ];

    expect(aggregatedValue).toEqual(expectedValue);
  });
});
