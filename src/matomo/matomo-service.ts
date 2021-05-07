import axios from "axios";
import { compose, flatten } from "lodash/fp";
import querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import { matomoToken, matomoUrl } from "../config";
import { bindPromise, liftPromise } from "../utils/fp-util";
import {
  convertQueriesToMatomoQueryObject,
  getApiParams,
  runAggregator,
  runQuery,
} from "./loaders/loader-utils";
import type { MatomoEventCategory, SiteConfig } from "./matomo-types";

type BulkRequestData = {
  data: MatomoEventCategory[][];
};

const getBulkRequestParamsFromConfig = async (
  config: SiteConfig
): Promise<string[]> =>
  Promise.all(
    config.loaders.map(async (loader) => runQuery(loader, getApiParams(config)))
  );

export type RequestMatomoParams = Record<string, string> & {
  method: string;
};

export const requestMatomo = async (
  params: RequestMatomoParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: any }> =>
  axios.post(
    matomoUrl,
    querystring.stringify({
      format: "JSON",
      module: "API",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_auth: matomoToken,
      ...params,
    })
  );

const makeBulkRequest = async (
  params: Record<string, string>
): Promise<BulkRequestData> =>
  requestMatomo({
    method: "API.getBulkRequest",
    ...params,
  });

const formatResult = ({ data }: BulkRequestData): MatomoEventCategory[][] =>
  data;

const getBulkMatomoData = compose(
  liftPromise(formatResult),
  bindPromise(makeBulkRequest),
  liftPromise(convertQueriesToMatomoQueryObject),
  getBulkRequestParamsFromConfig
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMatomoDataSanitizer = (config: SiteConfig) => (response: any[]) =>
  config.loaders.flatMap((loader, index) =>
    runAggregator(loader, response[index])
  );

export const getMatomoData = async (
  config: SiteConfig
): Promise<ArchifiltreCountStatistic[]> =>
  getBulkMatomoData(config).then(createMatomoDataSanitizer(config));

export const getMultiSiteMatomoData = async (
  configs: SiteConfig[]
): Promise<ArchifiltreCountStatistic[]> =>
  Promise.all(configs.map(getMatomoData)).then(flatten);
