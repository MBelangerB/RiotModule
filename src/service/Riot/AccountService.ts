import { AxiosError } from 'axios';
import { IAccountDTO } from '@bedy90/riotentity';

// Declaration import
import { EnvVars, RiotGameType, ModuleVersion, getGlobalRegion, replaceRouteParams, ReturnData } from '../../riotmodule.js';

// Service import 
import { ResponseService, RequestService, CacheService, CacheTimer, CacheName } from '../index.js';

import { RiotServiceLocalization } from '../RiotService.js'

export class AccountService_V1 extends ResponseService<IAccountDTO> {
    routeService: ModuleVersion = EnvVars.routes.account.v1;

    /**
     * Get Riot Account info by user PUUID and region
     * @param puuid
     * @param region
     * @returns
     */
    async getByPuuid(puuid: string, region: string): Promise<ReturnData<IAccountDTO>> {
        const globalRegion: string = getGlobalRegion(region);
        const routeUrl: string = replaceRouteParams(this.routeService.getByPuuid, { puuid: puuid, globalRegion: globalRegion });

        let returnValue!: IAccountDTO;

        const cacheName = CacheName.RIOT_ACCOUNT_PUUID.replace('{0}', globalRegion).replace('{1}', puuid);
        if (EnvVars.cache.enabled) {
            const cacheValue: IAccountDTO | undefined = CacheService.getInstance().getCache<IAccountDTO>(cacheName);
            if (cacheValue != undefined) {
                // return cacheValue;
                return this.createResponse(cacheValue, [], 200);
            }
        }

        await RequestService.callRiotAPI<IAccountDTO>(routeUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;

        }).catch((err) => {
            // console.error(RiotServiceLocalization.errInFunction('getByPuuid'));
            // if (err instanceof AxiosError) {
            //     console.error(err.message);
            // } else if (err.response && err.response.data) {
            //     console.error(err.response.data);
            // } else {
            //     console.error(err);
            // }
            // throw err;

            let message: string = RiotServiceLocalization.errInFunction('getByPuuid', 'AccountService');
            if (err instanceof AxiosError) {
                message += '\n' + err.message;
            } else if (err.response && err.response.data) {
                message += '\n' + err.response.data;
            } else {
                message += '\n' + err;
            }
            console.error(message);

            return this.createResponse(err, [message], 500);

        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<IAccountDTO>(cacheName, returnValue, CacheTimer.ACCOUNT);
        }

        // return returnValue;
        return this.createResponse(returnValue, [], 200);
    }

    /**
     * Get Riot Account info by user gameName, tagLine and region
     * @param gameName
     * @param tagLine
     * @param region
     * @returns
     */
    async getByGameNameTagLine(gameName: string, tagLine: string, region: string): Promise<ReturnData<IAccountDTO>> {
        const globalRegion: string = getGlobalRegion(region);
        const routeUrl: string = replaceRouteParams(this.routeService.getRiotIdByGameNameAndTagLine, { gameName: gameName, tagLine: tagLine, globalRegion: globalRegion });

        let returnValue!: IAccountDTO;

        const cacheName = CacheName.RIOT_ACCOUNT_GAMENAME_TAG.replace('{0}', globalRegion).replace('{1}', gameName).replace('{2}', tagLine);
        if (EnvVars.cache.enabled) {
            const cacheValue: IAccountDTO | undefined = CacheService.getInstance().getCache<IAccountDTO>(cacheName);
            if (cacheValue != undefined) {
                // return cacheValue;
                return this.createResponse(cacheValue, [], 200);
            }
        }

        await RequestService.callRiotAPI<IAccountDTO>(routeUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;

        }).catch((err) => {
            // console.error(RiotServiceLocalization.errInFunction('getByGameNameTagLine', 'AccountService'));
            // if (err instanceof AxiosError) {
            //     console.error(err.message);
            // } else if (err.response && err.response.data) {
            //     console.error(err.response.data);
            // } else {
            //     console.error(err);
            // }
            // throw err;

            let message: string = RiotServiceLocalization.errInFunction('getByGameNameTagLine', 'AccountService');
            if (err instanceof AxiosError) {
                message += '\n' + err.message;
            } else if (err.response && err.response.data) {
                message += '\n' + err.response.data;
            } else {
                message += '\n' + err;
            }
            console.error(message);

            return this.createResponse(err, [message], 500);
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<IAccountDTO>(cacheName, returnValue, CacheTimer.ACCOUNT);
        }

        // return returnValue;
        return this.createResponse(returnValue, [], 200);
    }
}