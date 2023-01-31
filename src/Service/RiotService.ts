
import { AxiosError } from "axios";
import EnvVars from "../declaration/major/EnvVars";
import { RiotGameType } from "../declaration/enum";
import { ValidationService } from "./ValidationService";
import { RequestService } from "./RequestService";
import { ISummonerDTO } from "../entity/Summoner-v4/SummonerDTO";
import { IChampionInfo } from "../entity/Champion-v3/ChampionInfo";
import { ChampionMasteryDTO, IChampionMasteryDTO } from "../entity/ChampionMasteries-v4/ChampionMasteryDTO";
import { ILeagueEntryDTO } from "../entity/League-v4/LeagueEntryDTO";

// **** Variables **** //
// TEst : Htetkokolij

// Errors
export const RiotLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName: string) => `An error occured in 'RiotService.${functionName}'.`,
} as const;

// **** Class  **** //
export abstract class RiotService {

    static SummonerV4: SummonerV4;
    static ChampionMasteryV4: ChampionMasteryV4;
    static ChampionV3: ChampionV3;
    static LeagueV4: LeagueV4;

    // /**
    //  * Return a @type {ISummonerDTO}
    //  * @param summonerName SummonerName
    //  * @param region Region
    //  * @returns  {ISummonerDTO}
    //  * @throws Error params is invalid
    //  */
    // static async getRiotSummonerByName(summonerName: string, region: string): Promise<ISummonerDTO> {
    //     const realRegion = ValidationService.convertToRealRegion(region);
    //     const summonerUrl = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

    //     let returnValue!: ISummonerDTO;

    //     await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
    //         returnValue = result;
    //     }).catch((err) => {
    //         console.error(exports.RiotServiceLocalization.errInFunction('getRiotSummonerByName'));
    //         if (err instanceof AxiosError) {
    //             console.error(err.message);
    //         }
    //         else if (err.response && err.response.data) {
    //             console.error(err.response.data);
    //         }
    //         else {
    //             console.error(err);
    //         }
    //         throw err;
    //     });

    //     return returnValue;
    // }

    // /**
    //  * Return a @type {IChampionInfo}
    //  * @param region 
    //  * @returns  {IChampionInfo}
    //  */
    // static async getRiotRotate(region: string): Promise<IChampionInfo> {
    //     const realRegion = ValidationService.convertToRealRegion(region);
    //     const championRotateUrl = EnvVars.routes.champion.v3.championRotation.replace('{region}', realRegion);

    //     let returnValue!: IChampionInfo;

    //     await RequestService.callRiotAPI<IChampionInfo>(championRotateUrl, RiotGameType.LeagueOfLegend).then((result) => {
    //         returnValue = result;
    //     }).catch((err) => {
    //         console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
    //         if (err instanceof AxiosError) {
    //             console.error(err.message);
    //         }
    //         else if (err.response && err.response.data) {
    //             console.error(err.response.data);
    //         }
    //         else {
    //             console.error(err);
    //         }
    //         throw err;
    //     });

    //     return returnValue;
    // }

    // /**
    //  * Return a @type {ChampionMasteryDTO} contains a array of @type {IChampionMasteryDTO}
    //  * @param encryptedSummonerId 
    //  * @param region 
    //  * @returns {ChampionMasteryDTO}
    //  */
    // static async getSummonerChampionMasteries(encryptedSummonerId: string, region: string): Promise<ChampionMasteryDTO> {
    //     const realRegion = ValidationService.convertToRealRegion(region);
    //     const masteriesUrl = EnvVars.routes.championMastery.v4.getChampionMasteriesBySummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

    //     let returnValue: ChampionMasteryDTO = new ChampionMasteryDTO();

    //     await RequestService.callRiotAPI<Array<IChampionMasteryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
    //         if (returnValue != null && returnValue.championMasteries == null) {
    //             returnValue.championMasteries = new Array<IChampionMasteryDTO>();
    //         }
    //         returnValue.championMasteries = result;

    //     }).catch((err) => {
    //         console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
    //         if (err instanceof AxiosError) {
    //             console.error(err.message);
    //         }
    //         else if (err.response && err.response.data) {
    //             console.error(err.response.data);
    //         }
    //         else {
    //             console.error(err);
    //         }
    //         throw err;
    //     });

    //     return returnValue;
    // }

    // /**
    //  * Return a @type {ILeagueEntryDTO}
    //  * @param encryptedSummonerId 
    //  * @param region 
    //  * @returns 
    //  */
    // static async getRiotSummonerRank(encryptedSummonerId: string, region: string): Promise<Array<ILeagueEntryDTO>> {
    //     const realRegion = ValidationService.convertToRealRegion(region);
    //     const masteriesUrl = EnvVars.routes.league.v4.getLeagueEntriesForSummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

    //     let returnValue!: Array<ILeagueEntryDTO>;

    //     await RequestService.callRiotAPI<Array<ILeagueEntryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
    //         returnValue = result;

    //     }).catch((err) => {
    //         console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
    //         if (err instanceof AxiosError) {
    //             console.error(err.message);
    //         }
    //         else if (err.response && err.response.data) {
    //             console.error(err.response.data);
    //         }
    //         else {
    //             console.error(err);
    //         }
    //         throw err;
    //     });

    //     return returnValue;
    // }
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

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getSummonerBySummonerName'));
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

        return returnValue;
    }

    /**
     * Return a summoner
     * @param puuid Summoner puuid
     * @param region Region
     * @returns  {ISummonerDTO}
     * @throws Error params is invalid
     */
    async getByPuuid(puuid: string, region: string): Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars.routes.summoner.v4.getByPuuid.replace('{puuid}', puuid).replace('{region}', realRegion);

        let returnValue!: ISummonerDTO;

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getSummonerByPuuid'));
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

        await RequestService.callRiotAPI<Array<IChampionMasteryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            if (returnValue != null && returnValue.championMasteries == null) {
                returnValue.championMasteries = new Array<IChampionMasteryDTO>();
            }
            returnValue.championMasteries = result;

        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
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

        return returnValue;
    }
}

export class ChampionV3 {
    /**
     * Return a @type {IChampionInfo}
     * @param region 
     * @returns  {IChampionInfo}
     */
     static async getChampionRotations(region: string): Promise<IChampionInfo> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const championRotateUrl = EnvVars.routes.champion.v3.championRotation.replace('{region}', realRegion);

        let returnValue!: IChampionInfo;

        await RequestService.callRiotAPI<IChampionInfo>(championRotateUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
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
     static async getLeagueEntriesByEncryptedSummonerId(encryptedSummonerId: string, region: string): Promise<Array<ILeagueEntryDTO>> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const masteriesUrl = EnvVars.routes.league.v4.getLeagueEntriesForSummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

        let returnValue!: Array<ILeagueEntryDTO>;

        await RequestService.callRiotAPI<Array<ILeagueEntryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;

        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getRiotRotate'));
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

        return returnValue;
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    RiotLocalization,
    RiotService,
    SummonerV4,
    ChampionMasteryV4,
    ChampionV3,
    LeagueV4
} as const;
