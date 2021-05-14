import { format, parseISO } from "date-fns/fp";
import { isString } from "lodash";
import { compose } from "lodash/fp";
import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoEventCategory,
  MatomoEventConfig,
} from "../matomo-types";
import { getLastMonthsRanges } from "./../../utils/date";
import {
  createMatomoRequestBaseParams,
  sanitizeMatomoEventConfig,
} from "./loader-utils";

export type EventLoaderOptions = {
  label: string;
  period?: string;
};

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  period?: string;
  date?: [string, string];
};

const createMatomoEventCategoryMethod = ({
  config,
  idSite,
  date,
  period,
}: CreateMatomoEventCategoryMethodParams) => {
  const { label } = sanitizeMatomoEventConfig(config);
  return querystring.stringify(
    {
      ...createMatomoRequestBaseParams(idSite, date),
      label,
      method: "Events.getCategory",
      period: period ?? "range",
    },
    "&",
    "=",
    { encodeURIComponent: (val) => val }
  );
};

export const eventQuery = ({ label, period }: EventLoaderOptions) => ({
  idSite,
}: ApiParams): string =>
  createMatomoEventCategoryMethod({ config: label, idSite, period });

export const formatEventsResponse = () => (
  eventCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  // eslint-disable-next-line @typescript-eslint/naming-convention
  eventCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const eventAggregator = () => (response: MatomoEventCategory[]) =>
  formatEventsResponse()(response);

export const eventLoader = ({ label, period }: EventLoaderOptions): Loader => ({
  aggregator: eventAggregator(),
  query: eventQuery({ label, period }),
});

const MONTHS_REQUESTED = 12;

type CreateMonthlyEvenMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  date: [string, string];
};
const getMatomoLastMonthsRange = getLastMonthsRanges(MONTHS_REQUESTED);

const createMonthlyEventMethod = ({
  config,
  idSite,
  date,
}: CreateMonthlyEvenMethodParams) =>
  createMatomoEventCategoryMethod({ config, date, idSite });

type MonthlyEventQueryOptions = {
  config: EventLoaderOptions;
  date: [string, string];
};

const monthlyEventQuery = ({ config, date }: MonthlyEventQueryOptions) => ({
  idSite,
}: ApiParams) => createMonthlyEventMethod({ config, date, idSite });

const formatResultDate = compose(format("y-MM"), parseISO);

const getConfigLabel = (config: MatomoEventConfig) =>
  isString(config) ? config : config.label;

const formatMonthlyApiResult = (config: MatomoEventConfig, date: string) => (
  response: MatomoEventCategory[]
) => ({
  label: `${getConfigLabel(config)}:${formatResultDate(date)}`,
  value: response[0]?.nb_events || 0,
});

const monthlyEventsAggregator = (
  config: MatomoEventConfig,
  date: [string, string]
) => (response: MatomoEventCategory[]) => [
  formatMonthlyApiResult(config, date[0])(response),
];

export const monthlyEventLoaders = (config: EventLoaderOptions): Loader[] =>
  getMatomoLastMonthsRange(new Date()).map((date) => ({
    aggregator: monthlyEventsAggregator(config, date),
    query: monthlyEventQuery({ config, date }),
  }));
