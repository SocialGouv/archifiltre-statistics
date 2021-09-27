import { isString } from "lodash";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoEventConfig,
  MatomoEventConfigObject,
  SiteConfig,
} from "../matomo-types";

export const DEFAULT_START_DATE = "2020-01-01";
export const RELEASE_DATE_3_2 = "2021-06-15";
export const TOTAL_MONTH_VISITORS_DATE_RANGE: [string, string] = [
  "2019-11-01",
  "today",
];

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

export const runQuery = async (
  loader: Loader,
  apiParams: ApiParams
): Promise<string> => loader.query(apiParams);

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
