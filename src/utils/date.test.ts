import { parseISO } from "date-fns";

import { getLastWeeksRanges, getMatomoLastWeeksRange } from "./date";

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

  describe("getMatomoLastWeeksRanges", () => {
    it("should compute the last months ranges", () => {
      const now = parseISO("2021-06-20");
      const start = parseISO("2021-06-10");
      expect(getMatomoLastWeeksRange(now, start)).toEqual([
        ["2021-06-10", "2021-06-16"],
        ["2021-06-17", "2021-06-23"],
      ]);
    });
  });
});
