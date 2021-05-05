import type {
  ApiParams,
  Loader,
  MatomoEventConfig,
  MatomoEventConfigObject,
  SiteConfig,
} from "../matomo-types";

import { isString } from "lodash";

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

export const runQuery = (loader: Loader, apiParams: ApiParams) =>
  loader.query(apiParams);

export const runAggregator = ({ aggregator }: Loader, response: any) =>
  aggregator(response);

export const getApiParams = ({ idSite }: SiteConfig) => ({
  idSite,
});

export const convertQueriesToMatomoQueryObject = (paramsList: string[]) =>
  paramsList.reduce(
    (urlParams, urlParam, index) => ({
      ...urlParams,
      [`urls[${index}]`]: urlParam,
    }),
    {}
  );
