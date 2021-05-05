import { ApiParams, Loader, MatomoEventCategory } from "./../matomo-types";
import * as querystring from "querystring";
import type { MatomoActionConfigObject } from "../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";
import { ArchifiltreCountStatistic } from "../../api-types";

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
  actionCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const actionAggregator = () => (response: any) =>
  formatActionsResponse()(response);

export const actionLoader = (config: MatomoActionConfigObject): Loader => ({
  query: actionQuery(config),
  aggregator: actionAggregator(),
});
