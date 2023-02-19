import NodeCache = require('node-cache');

// https://www.npmjs.com/package/node-cache
// https://losikov.medium.com/part-7-internal-caching-in-node-js-3f18411bcf2

// **** Variables **** //

export const CacheName = {
    /**
     * Params {0} = REGION
     */
    LEAGUE_ROTATE: 'leagueRotate-{0}',
    /**
     * Params
     *      {0} = REGION
     *      {1} = SUMMONER NAME (or accountId ??)
     */
    LEAGUE_SUMMONER: 'leagueSummoner-{0}-{1}',
    /**
     * Params
     *      {0} = REGION
     *      {1} = SUMMONER NAME (or accountId ??)
     */
    LEAGUE_MASTERIES: 'leagueMasteries-{0}-{1}',
    /**
     * Params
     *      {0} = REGION
     *      {1} = SUMMONER NAME (or accountId ??)
     */
    LEAGUE_RANK: 'leagueRank-{0}-{1}',
    // /**
    //  * Params {0} = Dragon champion key (Number)
    //  */
    // DRAGON_CHAMPION_ID: 'dragonChamp-{0}',
    /**
     * Params {0} = Culture
     */
    DRAGON_CHAMPIONS: 'dragonChampion-{0}',
    /**
     * Dragon version cache
     */
     DRAGON_VERSION: 'dragonVersion',
};

/**
 * Cache timer in seconds
 * ttl = seconds * minutes * hours
 * ttl = 60 * 60 * 1; // cache for 1 Hour
 */
export const CacheTimer = {
    /**
     * Default cache timer is 5min
     */
    DEFAULT: 300,
    /**
     * Default rotate time is 10 min
     */
    ROTATE: 600,
    /**
     * Default summoner time is 60 min
     */
    SUMMONER: 3600,
    /**
     * Default masteries time is 5 min
     */
    MASTERIES: 300,
    /**
     * Default rank time is 3 min
     */
    RANK: 180,
    /**
     * Default dragon time is 24 hours
     */
    DRAGON_CHAMPION: (60 * 60 * 24),
    DRAGON_VERSION: (60 * 60 * 24),
};

// **** Class  **** //
export class CacheService {
    private static _instance: CacheService;

    private myCache: NodeCache;

    private constructor(ttlSeconds: number = CacheTimer.DEFAULT) {
        this.myCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    /**
     * Return the current instance on the cache or initialize it
     * @param ttlSeconds
     * @returns
     */
    public static getInstance(ttlSeconds: number = CacheTimer.DEFAULT): CacheService {
        if (!CacheService._instance) {
            CacheService._instance = new CacheService(ttlSeconds);
        }
        return CacheService._instance;
      }

    /**
     * Check if there is any data associated with the KeyName.
     * @param keyName
     * @returns true if exist
     */
    checkIfExists(keyName: string): boolean {
        return this.myCache.has(keyName);
    }

    /**
     * Get the list of keys currently in the cache
     * @returns
     */
    getKeyList(): Array<string> {
        return this.myCache.keys();
    }

    /**
     * Adds the data associated with the KeyName to the cache.
     * @param keyName
     * @param value
     * @param ttlSeconds {optional}
     * @returns
     */
    setCache<T>(keyName: string, value: T, ttlSeconds = -1) : boolean {
        let success = false;
        if (ttlSeconds == null || ttlSeconds >= 0) {
            success = this.myCache.set(keyName, value, ttlSeconds);
        } else {
            success = this.myCache.set(keyName, value);
        }

        return success;
    }

    /**
     * Get the data associated with the KeyName.
     * @param keyName
     * @returns
     * @throw {NoDataException} if no data
     */
    getCache<T>(keyName: string): T | undefined {
        if (this.checkIfExists(keyName)) {
            const value: T | undefined = this.myCache.get(keyName);
            return value;
        }
        return undefined;
    }

    // TODO fix if we keep
    // /**
    //  * Get the data associated with the KeyName.
    //  * @param keyName
    //  * @returns
    //  * @throw {NoDataException} if no data
    //  */
    // async getCacheAsync<T>(keyName: string): Promise<T> {
    //     console.log(`Try get async catch : ${keyName}`);

    //     let cacheCopy: NodeCache = this.myCache;
    //     const getCacheData = new Promise<T>(function (resolve, reject) {
    //         const value: any = cacheCopy.get(keyName);
    //         if (value == undefined) {
    //             reject("No data for this key.");
    //         }

    //         resolve(value);
    //     });

    //     return Promise.resolve(getCacheData);
    // }

    /**
     * Remove the data associated with the KeyName from the cache.
     * @param keyName
     * @returns
     */
    removeCache(keyName: string): number {
        return this.myCache.del(keyName);
    }

    /**
     * Clean the contents of the cache
     */
    cleanCache(): void {
        this.myCache.flushAll();
    }

    /**
     * Check the time remaining before the cache expires for a KeyName.
     * @param keyName
     * @returns
     */
    getDelayBeforeExpiration(keyName: string): number | undefined {
        return this.myCache.getTtl(keyName);
    }

}

// **** Functions **** //

// **** Export default **** //

export default {
    CacheName,
    CacheTimer,
    CacheService,
} as const;
