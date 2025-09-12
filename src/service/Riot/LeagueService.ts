import { AxiosError } from 'axios';
import { ILeagueEntryDTO } from '@bedy90/riotentity';

// Declaration import
import { EnvVars, RiotGameType, ModuleVersion, replaceRouteParams, ReturnData } from '../../riotmodule.js';

// Service import
import { ResponseService, ValidationService, RequestService, CacheService, CacheTimer, CacheName } from '../index.js';

import { RiotServiceLocalization } from '../RiotService.js';

// <ILeagueEntryDTO>
export class LeagueService_V4 extends ResponseService {
    routeService: ModuleVersion = EnvVars.routes.league.v4;
    tftRouteService: ModuleVersion = EnvVars.routes.tft_league.v1;

    /**
     * @deprecated October 2023 : Please use « getByPuuid »
     * @see https://developer.riotgames.com/docs/summoner-name-to-riot-id-faq
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getLeagueEntriesByEncryptedSummonerId(encryptedSummonerId: string, region: string): Promise<ReturnData<Array<ILeagueEntryDTO>>> {
        try {
            throw new Error('getBySummonerName is deprecated. Please use getByPuuid');

        } catch (err) {
            return this.catchError(err);
        }
    }

    /**
     * Return a @type {ILeagueEntryDTO}
     * @param encryptedPuuid
     * @param region
     * @returns
     */
    async getLeagueEntriesByEncryptedPuuid(encryptedPuuid: string, region: string, riotGameType: RiotGameType): Promise<ReturnData<Array<ILeagueEntryDTO>>> {
        const realRegion = ValidationService.convertToRealRegion(region);
        // const masteriesUrl = EnvVars.routes.league.v4.getLeagueEntriesForSummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);
        // const routeUrl: string = replaceRouteParams(this.routeService.getLeagueEntriesForPuuid, { puuid: encryptedPuuid, region: realRegion });

        let returnValue!: Array<ILeagueEntryDTO>;

        const cacheName = CacheName.LEAGUE_RANK.replace('{0}', realRegion).replace('{1}', encryptedPuuid.replace('{2}', riotGameType.toString()));
        if (EnvVars.cache.enabled) {
            const cacheValue: Array<ILeagueEntryDTO> | undefined = CacheService.getInstance().getCache<Array<ILeagueEntryDTO>>(cacheName);
            if (cacheValue != undefined) {
                // return cacheValue;
                return this.createResponse(cacheValue, [], 200);
            }
        }

        let routeUrl: string = '';
        switch (riotGameType) {
            case RiotGameType.LeagueOfLegend:
                routeUrl = replaceRouteParams(this.routeService.getByPuuid, { puuid: encryptedPuuid, region: realRegion });
                break;
            case RiotGameType.TeamFightTactic:
                routeUrl = replaceRouteParams(this.tftRouteService.getByPuuid, { puuid: encryptedPuuid, region: realRegion });
                break;

            default: // else case:
                try {
                    throw new Error('riotGameType is invalid');


                } catch (err) {
                    return this.catchError(err);
                }
        }

        await RequestService.callRiotAPI<Array<ILeagueEntryDTO>>(routeUrl, riotGameType).then((result) => {
            returnValue = result;

        }).catch((err) => {
            console.error(RiotServiceLocalization.errInFunction('getLeagueEntriesByEncryptedPuuid', 'LeagueService'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            } else if (err.response && err.response.data) {
                console.error(err.response.data);
            } else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<Array<ILeagueEntryDTO>>(cacheName, returnValue, CacheTimer.RANK);
        }

        // return returnValue;
        return this.createResponse(returnValue, [], 200);
    }
}