import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';

export default class MockCacheClient implements CacheClientOutputPort {
  private cache: Record<string, string> = {};

  get = jest.fn((key: string) => Promise.resolve(this.cache[key] || '0'));
  set = jest.fn((key: string, value: string) => {
    this.cache[key] = value;
    return Promise.resolve();
  });
  delete = jest.fn((key: string) => {
    delete this.cache[key];
    return Promise.resolve();
  });
}
