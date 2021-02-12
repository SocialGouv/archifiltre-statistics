type CacheObject<T> = {
  read: () => T | null;
  refresh: () => Promise<void>;
  getLastFetchTimestamp: () => number | null;
};

type FetchData<T> = () => Promise<T> | T;

export const createCache = <T>(
  fetchData: FetchData<T>,
  ttl: number
): CacheObject<T> => {
  let cacheData: T | null = null;
  let lastFetchTimestamp = 0;
  let refreshTimeout: NodeJS.Timeout | null = null;
  const refresh = async () => {
    refreshTimeout?.unref();
    try {
      cacheData = await fetchData();
      lastFetchTimestamp = Date.now();
    } catch (error: unknown) {
      console.error(error);
    }
    refreshTimeout = setTimeout(() => void refresh(), ttl);
  };
  void refresh();
  return {
    getLastFetchTimestamp: () => lastFetchTimestamp,
    read: () => cacheData,
    refresh,
  };
};
