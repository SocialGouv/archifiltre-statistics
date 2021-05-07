import querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type { ApiParams, Loader } from "../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";

const createMatomoVisitMethod = (idSite: number, date?: string): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite, date),
    method: "VisitsSummary.getVisits",
    period: date ? "day" : "range",
  });

type VisitsQueryOptions = {
  date?: string;
};

const visitsQuery = ({ date }: VisitsQueryOptions = {}) => ({
  idSite,
}: ApiParams) => createMatomoVisitMethod(idSite, date);

const visitsAggregator = () => ({
  value,
}: {
  value: number;
}): ArchifiltreCountStatistic[] => [
  {
    label: "visitsCount",
    value,
  },
];

export const totalVisitsLoader = (): Loader => ({
  aggregator: visitsAggregator(),
  query: visitsQuery(),
});

const last30visitsAggregator = () => (
  visitsMap: Record<string, number>
): ArchifiltreCountStatistic[] => [
  {
    label: "last30DaysVisits",
    value: visitsMap,
  },
];

export const last30DaysVisitsLoader = (): Loader => ({
  aggregator: last30visitsAggregator(),
  query: visitsQuery({ date: "last30" }),
});
