import { isString } from "lodash";
import * as querystring from "querystring";

import { createMatomoRequestBaseParams } from "./loaders/loader-utils";
import type { RequestMatomoParams } from "./matomo-service";
import { requestMatomo } from "./matomo-service";
import type { ApiParams } from "./matomo-types";

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

export type MatomoActionQueryConfig = {
  categoryName: string;
  date?: string | [string, string];
};

type GetCategoryResponse = {
  data: {
    idsubdatatable: number;
  }[];
};

const getDate = (date: string | [string, string]) =>
  isString(date) ? `${date},today` : date.join(",");

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const actionQuery = (config: MatomoActionQueryConfig) => async ({
  idSite,
}: ApiParams) => {
  const date = isString(config.date) ? `${config.date},today` : config.date;

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
      ...(config.date ? { date: getDate(config.date) } : {}),
    },
    idSite,
  });
};
