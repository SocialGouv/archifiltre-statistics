/* eslint-disable @typescript-eslint/naming-convention */
import { mapValues } from "lodash/fp";
import querystring from "querystring";

import type { MatomoEventCategory, MatomoSiteConfig } from "./matomo-types";
import {
  getBulkRequestParamsFromConfig,
  sanitizeMatomoData,
} from "./matomo-utils";

type TestData = {
  otherKey: string;
} & MatomoEventCategory;

describe("matomoUtils", () => {
  describe("getBulkRequestParamsFromConfig", () => {
    it("should format the queryParams for matomo", () => {
      const events = ["label1", "label2"];
      const idSite = 9;
      const actions = [
        {
          categoryId: 1,
        },
      ];
      const siteConfig: MatomoSiteConfig = {
        actions,
        events,
        idSite,
      };
      expect(
        mapValues(querystring.parse)(getBulkRequestParamsFromConfig(siteConfig))
      ).toEqual({
        "urls[0]": {
          date: "2019-04-17,today",
          idSite: "9",
          label: "label1",
          method: "Events.getCategory",
          period: "range",
        },
        "urls[1]": {
          date: "2019-04-17,today",
          idSite: "9",
          label: "label2",
          method: "Events.getCategory",
          period: "range",
        },
        "urls[2]": {
          date: "2019-04-17,today",
          idSite: "9",
          idSubtable: "1",
          method: "Events.getActionFromCategoryId",
          period: "range",
        },
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
          label: "label",
          value: 10,
        },
        {
          label: "label2",
          value: 20,
        },
      ]);
    });
  });
});
