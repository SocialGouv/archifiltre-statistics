import _, { mapValues } from "lodash";
import { map, pipe, property, sum } from "lodash/fp";
import querystring from "querystring";

import type { ArchifiltreCountStatistic } from "./../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoDownloadConfigObject,
} from "./../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";

const DOWNLOAD_DATE_RANGE: [string, string] = ["2020-01-01", "today"];

type MatomoDownload = {
  [date in string]: Record<string, number>[];
};

const totalMonthlyDownloadQuery = ({
  labelPattern,
}: MatomoDownloadConfigObject) => ({ idSite }: ApiParams) => {
  const date = DOWNLOAD_DATE_RANGE;
  return querystring.stringify({
    ...createMatomoRequestBaseParams(idSite, date),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    filter_pattern: labelPattern,
    method: "Events.getCategory",
    period: "month",
  });
};

const formatTotalMonthDownloadResponse = (downloads: MatomoDownload) =>
  // const mergeValues = pipe(map(property("nb_events")), sum);
  // return mapValues(downloads, mergeValues);
  _(downloads)
    .mapValues((download) =>
      _(download)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .map(({ nb_events }) => nb_events)
        .sum()
    )
    .value();

const totalMonthlyDownloadAggregator = () => (
  downloads: MatomoDownload
): ArchifiltreCountStatistic[] => {
  const formattedMatomoObject = formatTotalMonthDownloadResponse(downloads);

  return [
    {
      label: "monthlyDownload",
      value: formattedMatomoObject,
    },
  ];
};

export const totalMonthlyDownloadLoader = (
  config: MatomoDownloadConfigObject
): Loader => ({
  aggregator: totalMonthlyDownloadAggregator(),
  query: totalMonthlyDownloadQuery(config),
});
