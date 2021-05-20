import type { ArchifiltreCountStatistic } from "../api-types";
import type { YoutubeData } from "./youtube-types";

export const convertYoutubeDataToApiData = (
  youtubeData: YoutubeData
): ArchifiltreCountStatistic[] => [
  {
    label: "youtubeViews",
    value: +youtubeData.items[0].statistics.viewCount,
  },
  {
    label: "youtubeSubscribers",
    value: +youtubeData.items[0].statistics.subscriberCount,
  },
];
