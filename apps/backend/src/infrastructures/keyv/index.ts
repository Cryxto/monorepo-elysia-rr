import { createKeyv, Keyv } from '@keyv/bigmap';
import type { Provider } from '@cryxto/ioc-n-di';
import { Group } from '@cryxto/ioc-n-di';

/**
 * Keyv provider - creates in-memory cache using BigMap
 */
export const KeyvProvider: Provider<Keyv> = {
  provide: Keyv,
  useFactory: () => {
    console.log('Keyv instantiated!');
    return createKeyv();
  },
};

/**
 * CacheModule groups all cache-related providers
 */
@Group({
  providers: [KeyvProvider],
})
export class CacheModule {}
