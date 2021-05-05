import { ApiParams } from "./../matomo-types";
import querystring from "querystring";
import { Loader } from "../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";
import { ArchifiltreCountStatistic } from "../../api-types";

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
  query: visitsQuery(),
  aggregator: visitsAggregator(),
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
  query: visitsQuery({ date: "last30" }),
  aggregator: last30visitsAggregator(),
});
