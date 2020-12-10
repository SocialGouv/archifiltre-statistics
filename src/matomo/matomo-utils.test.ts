/* eslint-disable @typescript-eslint/naming-convention */
import type { MatomoEventCategory } from "./matomo-types";
import {
  getBulkRequestParamsFromLabels,
  sanitizeMatomoData,
} from "./matomo-utils";

type TestData = {
  otherKey: string;
} & MatomoEventCategory;

describe("matomoUtils", () => {
  describe("getBulkRequestParamsFromLabels", () => {
    it("should format the queryParams for matomo", () => {
      const labels = ["label1", "label2"];
      expect(getBulkRequestParamsFromLabels(labels)).toEqual({
        "urls[0]":
          "method=Events.getCategory&idSite=9&date=2019-04-17,today&period=range&label=label1",
        "urls[1]":
          "method=Events.getCategory&idSite=9&date=2019-04-17,today&period=range&label=label2",
      });
    });
  });

  describe("sanitizeMatomoData", () => {
    it("should remove unwanted data and flatten", () => {
      const matomoData: TestData[][] = [
        [
          {
            label: "label",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            nb_events: 10,
            otherKey: "otherKey",
          },
        ],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        [{ label: "label2", nb_events: 20, otherKey: "otherKey" }],
      ];

      expect(sanitizeMatomoData(matomoData)).toEqual([
        {
          count: 10,
          label: "label",
        },
        {
          count: 20,
          label: "label2",
        },
      ]);
    });
  });
});
