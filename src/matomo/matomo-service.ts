import axios from "axios";
import { compose, flatten } from "lodash/fp";
import querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import { matomoToken, matomoUrl } from "../config";
import { liftPromise } from "../utils/fp-util";
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

const getBulkRequestParamsFromConfig = (config: SiteConfig): string[] =>
  config.loaders.map((loader) => runQuery(loader, getApiParams(config)));

const makeBulkRequest = async (
  params: Record<string, string>
): Promise<BulkRequestData> =>
  axios.post(
    matomoUrl,
    querystring.stringify({
      format: "JSON",
      method: "API.getBulkRequest",
      module: "API",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_auth: matomoToken,
      ...params,
    })
  );

const formatResult = ({ data }: BulkRequestData): MatomoEventCategory[][] =>
  data;

const getBulkMatomoData = compose(
  liftPromise(formatResult),
  makeBulkRequest,
  convertQueriesToMatomoQueryObject,
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
