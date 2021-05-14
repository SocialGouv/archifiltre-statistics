import { actionLoader } from "./loaders/actions-loader";
import { eventLoader, monthlyEventLoaders } from "./loaders/event-loader";
import { markedToDeleteLoader } from "./loaders/marked-to-delete-files-loader";
import { totalFileDropLoader } from "./loaders/total-filedrop-loader";
import { totalMonthVisitorsLoader } from "./loaders/total-month-visitors-loader";
import { totalMonthlyDownloadLoader } from "./loaders/total-monthly-download-loader";
import { visitorCountriesLoader } from "./loaders/visitor-countries-loader";
import {
  last30DaysVisitsLoader,
  totalVisitsLoader,
} from "./loaders/visits-loader";
import type { SiteConfig } from "./matomo-types";

const ARCHIFILTRE_SITE_ID = 20;
const ARCHIFILTRE_APP_ID = 9;

export const matomoConfig: SiteConfig[] = [
  {
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
      totalFileDropLoader({ categoryName: "FileTreeDrop" }),
      markedToDeleteLoader({ categoryName: "Element marked to delete" }),
      visitorCountriesLoader(),
      totalMonthVisitorsLoader(),
    ],
  },
  {
    idSite: ARCHIFILTRE_SITE_ID,
    loaders: [
      actionLoader({ categoryName: "download" }),
      actionLoader({ categoryName: "appDownload" }),
      eventLoader({ label: "download" }),
      eventLoader({ label: "appDownload" }),
      totalVisitsLoader(),
      last30DaysVisitsLoader(),
      ...monthlyEventLoaders({ label: "download" }),
      ...monthlyEventLoaders({ label: "appDownload" }),
      totalMonthlyDownloadLoader({
        labelPattern: "(appDownload|download)",
      }),
    ],
  },
];
