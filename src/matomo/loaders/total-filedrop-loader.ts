import { ceil } from "lodash";

import type { ArchifiltreCountStatistic } from "../../api-types";
import { getMatomoLastWeeksRange } from "../../utils/date";
import { actionQuery } from "../matomo-action-query";
import type {
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";
import { RELEASE_DATE_3_2 } from "./loader-utils";

const totalFileDropAggregator = () => (
  response: MatomoEventCategory[]
): ArchifiltreCountStatistic[] => {
  const fileDropVolumes = response
    .map(({ label }) => label)
    .filter((label) => label.toLowerCase().includes("total volume"));
  const computedFileDropVolumes = getTotalFileDrop(fileDropVolumes);

  return [
    {
      label: "totalDropVolume",
      value: computedFileDropVolumes,
    },
  ];
};

export const getTotalFileDrop = (fileDropVolumes: string[]): number => {
  const GIGA = "go";
  const MEGA = "mo";

  const convertFileDropToNumberAndUnit = (fileDrop: string) =>
    fileDrop.toLocaleLowerCase().split(";")[0].replace("total volume:", "");

  const removeUnitAndConvertToNumber = (volume: string, unit: string) =>
    parseFloat(volume.replace(unit, ""));

  const sanitizedFileDropVolumes = fileDropVolumes.map(
    convertFileDropToNumberAndUnit
  );

  const getTotalVolumeFromUnit = (
    dropVolumes: string[],
    unit: string
  ): number =>
    dropVolumes
      .filter((fileDropVolume) => fileDropVolume.includes(unit))
      .map((volumes) => removeUnitAndConvertToNumber(volumes, unit))
      .reduce((acc: number, val: number) => acc + val, 0);

  const totalMega = getTotalVolumeFromUnit(sanitizedFileDropVolumes, MEGA);
  const totalGiga = getTotalVolumeFromUnit(sanitizedFileDropVolumes, GIGA);
  const totalTera = (totalGiga + totalMega / 1000) / 1000;

  return ceil(totalTera);
};

export const totalFileDropLoaders = (
  config: MatomoActionConfigObject
): Loader[] =>
  getMatomoLastWeeksRange(new Date(), new Date(RELEASE_DATE_3_2)).map(
    (date) => ({
      aggregator: totalFileDropAggregator(),
      query: actionQuery({ ...config, date }),
    })
  );
