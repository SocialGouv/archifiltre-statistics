import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type { ApiParams, Loader, MatomoUserCountry } from "./../matomo-types";
import { createMatomoRequestBaseParams } from "./loader-utils";

const createMatomoVisitorCountriesMethod = (idSite: number): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite),
    method: "UserCountry.getCountry",
  });

const visitorCountriesQuery = () => ({ idSite }: ApiParams) =>
  createMatomoVisitorCountriesMethod(idSite);

const visitorCountriesAggregator = () => (
  countries: MatomoUserCountry[]
): ArchifiltreCountStatistic[] => [
  {
    label: "visitorCountries",
    value: countries.reduce(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      (acc, { nb_visits, code }) => ({ ...acc, [code]: nb_visits }),
      {}
    ),
  },
];

export const visitorCountriesLoader = (): Loader => ({
  aggregator: visitorCountriesAggregator(),
  query: visitorCountriesQuery(),
});
