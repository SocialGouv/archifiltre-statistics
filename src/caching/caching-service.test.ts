import { createCache } from "./caching-service";

describe("caching-utils", () => {
  describe("createCache", () => {
    it("reads cache with fetch data value", async () => {
      const cacheValue = ["foo", "bar"];

      const { read, refresh } = createCache(() => cacheValue);
      await refresh();
      expect(read()).toEqual(cacheValue);
    });
  });
});
