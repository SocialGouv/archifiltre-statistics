import axios from "axios";
import { matomoToken, matomoUrl } from "../config";
import {
  getBulkRequestParamsFromLabels,
  sanitizeMatomoData,
} from "./matomo-utils";
import { MatomoEventCategory } from "./matomo-types";

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

export const getMatomoData = (): Promise<MatomoEventCategory[]> =>
  getBulkMatomoData().then(sanitizeMatomoData);

const getBulkMatomoData = (): Promise<MatomoEventCategory[][]> =>
  axios
    .get(matomoUrl, {
      params: {
        token_auth: matomoToken,
        module: "API",
        method: "API.getBulkRequest",
        format: "JSON",
        ...getBulkRequestParamsFromLabels(labels),
      },
    })
    .then(({ data }) => data);
