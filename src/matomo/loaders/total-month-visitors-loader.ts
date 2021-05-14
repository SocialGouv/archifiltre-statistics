import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type { ApiParams, Loader } from "../matomo-types";
import {
  createMatomoRequestBaseParams,
  TOTAL_MONTH_VISITORS_DATE_RANGE,
} from "./loader-utils";

const createMatomoTotalMonthVisitorsMethod = (
  idSite: number,
  date: [string, string]
): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite, date),
    method: "VisitsSummary.getVisits",
    period: "month",
  });

const totalMonthVisitorsQuery = (config: TotalMonthVisitorType) => ({
  idSite,
}: ApiParams) => createMatomoTotalMonthVisitorsMethod(idSite, config.date);

const totalMonthVisitorsAggregator = () => (
  totalMonthVisitors: Record<string, number>
): ArchifiltreCountStatistic[] => {
  return [
    {
      label: "totalMonthVisitors",
      value: totalMonthVisitors,
    },
  ];
};

type TotalMonthVisitorType = {
  date: [string, string];
};

export const totalMonthVisitorsLoader = (): Loader => ({
  aggregator: totalMonthVisitorsAggregator(),
  query: totalMonthVisitorsQuery({ date: TOTAL_MONTH_VISITORS_DATE_RANGE }),
});
