import axios from "axios";
import { reduce } from "lodash";
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
import type {
  Aggregator,
  MatomoEventCategory,
  SiteConfig,
} from "./matomo-types";

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

export const makeBulkRequest = async (
  params: Record<string, string>
): Promise<BulkRequestData> =>
  requestMatomo({
    method: "API.getBulkRequest",
    ...params,
  });

export const formatResult = ({
  data,
}: BulkRequestData): MatomoEventCategory[][] => data;

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

const aggregateValues = (
  stats: ArchifiltreCountStatistic[],
  aggregators: Aggregator[]
): ArchifiltreCountStatistic[] =>
  reduce(aggregators, (acc, aggregator) => aggregator(acc), stats);

export const getMatomoData = async (
  config: SiteConfig
): Promise<ArchifiltreCountStatistic[]> =>
  getBulkMatomoData(config)
    .then(createMatomoDataSanitizer(config))
    .then((stats) =>
      config.aggregators ? aggregateValues(stats, config.aggregators) : stats
    );

export const getMultiSiteMatomoData = async (
  configs: SiteConfig[]
): Promise<ArchifiltreCountStatistic[]> =>
  Promise.all(configs.map(getMatomoData)).then(flatten);
