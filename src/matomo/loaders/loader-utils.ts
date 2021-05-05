import { isString } from "lodash";

import type {
  ApiParams,
  Loader,
  MatomoEventConfig,
  MatomoEventConfigObject,
  SiteConfig,
} from "../matomo-types";
import type { ArchifiltreCountStatistic } from "./../../api-types";

export const sanitizeMatomoEventConfig = (
  config: MatomoEventConfig
): MatomoEventConfigObject =>
  typeof config === "string"
    ? {
        label: config,
      }
    : config;

export const normalizeRequestDate = (date: string | [string, string]): string =>
  isString(date) ? date : date.join(",");

export const createMatomoRequestBaseParams = (
  idSite: number,
  date: string | [string, string] = ["2020-01-01", "today"]
): Record<string, number | string> => ({
  date: normalizeRequestDate(date),
  idSite,
  period: "range",
});

export const runQuery = (loader: Loader, apiParams: ApiParams): string =>
  loader.query(apiParams);

export const runAggregator = (
  { aggregator }: Loader,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  response: any
): ArchifiltreCountStatistic[] => aggregator(response);

export const getApiParams = ({ idSite }: SiteConfig): ApiParams => ({
  idSite,
});

export const convertQueriesToMatomoQueryObject = (
  paramsList: string[]
): Record<string, string> =>
  paramsList.reduce(
    (urlParams, urlParam, index) => ({
      ...urlParams,
      [`urls[${index}]`]: urlParam,
    }),
    {}
  );
