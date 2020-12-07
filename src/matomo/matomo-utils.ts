import { flatten, map, pick, compose } from "lodash/fp";
import { MatomoEventCategory } from "./matomo-types";

type CreateMatomoMethodParams = {
  method: string;
  label: string;
};

const createMatomoMethod = ({ method, label }: CreateMatomoMethodParams) =>
  `method=${method}&idSite=9&date=2019-04-17,today&period=range&label=${label}`;

export const getBulkRequestParamsFromLabels = (labels: string[]) =>
  labels
    .map((label) => createMatomoMethod({ method: "Events.getCategory", label }))
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
