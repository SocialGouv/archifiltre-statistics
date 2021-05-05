import { getLastMonthsRanges } from "./../../utils/date";
import { format, parseISO } from "date-fns/fp";
import { compose, map } from "lodash/fp";
import { isString } from "lodash";
import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoEventCategory,
  MatomoEventConfig,
} from "../matomo-types";
import {
  sanitizeMatomoEventConfig,
  createMatomoRequestBaseParams,
} from "./loader-utils";
import * as querystring from "querystring";

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
  createMatomoEventCategoryMethod({ idSite, config: label });

export const formatEventsResponse = () => (
  eventCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  eventCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const eventAggregator = ({ label }: EventLoaderOptions) => (response: any) =>
  formatEventsResponse()(response);

export const eventLoader = ({ label }: EventLoaderOptions): Loader => ({
  query: eventQuery({ label }),
  aggregator: eventAggregator({ label }),
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
}: ApiParams) => createMonthlyEventMethod({ config, idSite, date });

const formatResultDate = compose(format("y-MM"), parseISO);

type ResultFormatter = (
  eventCategories: MatomoEventCategory[]
) => ArchifiltreCountStatistic[];

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
) => (response: any) => [formatMonthlyApiResult(config, date[0])(response)];

export const monthlyEventLoaders = (config: EventLoaderOptions): Loader[] =>
  getMatomoLastMonthsRange(new Date()).map((date) => ({
    query: monthlyEventQuery({ config, date }),
    aggregator: monthlyEventsAggregator(config, date),
  }));
