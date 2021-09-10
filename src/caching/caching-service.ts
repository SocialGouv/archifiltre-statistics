type CacheObject<T> = {
  read: () => T | null;
  refresh: () => Promise<void>;
  getLastFetchTimestamp: () => number | null;
};

type FetchData<T> = () => Promise<T> | T;

export const createCache = <T>(fetchData: FetchData<T>): CacheObject<T> => {
  let cacheData: T | null = null;
  let lastFetchTimestamp = 0;
  const refresh = async () => {
    try {
      cacheData = await fetchData();
      lastFetchTimestamp = Date.now();
    } catch (error: unknown) {
      console.error(error);
    }
  };
  void refresh();
  return {
    getLastFetchTimestamp: () => lastFetchTimestamp,
    read: () => cacheData,
    refresh,
  };
};
