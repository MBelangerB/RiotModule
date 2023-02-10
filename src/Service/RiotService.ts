
import { AxiosError } from "axios";
import EnvVars from "../declaration/major/EnvVars";
import { RiotGameType } from "../declaration/enum";
import { ValidationService } from "./ValidationService";
import { RequestService } from "./RequestService";
import { ISummonerDTO } from "../entity/Summoner-v4/SummonerDTO";
import { IChampionInfo } from "../entity/Champion-v3/ChampionInfo";
import { ChampionMasteryDTO, IChampionMasteryDTO } from "../entity/ChampionMasteries-v4/ChampionMasteryDTO";
import { ILeagueEntryDTO } from "../entity/League-v4/LeagueEntryDTO";
import { CacheService, CacheTimer, CacheName } from "./CacheService";
import { NoDataException } from "../declaration/exception/NoDataException";

// **** Variables **** //
// TEst : Htetkokolij

// Errors
export const RiotLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName: string) => `An error occured in 'RiotService.${functionName}'.`,
} as const;

export interface IRiotService {
    SummonerV4: SummonerV4;
    ChampionMasteryV4: ChampionMasteryV4;
    ChampionV3: ChampionV3;
    LeagueV4: LeagueV4;
}

// https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type#:~:text=The%20%22Property%20does%20not%20exist,type%20with%20variable%20key%20names.&text=Copied!

// **** Class  **** //
export class RiotService implements IRiotService {
    SummonerV4: SummonerV4 = new SummonerV4;
    ChampionMasteryV4: ChampionMasteryV4 = new ChampionMasteryV4;
    ChampionV3: ChampionV3 = new ChampionV3;
    LeagueV4: LeagueV4 = new LeagueV4;
}


export class SummonerV4 {

    /**
    * Return a summoner
    * @param summonerName SummonerName
    * @param region Region
    * @returns  {ISummonerDTO}
    * @throws Error params is invalid
    */
    async getBySummonerName(summonerName: string, region: string): Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

        let returnValue!: ISummonerDTO;

        const cacheName = CacheName.LEAGUE_SUMMONER.replace('{0}', realRegion).replace('{1}', summonerName);
        try {
            if (EnvVars.cache.enabled) {   
                let cacheValue: ISummonerDTO = CacheService.getInstance().getCache<ISummonerDTO>(cacheName);
                return cacheValue;
            }
        }
        catch (ex: any) {
            if (ex instanceof NoDataException) {
                console.log(ex.toString());
            }
        }

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getSummonerBySummonerName'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<ISummonerDTO>(cacheName, returnValue, CacheTimer.SUMMONER);
        }

        return returnValue;
    }

    /**
     * Return a summoner
     * @param puuid Summoner puuid
     * @param region Region
     * @returns {ISummonerDTO}
     * @throws Error params is invalid
     */
    async getByPuuid(puuid: string, region: string): Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars.routes.summoner.v4.getByPuuid.replace('{puuid}', puuid).replace('{region}', realRegion);

        let returnValue!: ISummonerDTO;
        const cacheName = CacheName.LEAGUE_SUMMONER.replace('{0}', realRegion).replace('{1}', puuid);
        try {
            if (EnvVars.cache.enabled) {
                let cacheValue: ISummonerDTO = CacheService.getInstance().getCache<ISummonerDTO>(cacheName);
                return cacheValue;
            }
        }
        catch (ex: any) {
            if (ex instanceof NoDataException) {
                console.log(ex.toString());
            }
        }

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getSummonerByPuuid'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<ISummonerDTO>(cacheName, returnValue, CacheTimer.SUMMONER);
        }

        return returnValue;
    }
}

export class ChampionMasteryV4 {

    /**
     * Return a @type {ChampionMasteryDTO} contains a array of @type {IChampionMasteryDTO}
     * @param encryptedSummonerId 
     * @param region 
     * @returns {ChampionMasteryDTO}
     */
    async getByEncryptedSummonerId(encryptedSummonerId: string, region: string): Promise<ChampionMasteryDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const masteriesUrl = EnvVars.routes.championMastery.v4.getChampionMasteriesBySummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

        let returnValue: ChampionMasteryDTO = new ChampionMasteryDTO();

        const cacheName = CacheName.LEAGUE_MASTERIES.replace('{0}', realRegion).replace('{1}', encryptedSummonerId);
        try {
            if (EnvVars.cache.enabled) {
                let cacheValue: ChampionMasteryDTO = CacheService.getInstance().getCache<ChampionMasteryDTO>(cacheName);
                return cacheValue;
            }
        }
        catch (ex: any) {
            if (ex instanceof NoDataException) {
                console.log(ex.toString());
            }
        }

        await RequestService.callRiotAPI<Array<IChampionMasteryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            if (returnValue != null && returnValue.championMasteries == null) {
                returnValue.championMasteries = new Array<IChampionMasteryDTO>();
            }
            returnValue.championMasteries = result;

        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getRiotRotate'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<ChampionMasteryDTO>(cacheName, returnValue, CacheTimer.MASTERIES);
        }

        return returnValue;
    }
}

export class ChampionV3 {

    /**
     * Return a @type {IChampionInfo}
     * @param region 
     * @returns  {IChampionInfo}
     */
    async getChampionRotations(region: string): Promise<IChampionInfo> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const championRotateUrl = EnvVars.routes.champion.v3.championRotation.replace('{region}', realRegion);

        let returnValue!: IChampionInfo;

        const cacheName = CacheName.LEAGUE_ROTATE.replace('{0}', realRegion);
        try {
            if (EnvVars.cache.enabled) {
                let cacheValue: IChampionInfo = CacheService.getInstance().getCache<IChampionInfo>(cacheName);
                return cacheValue;
            }
        }
        catch (ex: any) {
            if (ex instanceof NoDataException) {
                console.log(ex.toString());
            }
        }

        await RequestService.callRiotAPI<IChampionInfo>(championRotateUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getRiotRotate'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<IChampionInfo>(cacheName, returnValue, CacheTimer.ROTATE);
        }

        return returnValue;
    }
}

export class LeagueV4 {

    /**
     * Return a @type {ILeagueEntryDTO}
     * @param encryptedSummonerId 
     * @param region 
     * @returns 
     */
    async getLeagueEntriesByEncryptedSummonerId(encryptedSummonerId: string, region: string): Promise<Array<ILeagueEntryDTO>> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const masteriesUrl = EnvVars.routes.league.v4.getLeagueEntriesForSummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

        let returnValue!: Array<ILeagueEntryDTO>;

        const cacheName = CacheName.LEAGUE_RANK.replace('{0}', realRegion).replace('{1}', encryptedSummonerId);
        try {
            if (EnvVars.cache.enabled) {
                let cacheValue: Array<ILeagueEntryDTO> = CacheService.getInstance().getCache<Array<ILeagueEntryDTO>>(cacheName);
                return cacheValue;
            }
        }
        catch (ex: any) {
            if (ex instanceof NoDataException) {
                console.log(ex.toString());
            }
        }


        await RequestService.callRiotAPI<Array<ILeagueEntryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;

        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getRiotRotate'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        if (EnvVars.cache.enabled) {
            CacheService.getInstance().setCache<Array<ILeagueEntryDTO>>(cacheName, returnValue, CacheTimer.RANK);
        }

        return returnValue;
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    RiotLocalization,
    RiotService,
} as const;
