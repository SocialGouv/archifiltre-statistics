import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type { RequestMatomoParams } from "../matomo-service";
import { requestMatomo } from "../matomo-service";
import type {
  ApiParams,
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";

type MatomoActionConfig = {
  categoryId: number;
  date?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_limit: number;
};

type CreateMatomoEventActionMethodParams = {
  config: MatomoActionConfig;
  idSite: number;
};

export const createMatomoEventActionMethod = ({
  config,
  idSite,
}: CreateMatomoEventActionMethodParams): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite, config.date),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    filter_limit: config.filter_limit,
    idSubtable: config.categoryId,
    method: "Events.getActionFromCategoryId",
  });

type MatomoActionQueryConfig = {
  categoryName: string;
  date?: string;
};

type GetCategoryResponse = {
  data: {
    idsubdatatable: number;
  }[];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const actionQuery = (config: MatomoActionQueryConfig) => async ({
  idSite,
}: ApiParams) => {
  const date = config.date ? `${config.date},today` : undefined;
  const params: RequestMatomoParams = {
    ...createMatomoRequestBaseParams(idSite, date),
    label: config.categoryName,
    method: "Events.getCategory",
  };
  const {
    data: [{ idsubdatatable }],
  }: GetCategoryResponse = await requestMatomo(params);

  return createMatomoEventActionMethod({
    config: {
      categoryId: idsubdatatable,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      filter_limit: -1,
      ...(config.date ? { date: `${config.date},today` } : {}),
    },
    idSite,
  });
};

const formatActionsResponse = () => (
  actionCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  // eslint-disable-next-line @typescript-eslint/naming-convention
  actionCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const actionAggregator = () => (response: MatomoEventCategory[]) =>
  formatActionsResponse()(response);

export const actionLoader = (config: MatomoActionConfigObject): Loader => ({
  aggregator: actionAggregator(),
  query: actionQuery(config),
});
