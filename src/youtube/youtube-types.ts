type YoutubeDataItem = {
  statistics: {
    viewCount: string;
    subscriberCount: string;
  };
};

export type YoutubeData = {
  items: YoutubeDataItem[];
};
