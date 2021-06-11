import { sumAgregator } from "./aggregators/sum-aggegator";
import { eventLoader } from "./loaders/event-loader";
import { markedToDeleteLoaders } from "./loaders/marked-to-delete-files-loader";
import { totalFileDropLoaders } from "./loaders/total-filedrop-loader";
import { totalMonthVisitorsLoader } from "./loaders/total-month-visitors-loader";
import { totalMonthlyDownloadLoader } from "./loaders/total-monthly-download-loader";
import { visitorCountriesLoader } from "./loaders/visitor-countries-loader";
import {
  averageMonthlyVisitorsLoader,
  last30DaysVisitsLoader,
  totalVisitsLoader,
} from "./loaders/visits-loader";
import type { SiteConfig } from "./matomo-types";

const ARCHIFILTRE_SITE_ID = 20;
const ARCHIFILTRE_APP_ID = 9;

export const matomoConfig = (): SiteConfig[] => [
  {
    aggregators: [
      sumAgregator({ label: "totalMarkedToDelete" }),
      sumAgregator({ label: "carbonFootprintPaperEquivalence" }),
      sumAgregator({ label: "totalDropVolume" }),
      sumAgregator({ label: "carbonFootprintInKilo" }),
    ],
    idSite: ARCHIFILTRE_APP_ID,
    loaders: [
      eventLoader({ label: "FileTreeDrop" }),
      eventLoader({ label: "CSV Export" }),
      eventLoader({ label: "CSV with hashes Export" }),
      eventLoader({ label: "Tree CSV Export" }),
      eventLoader({ label: "METS Export" }),
      eventLoader({ label: "Excel Export" }),
      eventLoader({ label: "RESIP Export" }),
      eventLoader({ label: "Audit report export" }),
      ...totalFileDropLoaders({ categoryName: "FileTreeDrop" }),
      ...markedToDeleteLoaders({ categoryName: "Element marked to delete" }),
      visitorCountriesLoader(),
      totalMonthVisitorsLoader(),
      averageMonthlyVisitorsLoader(),
    ],
  },
  {
    idSite: ARCHIFILTRE_SITE_ID,
    loaders: [
      eventLoader({ label: "download" }),
      eventLoader({ label: "appDownload" }),
      totalVisitsLoader(),
      last30DaysVisitsLoader(),
      totalMonthlyDownloadLoader({
        labelPattern: "(appDownload|download)",
      }),
    ],
  },
];
