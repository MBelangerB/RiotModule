import NodeCache = require("node-cache");
import { NoDataException } from "../declaration/exception/NoDataException";

// https://www.npmjs.com/package/node-cache
// https://losikov.medium.com/part-7-internal-caching-in-node-js-3f18411bcf2

// **** Variables **** //

// Errors
export const CacheLocalization = {
    unauth: 'Unauthorized',
} as const;


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
    LEAGUE_RANK: 'leagueRank-{0}-{1}'
}

/**
 * Cache timer in seconds
 */
export const CacheTimer = {
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
}

// **** Class  **** //
export class CacheService { // <T> {
    private static _instance: CacheService;

    private myCache: NodeCache;
    private ttlSeconds: number;

    private constructor(ttlSeconds: number = CacheTimer.DEFAULT) {
        this.ttlSeconds = ttlSeconds;
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
    getKeyList(): Array<String> {
        return this.myCache.keys();
    }

    /**
     * Adds the data associated with the KeyName to the cache.
     * @param keyName 
     * @param value 
     * @param ttlSeconds {optional} 
     * @returns 
     */
    setCache<T>(keyName: string, value: T, ttlSeconds: number = -1) : boolean {
        let success: boolean = false;
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
    getCache<T>(keyName: string): T {
        let value: any = this.myCache.get(keyName);
        if (value == undefined) {
            throw new NoDataException("No data for this key.", keyName);
        }
        console.log(`Success to get catch : ${keyName}`);
        return value;
    }

    /**
     * Get the data associated with the KeyName.
     * @param keyName 
     * @returns 
     * @throw {NoDataException} if no data
     */
    async getCacheAsync<T>(keyName: string): Promise<T> {
        console.log(`Try get async catch : ${keyName}`);

        let cacheCopy: NodeCache = this.myCache;
        const getCacheData = new Promise<T>(function (resolve, reject) {
            const value: any = cacheCopy.get(keyName);
            if (value == undefined) {
                reject("No data for this key.");
            }

            resolve(value);
        });

        return Promise.resolve(getCacheData);
    }


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
        this.myCache.flushAll()
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
    CacheLocalization,
    CacheName,
    CacheTimer,
    CacheService,
} as const;

// export default CacheService.getInstance();