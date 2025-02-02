import RedisClient from '@/core/infrastructure/cache/redis/redis-client';

jest.mock('ioredis', () => require('ioredis-mock'));

describe('RedisClient', () => {
  let redisClient: RedisClient;

  beforeEach(() => {
    redisClient = new RedisClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return the parsed value when the key exists', async () => {
      // 🔧 ARRANGE
      const key = 'test-key';
      const value = { test: 'value' };

      jest
        .spyOn(redisClient['instance'], 'get')
        .mockResolvedValueOnce(JSON.stringify(value));

      // 🚀 ACT
      const sut = await redisClient.get<typeof value>(key);

      // 👀 ASSERT
      expect(redisClient['instance'].get).toHaveBeenCalledWith(key);
      expect(sut).toEqual(value);
    });

    it('should return null when the key does not exist', async () => {
      // 🔧 ARRANGE
      const key = 'nonexistent-key';

      jest.spyOn(redisClient['instance'], 'get').mockResolvedValueOnce(null);

      // 🚀 ACT
      const sut = await redisClient.get(key);

      // 👀 ASSERT
      expect(redisClient['instance'].get).toHaveBeenCalledWith(key);
      expect(sut).toBeNull();
    });
  });

  describe('set', () => {
    it('should set the value for the given key', async () => {
      // 🔧 ARRANGE
      const key = 'test-key';
      const value = 'test-value';

      jest.spyOn(redisClient['instance'], 'set').mockResolvedValueOnce('OK');

      // 🚀 ACT
      await redisClient.set(key, value);

      // 👀 ASSERT
      expect(redisClient['instance'].set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('delete', () => {
    it('should delete the value for the given key', async () => {
      // 🔧 ARRANGE
      const key = 'test-key';

      jest.spyOn(redisClient['instance'], 'del').mockResolvedValueOnce(1);

      // 🚀 ACT
      await redisClient.delete(key);

      // 👀 ASSERT
      expect(redisClient['instance'].del).toHaveBeenCalledWith(key);
    });
  });
});
