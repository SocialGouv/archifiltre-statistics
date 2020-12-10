type YoutubeDataItem = {
  statistics: {
    viewCount: string;
  };
};

export type YoutubeData = {
  items: YoutubeDataItem[];
};
