import { createCache } from "./caching-service";

describe("caching-utils", () => {
  describe("createCache", () => {
    it("reads cache with fetch data value", async () => {
      const CACHE_TTL = 10 * 60 * 1000;
      const cacheValue = ["foo", "bar"];

      const { read, refresh } = createCache(() => cacheValue, CACHE_TTL);
      await refresh();
      expect(read()).toEqual(cacheValue);
    });
  });
});
