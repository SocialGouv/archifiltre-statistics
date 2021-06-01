import { add, isNumber, prop } from "lodash/fp";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type { SumAggegatorConfig } from "../matomo-types";

export const sumAgregator = (config: SumAggegatorConfig) => (
  stats: ArchifiltreCountStatistic[]
): ArchifiltreCountStatistic[] =>
  stats
    .filter(({ label }) => label !== config.label)
    .concat([
      {
        label: config.label,
        value: stats

          .filter(({ label }) => label === config.label)
          .map(prop("value"))
          .filter(isNumber)
          .reduce(add),
      },
    ]);
