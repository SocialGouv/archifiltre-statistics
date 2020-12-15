import { flatten } from "lodash";
import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import type {
  MatomoActionConfigObject,
  MatomoEventCategory,
  MatomoEventConfig,
  MatomoEventConfigObject,
  MatomoSiteConfig,
} from "./matomo-types";

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
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
  idSite: number
): Record<string, string | number> => ({
  date: "2019-04-17,today",
  idSite,
  period: "range",
});

const createMatomoEventCategoryMethod = ({
  config,
  idSite,
}: CreateMatomoEventCategoryMethodParams) => {
  const { label } = sanitizeMatomoEventConfig(config);
  return querystring.stringify({
    ...createMatomoRequestBaseParams(idSite),
    label,
    method: "Events.getCategory",
  });
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

export const getBulkRequestParamsFromConfig = ({
  events = [],
  actions = [],
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

const formatVisitsResponse = () => (
  value: number
): ArchifiltreCountStatistic => ({ label: "visitsCount", value });

export const createMatomoDataSanitizer = ({
  events = [],
  actions = [],
  visits = false,
}: MatomoSiteConfig) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matomoApiResponse: any[]
): ArchifiltreCountStatistic[] =>
  flatten(
    [
      ...events.map(formatEventsOrActionsResponse),
      ...actions.map(formatEventsOrActionsResponse),
      ...(visits ? [formatVisitsResponse()] : []),
    ].map((formatter, index) => formatter(matomoApiResponse[index]))
  );
