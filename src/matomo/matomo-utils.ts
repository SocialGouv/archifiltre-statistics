import { compose, flatten, map, mapKeys, pick } from "lodash/fp";
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
    method: "VisitTime.getVisitInformationPerLocalTime",
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
    visits ? createMatomoVisitMethod(idSite) : [],
  ].reduce(
    (urlParams, urlParam, index) => ({
      ...urlParams,
      [`urls[${index}]`]: urlParam,
    }),
    {}
  );

const keysMap: Record<string, string> = {
  label: "label",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nb_events: "value",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nb_visits: "value",
};

const convertMatomoDataToApiData = mapKeys(
  (key: string): string => keysMap[key]
);

export const sanitizeMatomoData: <T extends MatomoEventCategory>(
  matomoApiResponse: T[][]
) => ArchifiltreCountStatistic[] = compose(
  map(convertMatomoDataToApiData),
  map(pick(["label", "nb_events", "nb_visits"])),
  flatten
);
