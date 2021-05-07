import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";

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

const actionQuery = (config: MatomoActionConfigObject) => ({
  idSite,
}: ApiParams) => createMatomoEventActionMethod({ config, idSite });

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
