/* eslint-disable @typescript-eslint/naming-convention */
import { ceil } from "lodash";

import type { ArchifiltreCountStatistic } from "../../api-types";
import { getMatomoLastWeeksRange } from "../../utils/date";
import { actionQuery } from "../matomo-action-query";
import type {
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";

const FOOTPRINT_COEF = 19;
const PAPER_EQUIVALENCE_COEF = 0.22;

const markedToDeleteAggregator = () => (
  response: MatomoEventCategory[]
): ArchifiltreCountStatistic[] => {
  const markedToDeleteElements = response.map(({ label }) => label);
  const computedMarkToDeleteVolumes = getMarkedToDeleteFileSize(
    markedToDeleteElements
  );
  const carbonFootprint = ceil(computedMarkToDeleteVolumes * FOOTPRINT_COEF);
  const carbonFootprintPaperEquivalence = getCarbonfootprintPaperEquivalence(
    carbonFootprint
  );

  return [
    {
      label: "totalMarkedToDelete",
      value: computedMarkToDeleteVolumes,
    },
    {
      label: "carbonFootprintInGrams",
      value: carbonFootprint,
    },
    {
      label: "carbonFootprintPaperEquivalence",
      value: carbonFootprintPaperEquivalence,
    },
  ];
};

const getMarkedToDeleteFileSize = (markedToDeleteElements: string[]) => {
  const sanitizedMarkedToDeleteElements = markedToDeleteElements
    .filter((filteredLabel) =>
      filteredLabel.toLowerCase().includes("volume to delete")
    )
    .map((label) => {
      return label
        .toLowerCase()
        .split("o;")[0]
        .replace("volume to delete:", "");
    })
    .map((value) => parseInt(value))
    .reduce((acc, val) => acc + val, 0);
  const giga = Math.pow(10, 9);
  const volumeToGB = ceil(sanitizedMarkedToDeleteElements / giga);
  return volumeToGB;
};

const getCarbonfootprintPaperEquivalence = (carbonFootprint: number): number =>
  ceil(carbonFootprint * PAPER_EQUIVALENCE_COEF);

export const markedToDeleteLoaders = (
  config: MatomoActionConfigObject
): Loader[] =>
  getMatomoLastWeeksRange(new Date()).map((date) => ({
    aggregator: markedToDeleteAggregator(),
    query: actionQuery({ ...config, date }),
  }));
