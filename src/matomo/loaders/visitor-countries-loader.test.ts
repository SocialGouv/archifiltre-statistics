/* eslint-disable @typescript-eslint/naming-convention */
import { visitorCountriesLoader } from "./visitor-countries-loader";

describe("visitor-countries-loader", () => {
  describe("visitorCountriesLoader", () => {
    it("should return a valid matomo query", () => {
      // Given
      const { query } = visitorCountriesLoader();
      const apiParams = { idSite: 9 };
      const expectedResult =
        "date=2020-01-01%2Ctoday&idSite=9&period=range&method=UserCountry.getCountry";
      // When
      const matomoQuery = query(apiParams);
      // Then
      expect(matomoQuery).toEqual(expectedResult);
    });

    it("should return a valid vistor countries object", () => {
      // Given
      const { aggregator } = visitorCountriesLoader();
      const apiResponse = [
        {
          bounce_count: 392,
          code: "fr",
          label: "France",
          logo: "plugins/Morpheus/icons/dist/flags/fr.png",
          logoHeight: 16,
          max_actions: 633,
          nb_actions: 11915,
          nb_visits: 1435,
          nb_visits_converted: 0,
          segment: "countryCode==fr",
          sum_daily_nb_uniq_visitors: 1423,
          sum_daily_nb_users: 0,
          sum_visit_length: 891629,
        },
        {
          bounce_count: 17,
          code: "de",
          label: "Germany",
          logo: "plugins/Morpheus/icons/dist/flags/de.png",
          logoHeight: 16,
          max_actions: 24,
          nb_actions: 56,
          nb_visits: 21,
          nb_visits_converted: 0,
          segment: "countryCode==de",
          sum_daily_nb_uniq_visitors: 21,
          sum_daily_nb_users: 0,
          sum_visit_length: 2847,
        },
      ];
      const expectedResult = [
        { label: "visitorCountries", value: { de: 21, fr: 1435 } },
      ];

      // When
      const matomoAggregatedValue = aggregator(apiResponse);
      // Then
      expect(matomoAggregatedValue).toEqual(expectedResult);
    });
  });
});
