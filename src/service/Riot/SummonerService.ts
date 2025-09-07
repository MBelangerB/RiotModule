import { AxiosError } from 'axios';
import { ISummonerDTO } from '@bedy90/riotentity';

// Declaration import
import { EnvVars, RiotGameType, ModuleVersion, replaceRouteParams, ReturnData } from '../../riotmodule.js';

// Service import
import { ResponseService, ValidationService, RequestService, CacheService, CacheTimer, CacheName } from '../index.js';

import { RiotServiceLocalization } from '../RiotService.js';

// <ISummonerDTO>
export class SummonerService_V4 extends ResponseService {
    routeService: ModuleVersion = EnvVars.routes.summoner.v4;
    tftRouteService: ModuleVersion = EnvVars.routes.tft_summoner.v1;

    /**
    * @deprecated October 2023 : Please use « getByPuuid »
    * @see https://developer.riotgames.com/docs/summoner-name-to-riot-id-faq
    *
    * Return a summoner
    * @param summonerName SummonerName
    * @param region Region
    * @returns {ISummonerDTO}
    * @throws Error params is invalid
    */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getBySummonerName(summonerName: string, region: string): Promise<ReturnData<ISummonerDTO>> { // Promise<ISummonerDTO> {
        try {
            throw new Error('getBySummonerName is deprecated. Please use getByPuuid');

        } catch (err) {
            return this.catchError(err);
        }
        // throw new Error('getBySummonerName is deprecated. Please use getByPuuid');
        // return this.catchError(new Error('getBySummonerName is deprecated. Please use getByPuuid'));
    }

    /**
     * Return a summoner
     * @param puuid Summoner puuid
     * @param region Region
     * @returns {ISummonerDTO}
     * @throws Error params is invalid
     */
    async getByPuuid(puuid: string, region: string, riotGameType: RiotGameType): Promise<ReturnData<ISummonerDTO>> { // Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);

        let routeUrl: string = '';
        const cacheName: string = CacheName.LEAGUE_SUMMONER.replace('{0}', realRegion).replace('{1}', puuid).replace('{2}', riotGameType.toString());
        switch (riotGameType) {
            case RiotGameType.LeagueOfLegend:
                routeUrl = replaceRouteParams(this.routeService.getByPuuid, { puuid: puuid, region: realRegion });
                break;
            case RiotGameType.TeamFightTactic:
                routeUrl = replaceRouteParams(this.tftRouteService.getByPuuid, { puuid: puuid, region: realRegion });
                break;
        }

        let returnValue!: ISummonerDTO;
        if (EnvVars.cache.enabled) {
            const cacheValue: ISummonerDTO | undefined = CacheService.getInstance().getCache<ISummonerDTO>(cacheName);
            if (cacheValue != undefined) {
                // return cacheValue;
                return this.createResponse(cacheValue, [], 200);
            }
        }

        await RequestService.callRiotAPI<ISummonerDTO>(routeUrl, riotGameType).then((result) => {
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

            let message: string = RiotServiceLocalization.errInFunction('getByPuuid', 'SummonerService');
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
            CacheService.getInstance().setCache<ISummonerDTO>(cacheName, returnValue, CacheTimer.SUMMONER);
        }

        // return returnValue;
        return this.createResponse(returnValue, [], 200);
    }
}
