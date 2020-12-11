import axios from "axios";
import { flatten } from "lodash/fp";

import type { ArchifiltreCountStatistic } from "../api-types";
import { matomoToken, matomoUrl } from "../config";
import type { MatomoEventCategory, MatomoSiteConfig } from "./matomo-types";
import {
  getBulkRequestParamsFromConfig,
  sanitizeMatomoData,
} from "./matomo-utils";

const getBulkMatomoData = async (
  config: MatomoSiteConfig
): Promise<MatomoEventCategory[][]> =>
  axios
    .get(matomoUrl, {
      params: {
        format: "JSON",
        method: "API.getBulkRequest",
        module: "API",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_auth: matomoToken,
        ...getBulkRequestParamsFromConfig(config),
      },
    })
    .then(({ data }: { data: MatomoEventCategory[][] }) => data);

export const getMatomoData = async (
  config: MatomoSiteConfig
): Promise<ArchifiltreCountStatistic[]> =>
  getBulkMatomoData(config).then(sanitizeMatomoData);

export const getMultiSiteMatomoData = async (
  configs: MatomoSiteConfig[]
): Promise<ArchifiltreCountStatistic[]> =>
  Promise.all(configs.map(getMatomoData)).then(flatten);
