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
    ...createMatomoRequestBaseParams(idSite),
    idSubtable: config.categoryId,
    method: "Events.getActionFromCategoryId",
  });

type MatomoActionQueryConfig = {
  categoryName: string;
};

type GetCategoryResponse = {
  data: {
    idsubdatatable: number;
  }[];
};

const actionQuery = (config: MatomoActionQueryConfig) => async ({
  idSite,
}: ApiParams) => {
  const params: RequestMatomoParams = {
    ...createMatomoRequestBaseParams(idSite),
    label: config.categoryName,
    method: "Events.getCategory",
  };
  const {
    data: [{ idsubdatatable }],
  }: GetCategoryResponse = await requestMatomo(params);

  return createMatomoEventActionMethod({
    config: { categoryId: idsubdatatable },
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
