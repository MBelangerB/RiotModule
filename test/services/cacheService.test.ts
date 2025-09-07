import { describe, expect, test } from '@jest/globals';
import { setTimeout } from "timers/promises";

import { CacheService } from '../../src/index.js';

describe('===> Test CacheService', () => {
    const cacheValue: string = "Hello, i'm Mocha."
    const cacheKeyName: string = "CacheService.Test"

    beforeEach(() => {
        CacheService.getInstance().cleanCache();
    });

    it('1.0 => Add data to the cache', (done) => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue);
        expect(state).toBe(true);

        done();
    });

    it('1.1.0 => Add data to the cache and read the cache value', (done) => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue);
        expect(state).toBe(true);

        let dataValue: string | undefined = CacheService.getInstance().getCache<string>(cacheKeyName);
        
        expect(cacheValue).toBe(dataValue);

        done();
    });

    it('1.1.1 => Add data to cache and check key exists.', (done) => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue);
        expect(state).toBe(true);

        let keyExists: boolean = CacheService.getInstance().checkIfExists(cacheKeyName);
        expect(keyExists).toBe(true);

        done();
    });

    it('1.1.2 => Add data to cache and validate with an invalid key.', (done) => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue);
        expect(state).toBe(true);

        let keyExists: boolean = CacheService.getInstance().checkIfExists("Toto");
        expect(keyExists).toBe(false);

        done();
    });

    it('1.2 => Add data on cache and wait for expiration.', async () => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue, 3);
        expect(state).toBe(true);

        // wait 5 secs
        await setTimeout(5000).then(() => {
            let dataValue: string | undefined = CacheService.getInstance().getCache<string>(cacheKeyName);
            expect(dataValue).toBeUndefined();
        });

    }, 10000);

    it('1.3.0 => Add multi data on cache and get keylist', (done) => {

        let state1: boolean = CacheService.getInstance().setCache<string>("Key-1", cacheValue);
        let state2: boolean = CacheService.getInstance().setCache<string>("Key-2", cacheValue);
        expect(state1).toBe(true);
        expect(state2).toBe(true);

        let keyList: Array<string> = CacheService.getInstance().getKeyList();
        expect(keyList).toBeTruthy();
        expect(keyList).toHaveLength(2);

        done();
    });

    it('1.3.1 => Add multi data on cache and remove a key', (done) => {

        let state1: boolean = CacheService.getInstance().setCache<string>("Key-1", cacheValue);
        let state2: boolean = CacheService.getInstance().setCache<string>("Key-2", cacheValue);
        let state3: boolean = CacheService.getInstance().setCache<string>("Key-3", cacheValue);
        expect(state1).toBe(true);
        expect(state2).toBe(true);
        expect(state3).toBe(true);

        let keyList: Array<string> = CacheService.getInstance().getKeyList();
        expect(keyList).toBeTruthy();
        expect(keyList).toHaveLength(3);

        let nbRemoveKey: number = CacheService.getInstance().removeCache("Key-1");
        keyList = CacheService.getInstance().getKeyList();
        expect(nbRemoveKey).toBe(1);
        expect(keyList).toHaveLength(2);

        done();
    });

    it('1.3.2 => Add multi data on cache and clean the cache content', (done) => {

        let state1: boolean = CacheService.getInstance().setCache<string>("Key-1", cacheValue);
        let state2: boolean = CacheService.getInstance().setCache<string>("Key-2", cacheValue);
        expect(state1).toBe(true);
        expect(state2).toBe(true);

        CacheService.getInstance().cleanCache();

        let keyList: Array<string> = CacheService.getInstance().getKeyList();
        expect(keyList).toHaveLength(0);

        done();
    });

    it('1.4 => Add data to the cache and check remaining delay', (done) => {

        let state: boolean = CacheService.getInstance().setCache<string>(cacheKeyName, cacheValue, 10);
        expect(state).toBe(true);

        let delay: number | undefined = CacheService.getInstance().getDelayBeforeExpiration(cacheKeyName);
        expect(delay).not.toBe(10);

        done();
    });

}); // END : 'Test CacheService'
