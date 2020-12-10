import { compose, flatten, map, mapKeys, pick } from "lodash/fp";

import type { ArchifiltreCountStatistic } from "../api-types";
import type { MatomoEventCategory } from "./matomo-types";

type CreateMatomoMethodParams = {
  method: string;
  label: string;
};

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

const keysMap: Record<string, string> = {
  label: "label",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nb_events: "count",
};

const convertMatomoDataToApiData = mapKeys(
  (key: string): string => keysMap[key]
);

export const sanitizeMatomoData: <T extends MatomoEventCategory>(
  matomoApiResponse: T[][]
) => ArchifiltreCountStatistic[] = compose(
  map(convertMatomoDataToApiData),
  map(pick(["label", "nb_events"])),
  flatten
);
