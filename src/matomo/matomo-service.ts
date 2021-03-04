import axios from "axios";
import { compose, flatten } from "lodash/fp";
import querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import { matomoToken, matomoUrl } from "../config";
import { liftPromise } from "../utils/fp-util";
import type { MatomoEventCategory, MatomoSiteConfig } from "./matomo-types";
import {
  createMatomoDataSanitizer,
  getBulkRequestParamsFromConfig,
} from "./matomo-utils";

type BulkRequestData = {
  data: MatomoEventCategory[][];
};

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
  getBulkRequestParamsFromConfig
);

export const getMatomoData = async (
  config: MatomoSiteConfig
): Promise<ArchifiltreCountStatistic[]> =>
  getBulkMatomoData(config).then(createMatomoDataSanitizer(config));

export const getMultiSiteMatomoData = async (
  configs: MatomoSiteConfig[]
): Promise<ArchifiltreCountStatistic[]> =>
  Promise.all(configs.map(getMatomoData)).then(flatten);
