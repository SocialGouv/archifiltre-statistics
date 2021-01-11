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
  let cacheData: null | T = null;
  let lastFetchTimestamp = 0;
  let refreshTimeout: NodeJS.Timeout | null = null;
  const refresh = async () => {
    refreshTimeout?.unref();
    cacheData = await fetchData();
    lastFetchTimestamp = Date.now();
    refreshTimeout = setTimeout(() => void refresh(), ttl);
  };
  void refresh();
  return {
    getLastFetchTimestamp: () => lastFetchTimestamp,
    read: () => cacheData,
    refresh,
  };
};
