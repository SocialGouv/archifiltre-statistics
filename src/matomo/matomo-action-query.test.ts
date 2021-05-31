/* eslint-disable @typescript-eslint/naming-convention */
import { createMatomoEventActionMethod } from "./matomo-action-query";

describe("actions-query", () => {
  describe("actionQuery", () => {
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
  });
});
