import { ceil } from "lodash";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";
import { actionQuery } from "./actions-loader";
import { RELEASE_DATE_3_1 } from "./loader-utils";

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

export const totalFileDropLoader = (
  config: MatomoActionConfigObject
): Loader => ({
  aggregator: totalFileDropAggregator(),
  query: actionQuery({ ...config, date: RELEASE_DATE_3_1 }),
});

const getTotalFileDrop = (fileDropVolumes: string[]): number => {
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

  return ceil(totalGiga + totalMega / 1000);
};
