import { ceil, isString } from "lodash";

import {
  getCarbonfootprintPaperEquivalence,
  getMarkedToDeleteFileSize,
} from "../matomo/loaders/marked-to-delete-files-loader";
import type { MatomoActionQueryConfig } from "../matomo/matomo-action-query";
import { createMatomoEventActionMethod } from "../matomo/matomo-action-query";
import type { RequestMatomoParams } from "../matomo/matomo-service";
import { makeBulkRequest, requestMatomo } from "../matomo/matomo-service";
import { getMatomoLastWeeksRange } from "../utils/date";
import {
  convertQueriesToMatomoQueryObject,
  createMatomoRequestBaseParams,
} from "./../matomo/loaders/loader-utils";
import { getTotalFileDrop } from "./../matomo/loaders/total-filedrop-loader";

type GetCategoryResponse = {
  data: {
    idsubdatatable: number;
  }[];
};

const ARBITRARY_DATE = "2021-04-15";
const FOOTPRINT_COEF = 19;

const getDate = (date: string | [string, string]) =>
  isString(date) ? `${date},today` : date.join(",");
const dates = getMatomoLastWeeksRange(new Date(), new Date(ARBITRARY_DATE));

const getParams = (
  date: string | [string, string],
  config: MatomoActionQueryConfig
) => {
  const params: RequestMatomoParams = {
    ...createMatomoRequestBaseParams(9, date),
    label: config.categoryName,
    method: "Events.getCategory",
  };
  return params;
};

export const getQuery = async (
  date: string | [string, string],
  config: MatomoActionQueryConfig
): Promise<string> => {
  const {
    data: [{ idsubdatatable }],
  }: GetCategoryResponse = await requestMatomo(getParams(date, config));
  return createMatomoEventActionMethod({
    config: {
      categoryId: idsubdatatable,
      date: getDate(date),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      filter_limit: -1,
    },
    idSite: 9,
  });
};

export const matomoFileTreeDropFix = async () => {
  const fileTreeDropConfig: MatomoActionQueryConfig = {
    categoryName: "FileTreeDrop",
  };

  const queries = dates.map(async (date) => getQuery(date, fileTreeDropConfig));
  const promisedQueries = await Promise.all(queries);
  const convertedQueries = convertQueriesToMatomoQueryObject(promisedQueries);

  const fileDropVolumeResponse = await makeBulkRequest(convertedQueries);
  const fileDropVolumeSanitized = fileDropVolumeResponse.data
    .flat()
    .map(({ label }) => label)
    .filter((label) => label.toLowerCase().includes("total volume"));
  const fileDropVolumeTotal = getTotalFileDrop(fileDropVolumeSanitized);

  return {
    label: "totalDropVolume",
    value: fileDropVolumeTotal,
  };
};

export const matomoMarkedToDeleteFix = async () => {
  const markedToDeleteConfig: MatomoActionQueryConfig = {
    categoryName: "Element marked to delete",
  };

  const queries = dates.map(async (date) =>
    getQuery(date, markedToDeleteConfig)
  );
  const promisedQueries = await Promise.all(queries);
  const convertedQueries = convertQueriesToMatomoQueryObject(promisedQueries);

  const markedToDeleteResponse = await makeBulkRequest(convertedQueries);
  const markedToDeleteSanitized = markedToDeleteResponse.data
    .flat()
    .map(({ label }) => label);

  const markedToDeleteVolume = getMarkedToDeleteFileSize(
    markedToDeleteSanitized
  );
  const carbonFootprint = ceil(markedToDeleteVolume * FOOTPRINT_COEF);
  const carbonFootprintPaperEquivalence = getCarbonfootprintPaperEquivalence(
    carbonFootprint
  );

  return [
    {
      label: "totalMarkedToDelete",
      value: markedToDeleteVolume,
    },
    {
      label: "carbonFootprintInKilo",
      value: carbonFootprint,
    },
    {
      label: "carbonFootprintPaperEquivalence",
      value: carbonFootprintPaperEquivalence,
    },
  ];
};
