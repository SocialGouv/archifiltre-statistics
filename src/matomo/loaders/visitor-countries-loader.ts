import { ApiParams, Loader, MatomoUserCountry } from "./../matomo-types";
import * as querystring from "querystring";
import { createMatomoRequestBaseParams } from "./loader-utils";
import { ArchifiltreCountStatistic } from "../../api-types";

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
  query: visitorCountriesQuery(),
  aggregator: visitorCountriesAggregator(),
});
