/* eslint-disable @typescript-eslint/naming-convention */
import { ceil } from "lodash";

import type {
  Loader,
  MatomoActionConfigObject,
  MatomoEventCategory,
} from "../matomo-types";
import type { ArchifiltreCountStatistic } from "./../../api-types";
import { actionQuery } from "./actions-loader";
import { RELEASE_DATE_3_2 } from "./loader-utils";

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

export const markedToDeleteLoader = (
  config: MatomoActionConfigObject
): Loader => ({
  aggregator: markedToDeleteAggregator(),
  query: actionQuery({ ...config, date: RELEASE_DATE_3_2 }),
});

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
