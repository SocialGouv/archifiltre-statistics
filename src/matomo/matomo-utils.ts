import { format, parseISO } from "date-fns/fp";
import { isString } from "lodash";
import { compose, map } from "lodash/fp";
import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../api-types";
import { getLastMonthsRanges } from "../utils/date";
import type {
  MatomoActionConfigObject,
  MatomoEventCategory,
  MatomoEventConfig,
  MatomoEventConfigObject,
  MatomoSiteConfig,
  MatomoUserCountry,
} from "./matomo-types";

const MONTHS_REQUESTED = 12;

type CreateMatomoEventActionMethodParams = {
  config: MatomoActionConfigObject;
  idSite: number;
};

export const createMatomoEventActionMethod = ({
  config,
  idSite,
}: CreateMatomoEventActionMethodParams): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite),
    idSubtable: config.categoryId,
    method: "Events.getActionFromCategoryId",
  });

const createMatomoVisitMethod = (idSite: number, date?: string): string =>
  querystring.stringify({
    ...createMatomoRequestBaseParams(idSite, date),
    method: "VisitsSummary.getVisits",
    period: date ? "day" : "range",
  });

type RequestParams = Record<string, string>;

const getMatomoLastMonthsRange = getLastMonthsRanges(MONTHS_REQUESTED);

type CreateMonthlyEvenMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
};

const createMonthlyEventMethod = ({
  config,
  idSite,
}: CreateMonthlyEvenMethodParams) =>
  getMatomoLastMonthsRange(new Date()).map((dateRange) =>
    createMatomoEventCategoryMethod({ config, date: dateRange, idSite })
  );

export const getBulkRequestParamsFromConfig = ({
  events = [],
  actions = [],
  monthlyEvents = [],
  last30visits = false,
  visits = false,
  visitorCountries = false,
  idSite,
}: MatomoSiteConfig): RequestParams =>
  [
    ...events.map((config) =>
      createMatomoEventCategoryMethod({ config, idSite })
    ),
    ...actions.map((config) =>
      createMatomoEventActionMethod({ config, idSite })
    ),
    ...monthlyEvents.flatMap((config) =>
      createMonthlyEventMethod({ config, idSite })
    ),
    ...(visits ? [createMatomoVisitMethod(idSite)] : []),
    ...(visitorCountries ? [createMatomoVisitorCountriesMethod(idSite)] : []),
    ...(last30visits ? [createMatomoVisitMethod(idSite, "last30")] : []),
  ].reduce(
    (urlParams, urlParam, index) => ({
      ...urlParams,
      [`urls[${index}]`]: urlParam,
    }),
    {}
  );

const getConfigLabel = (config: MatomoEventConfig) =>
  isString(config) ? config : config.label;

type ResultFormatter = (
  eventCategories: MatomoEventCategory[]
) => ArchifiltreCountStatistic[];

const formatResultDate = compose(format("y-MM"), parseISO);

const formatMonthlyApiResult = (config: MatomoEventConfig, date: string) => ({
  value,
}: ArchifiltreCountStatistic) => ({
  label: `${getConfigLabel(config)}:${formatResultDate(date)}`,
  value,
});

const formatMonthlyEvents = (config: MatomoEventConfig): ResultFormatter[] =>
  getMatomoLastMonthsRange(new Date())
    .map((date): [string, ResultFormatter] => [
      date[0],
      formatEventsOrActionsResponse(),
    ])
    .map(([date, formatter]) =>
      compose(map(formatMonthlyApiResult(config, date)), formatter)
    );

const formatVisitsResponse = () => ({
  value,
}: {
  value: number;
}): ArchifiltreCountStatistic => ({
  label: "visitsCount",
  value,
});

const formatLastVisitsResponse = () => (
  visitsMap: Record<string, number>
): ArchifiltreCountStatistic => ({
  label: "last30DaysVisits",
  value: visitsMap,
});

export const createMatomoDataSanitizer = ({
  events = [],
  actions = [],
  monthlyEvents = [],
  visits = false,
  visitorCountries = false,
  last30visits = false,
}: MatomoSiteConfig) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matomoApiResponse: any[]
): ArchifiltreCountStatistic[] =>
  [
    ...events.map(formatEventsOrActionsResponse),
    ...actions.map(formatEventsOrActionsResponse),
    ...monthlyEvents.flatMap(formatMonthlyEvents),
    ...(visits ? [formatVisitsResponse()] : []),
    ...(visitorCountries ? [formatVisitorCountriesResponse()] : []),
    ...(last30visits ? [formatLastVisitsResponse()] : []),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ].flatMap((formatter, index) => formatter(matomoApiResponse[index]));

const arrVolume = [
  "Total volume: 1.2 Go; Files dropped: 203; Folders dropped: 59; .jse: 36; .docx: 8; .pptx: 10; .jpg: 3; .pdf: 59;",
  "Total volume: 1.2 Go; Files dropped: 203; Folders dropped: 59; .jse: 36; .docx: 8; .pptx: 10; .jpg: 3; .pdf: 59;",
  "Total volume: 10.2 Go; Files dropped: 203; Folders dropped: 59; .jse: 36; .docx: 8; .pptx: 10; .jpg: 3; .pdf: 59;",
  "Total volume: 45.2 Go; Files dropped: 203; Folders dropped: 59; .jse: 36; .docx: 8; .pptx: 10; .jpg: 3; .pdf: 59;",
  "Total volume: 1000.2 Mo; Files dropped: 203; Folders dropped: 59; .jse: 36; .docx: 8; .pptx: 10; .jpg: 3; .pdf: 59;",
];

const getTotalCarbonFootPrint = (arrToFormat: string[]) => {
  // constants
  const GIGA = "go";
  const MEGA = "mo";
  const FOOTPRINT_COEF = 1;

  // array cache
  let mega: number[] = [];
  let giga: number[] = [];

  // sanitize str to get only number and units
  const convertStrToNumberAndUnit = (str: string) =>
    str.toLocaleLowerCase().split(";")[0].replace("total volume:", "");

  // remove units and convert to a float
  const removeUnitAndConvertToNumber = (str: string, unit: string) =>
    parseFloat(str.replace(unit, ""));

  // add all values to respective cache
  const addValueToCache = (str: string) => {
    const _str = convertStrToNumberAndUnit(str);
    _str.includes(GIGA)
      ? giga.push(removeUnitAndConvertToNumber(_str, GIGA))
      : mega.push(removeUnitAndConvertToNumber(_str, MEGA));
  };

  const convertAndStoreEachValue = (arr: string[]) => {
    return arr.forEach((item: string) => {
      return addValueToCache(item);
    });
  };

  convertAndStoreEachValue(arrToFormat);

  // get fixed value by 2 to avoid fat float
  const getFixedBy2 = (number: number) => Number(number.toFixed(2));
  const totalGiga = giga.reduce((acc: number, val: number) => acc + val, 0);
  const totalMega = mega.reduce((acc: number, val: number) => acc + val, 0);
  const totalCarbonFootprint = FOOTPRINT_COEF * (totalGiga + totalMega / 1000);
  const totalCarbonFootprintFixed = getFixedBy2(totalCarbonFootprint);

  console.log("ici", totalCarbonFootprintFixed);
};

getTotalCarbonFootPrint(arrVolume);
