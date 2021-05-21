import {
  averageMonthlyVisitorsLoader,
  last30DaysVisitsLoader,
  totalVisitsLoader,
} from "./visits-loader";

describe("visits-loader", () => {
  describe("totalVisitsLoader", () => {
    it("should return a valid matomo query", () => {
      //GIVEN
      const { query } = totalVisitsLoader();
      const apiParams = { idSite: 20 };
      const expectedResult =
        "date=2020-01-01%2Ctoday&idSite=20&period=range&method=VisitsSummary.getVisits";

      //WHEN
      const matomoQuery = query(apiParams);
      //THEN
      expect(matomoQuery).toEqual(expectedResult);
    });

    it("should return a valid visits count object", () => {
      // GIVEN
      const { aggregator } = totalVisitsLoader();
      const apiResponse = { value: 10000 };
      const expectedResult = [{ label: "visitsCount", value: 10000 }];

      // WHEN
      const aggregatedValue = aggregator(apiResponse);

      // THEN
      expect(aggregatedValue).toEqual(expectedResult);
    });
  });

  describe("last30visitsLoader", () => {
    it("should return a valid matomo query", () => {
      //GIVEN
      const { query } = last30DaysVisitsLoader();
      const apiParams = { idSite: 20 };
      const expectedResult =
        "date=last30&idSite=20&period=day&method=VisitsSummary.getVisits";

      //WHEN
      const matomoQuery = query(apiParams);
      //THEN
      expect(matomoQuery).toEqual(expectedResult);
    });

    it("should return a valid visits count object", () => {
      // GIVEN
      const { aggregator } = last30DaysVisitsLoader();
      const apiResponse = {
        "2021-04-07": 32,
        "2021-04-08": 25,
        "2021-04-09": 30,
        "2021-04-10": 3,
        "2021-04-11": 11,
        "2021-04-12": 33,
        "2021-04-13": 124,
        "2021-04-14": 59,
        "2021-04-15": 77,
        "2021-04-16": 126,
        "2021-04-17": 14,
        "2021-04-18": 11,
        "2021-04-19": 65,
        "2021-04-20": 72,
        "2021-04-21": 71,
        "2021-04-22": 76,
        "2021-04-23": 51,
        "2021-04-24": 11,
        "2021-04-25": 15,
        "2021-04-26": 54,
        "2021-04-27": 45,
        "2021-04-28": 33,
        "2021-04-29": 49,
        "2021-04-30": 52,
        "2021-05-01": 13,
        "2021-05-02": 10,
        "2021-05-03": 48,
        "2021-05-04": 61,
        "2021-05-05": 47,
        "2021-05-06": 21,
      };
      const expectedResult = [
        { label: "last30DaysVisits", value: apiResponse },
      ];

      // WHEN
      const aggregatedValue = aggregator(apiResponse);

      // THEN
      expect(aggregatedValue).toEqual(expectedResult);
    });
  });

  describe("averageDailyVisitors", () => {
    it("should return a valid monthly average visitors count", () => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(2021, 4, 18));
      const { aggregator } = averageMonthlyVisitorsLoader();
      const apiResponse = { value: 22921 };
      const aggregatedValue = aggregator(apiResponse);
      const expectedResult = [{ label: "averageMonthlyVisitors", value: 1433 }];

      expect(aggregatedValue).toEqual(expectedResult);
      jest.useRealTimers();
    });
  });
});
