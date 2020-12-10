import { compose, flatten, map, pick } from "lodash/fp";

import type { MatomoEventCategory } from "./matomo-types";

interface CreateMatomoMethodParams {
  method: string;
  label: string;
}

const createMatomoMethod = ({ method, label }: CreateMatomoMethodParams) =>
  `method=${method}&idSite=9&date=2019-04-17,today&period=range&label=${label}`;

type RequestParams = Record<string, string>;

export const getBulkRequestParamsFromLabels = (
  labels: string[]
): RequestParams =>
  labels
    .map((label) => createMatomoMethod({ label, method: "Events.getCategory" }))
    .reduce(
      (urlParams, urlParam, index) => ({
        ...urlParams,
        [`urls[${index}]`]: urlParam,
      }),
      {}
    );

export const sanitizeMatomoData: <T extends MatomoEventCategory>(
  matomoApiResponse: T[][]
) => MatomoEventCategory[] = compose(
  map(pick(["label", "nb_events"])),
  flatten
);
