import { parseISO } from "date-fns";

import { getLastWeeksRanges } from "./date";

describe("date", () => {
  describe("getLastWeeksRanges", () => {
    it("should compute the last months ranges", () => {
      const startDate = parseISO("2021-02-10");
      expect(getLastWeeksRanges(3)(startDate)).toEqual([
        ["2021-02-07", "2021-02-10"],
        ["2021-01-31", "2021-02-06"],
        ["2021-01-24", "2021-01-30"],
      ]);
    });
  });
});
