import { parseISO } from "date-fns";

import { getLastMonthsRanges } from "./date";

describe("date", () => {
  describe("getLastMonthsRanges", () => {
    it("should compute the last months ranges", () => {
      const startDate = parseISO("2021-02-10");
      expect(getLastMonthsRanges(3)(startDate)).toEqual([
        ["2021-02-01", "2021-02-10"],
        ["2021-01-01", "2021-01-31"],
        ["2020-12-01", "2020-12-31"],
      ]);
    });
  });
});
