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

type EventLoaderOptions = {
  label: string;
};

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  date?: [string, string];
};

const createMatomoEventCategoryMethod = ({
  config,
  idSite,
  date,
}: CreateMatomoEventCategoryMethodParams) => {
  const { label } = sanitizeMatomoEventConfig(config);
  return querystring.stringify(
    {
      ...createMatomoRequestBaseParams(idSite, date),
      label,
      method: "Events.getCategory",
    },
    "&",
    "=",
    { encodeURIComponent: (val) => val }
  );
};

const eventQuery = ({ label }: EventLoaderOptions) => ({ idSite }: ApiParams) =>
  createMatomoEventCategoryMethod({ config: label, idSite });

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

export const eventLoader = ({ label }: EventLoaderOptions): Loader => ({
  aggregator: eventAggregator(),
  query: eventQuery({ label }),
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

const formatMonthlyApiResult = (config: MatomoEventConfig, date: string) => ({
  value,
}: ArchifiltreCountStatistic) => ({
  label: `${getConfigLabel(config)}:${formatResultDate(date)}`,
  value,
});

const monthlyEventsAggregator = (
  config: MatomoEventConfig,
  date: [string, string]
) => (response: ArchifiltreCountStatistic) => [
  formatMonthlyApiResult(config, date[0])(response),
];

export const monthlyEventLoaders = (config: EventLoaderOptions): Loader[] =>
  getMatomoLastMonthsRange(new Date()).map((date) => ({
    aggregator: monthlyEventsAggregator(config, date),
    query: monthlyEventQuery({ config, date }),
  }));
