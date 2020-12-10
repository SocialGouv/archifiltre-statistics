import axios from "axios";

import { matomoToken, matomoUrl } from "../config";
import type { MatomoEventCategory } from "./matomo-types";
import {
  getBulkRequestParamsFromLabels,
  sanitizeMatomoData,
} from "./matomo-utils";

const labels = [
  "FileTreeDrop",
  "CSV Export",
  "CSV with hashes Export",
  "Tree CSV Export",
  "METS Export",
  "Excel Export",
  "RESIP Export",
  "Audit report export",
];

const getBulkMatomoData = async (): Promise<MatomoEventCategory[][]> =>
  axios
    .get(matomoUrl, {
      params: {
        format: "JSON",
        method: "API.getBulkRequest",
        module: "API",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_auth: matomoToken,
        ...getBulkRequestParamsFromLabels(labels),
      },
    })
    .then(({ data }: { data: MatomoEventCategory[][] }) => data);

export const getMatomoData = async (): Promise<MatomoEventCategory[]> =>
  getBulkMatomoData().then(sanitizeMatomoData);
