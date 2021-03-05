import { format, parseISO } from "date-fns/fp";
import { isString } from "lodash";
import { compose, map } from "lodash/fp";
import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import { getLastMonthsRanges } from "../utils/date";
import type {
  MatomoActionConfigObject,
  MatomoEventCategory,
  MatomoEventConfig,
  MatomoEventConfigObject,
  MatomoSiteConfig,
} from "./matomo-types";

const MONTHS_REQUESTED = 12;

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  date?: [string, string];
};

const sanitizeMatomoEventConfig = (
  config: MatomoEventConfig
): MatomoEventConfigObject =>
  typeof config === "string"
    ? {
        label: config,
      }
    : config;

const createMatomoRequestBaseParams = (
  idSite: number,
  date: [string, string] = ["2020-01-01", "today"]
): Record<string, number | string> => ({
  date: date.join(","),
  idSite,
  period: "range",
});

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

type CreateMatomoEventActionMethodParams = {
  config: MatomoActionConfigObject;
  idSite: number;
};

const createMatomoEventActionMethod = ({
  config,
  idSite,
}: CreateMatomoEventActionMethodParams): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite),
    idSubtable: config.categoryId,
    method: "Events.getActionFromCategoryId",
  });

const createMatomoVisitMethod = (idSite: number): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite),
    method: "VisitsSummary.getVisits",
  });

type RequestParams = Record<string, string>;

const getMatomoLastMonthsRange = getLastMonthsRanges(MONTHS_REQUESTED);

type CreateMonthlyEvenMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
};

const createMonthlyEventMethod = ({
  config,
  idSite,
}: CreateMonthlyEvenMethodParams) =>
  getMatomoLastMonthsRange(new Date()).map((dateRange) =>
    createMatomoEventCategoryMethod({ config, date: dateRange, idSite })
  );

export const getBulkRequestParamsFromConfig = ({
  events = [],
  actions = [],
  monthlyEvents = [],
  visits = false,
  idSite,
}: MatomoSiteConfig): RequestParams =>
  [
    ...events.map((config) =>
      createMatomoEventCategoryMethod({ config, idSite })
    ),
    ...actions.map((config) =>
      createMatomoEventActionMethod({ config, idSite })
    ),
    ...monthlyEvents.flatMap((config) =>
      createMonthlyEventMethod({ config, idSite })
    ),
    ...(visits ? [createMatomoVisitMethod(idSite)] : []),
  ].reduce(
    (urlParams, urlParam, index) => ({
      ...urlParams,
      [`urls[${index}]`]: urlParam,
    }),
    {}
  );

const formatEventsOrActionsResponse = () => (
  eventCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  // eslint-disable-next-line @typescript-eslint/naming-convention
  eventCategories.map(({ label, nb_events }) => ({ label, value: nb_events }));

const getConfigLabel = (config: MatomoEventConfig) =>
  isString(config) ? config : config.label;

type ResultFormatter = (
  eventCategories: MatomoEventCategory[]
) => ArchifiltreCountStatistic[];

const formatResultDate = compose(format("y-MM"), parseISO);

const formatMonthlyApiResult = (config: MatomoEventConfig, date: string) => ({
  value,
}: ArchifiltreCountStatistic) => ({
  label: `${getConfigLabel(config)}:${formatResultDate(date)}`,
  value,
});

const formatMonthlyEvents = (config: MatomoEventConfig): ResultFormatter[] =>
  getMatomoLastMonthsRange(new Date())
    .map((date): [string, ResultFormatter] => [
      date[0],
      formatEventsOrActionsResponse(),
    ])
    .map(([date, formatter]) =>
      compose(map(formatMonthlyApiResult(config, date)), formatter)
    );

const formatVisitsResponse = () => (
  value: number
): ArchifiltreCountStatistic => ({ label: "visitsCount", value });

export const createMatomoDataSanitizer = ({
  events = [],
  actions = [],
  monthlyEvents = [],
  visits = false,
}: MatomoSiteConfig) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matomoApiResponse: any[]
): ArchifiltreCountStatistic[] =>
  [
    ...events.map(formatEventsOrActionsResponse),
    ...actions.map(formatEventsOrActionsResponse),
    ...monthlyEvents.flatMap(formatMonthlyEvents),
    ...(visits ? [formatVisitsResponse()] : []),
  ].flatMap((formatter, index) => formatter(matomoApiResponse[index]));
