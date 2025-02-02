export default interface CacheClientOutputPort {
  get(key: string): Promise<any>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}
