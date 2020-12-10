import axios from "axios";

import type { ArchifiltreCountStatistic } from "../api-types";
import { youtubeApiKey, youtubeApiUrl, youtubeChannelId } from "../config";
import type { YoutubeData } from "./youtube-types";
import { convertYoutubeDataToApiData } from "./youtube-utils";

export const getYoutubeData = async (): Promise<ArchifiltreCountStatistic[]> =>
  axios
    .get(`${youtubeApiUrl}channels`, {
      params: {
        id: youtubeChannelId,
        key: youtubeApiKey,
        part: "statistics",
      },
    })
    .then(({ data }: { data: YoutubeData }) => data)
    .then(convertYoutubeDataToApiData);
