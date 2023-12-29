import { AxiosError } from 'axios';
import EnvVars from '../declaration/major/EnvVars';
import { RiotGameType } from '../declaration/enum';
import { ValidationService } from './ValidationService';
import { RequestService } from './RequestService';
import { IAccountDTO } from '../entity/Account-v1/AccountDTO';
import { ISummonerDTO } from '../entity/Summoner-v4/SummonerDTO';
import { IChampionInfo } from '../entity/Champion-v3/ChampionInfo';
import { IChampionMasteryDTO } from '../entity/ChampionMasteries-v4/ChampionMasteryDTO';
import { ILeagueEntryDTO } from '../entity/League-v4/LeagueEntryDTO';
import { CacheService, CacheTimer, CacheName } from './CacheService';
import { DragonService } from './DragonService';
import { ChampionMasteries, ChampionMastery, IChampion, Rotation } from '../model/RiotModel';
import { DragonChampion } from '../model/DragonModel';
import { ChampionOption } from '../declaration/types';

// **** Variables **** //
// TEst : Htetkokolij

// Errors
export const RiotLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName: string) => `An error occured in 'RiotService.${functionName}'.`,
} as const;

export interface IRiotService {
    AccountV1: AccountV1;
    SummonerV4: SummonerV4;
    ChampionMasteryV4: ChampionMasteryV4;
    ChampionV3: ChampionV3;
    LeagueV4: LeagueV4;
}

// https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type#:~:text=The%20%22Property%20does%20not%20exist,type%20with%20variable%20key%20names.&text=Copied!

// **** Class  **** //
export class RiotService implements IRiotService {
    AccountV1: AccountV1 = new AccountV1;
    SummonerV4: SummonerV4 = new SummonerV4;
    ChampionMasteryV4: ChampionMasteryV4 = new ChampionMasteryV4;
    ChampionV3: ChampionV3 = new ChampionV3;
    LeagueV4: LeagueV4 = new LeagueV4;
}
// TODO: Replace AWAIT RequestService.callRiotAPI by Promise < resolve, reject >

export class AccountV1 {

    /**
     * Get Riot Account info by user PUUID and region
     * @param puuid
     * @param region
     * @returns
     */
    async getByPuuid(puuid: string, region: string): Promise<IAccountDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const globalRegion = ValidationService.convertToGlobalRegion(realRegion);
        const accountUrl = EnvVars.routes.account.v1.getByPuuid.replace('{puuid}', puuid).replace('{globalRegion}', globalRegion);

        let returnValue!: IAccountDTO;

        const cacheName = CacheName.RIOT_ACCOUNT_PUUID.replace('{0}', globalRegion).replace('{1}', puuid);
        if (EnvVars.cache.enabled) {
            const cacheValue: IAccountDTO | undefined = CacheService.getInstance().getCache<IAccountDTO>(cacheName);
            if (cacheValue != undefined) {
                return cacheValue;
            }
        }

        await RequestService.callRiotAPI<IAccountDTO>(accountUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getByGameNameTagLine'));
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
            CacheService.getInstance().setCache<IAccountDTO>(cacheName, returnValue, CacheTimer.ACCOUNT);
        }

        return returnValue;
    }

    /**
     * Get Riot Account info by user gameName, tagLine and region
     * @param gameName
     * @param tagLine
     * @param region
     * @returns
     */
    async getByGameNameTagLine(gameName: string, tagLine: string, region: string): Promise<IAccountDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const globalRegion = ValidationService.convertToGlobalRegion(realRegion);
        const accountUrl = EnvVars.routes.account.v1.getRiotIdByGameNameAndTagLine.replace('{gameName}', gameName)
                                                                            .replace('{tagLine}', tagLine).replace('{globalRegion}', globalRegion);
        let returnValue!: IAccountDTO;

        const cacheName = CacheName.RIOT_ACCOUNT_GAMENAME_TAG.replace('{0}', globalRegion).replace('{1}', gameName).replace('{2}', tagLine);
        if (EnvVars.cache.enabled) {
            const cacheValue: IAccountDTO | undefined = CacheService.getInstance().getCache<IAccountDTO>(cacheName);
            if (cacheValue != undefined) {
                return cacheValue;
            }
        }

        await RequestService.callRiotAPI<IAccountDTO>(accountUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getByGameNameTagLine'));
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
            CacheService.getInstance().setCache<IAccountDTO>(cacheName, returnValue, CacheTimer.ACCOUNT);
        }

        return returnValue;
    }

}

export class SummonerV4 {

    /**
    * @deprecated  October 2023 : https://developer.riotgames.com/docs/summoner-name-to-riot-id-faq
    *
    * Return a summoner
    * @param summonerName SummonerName
    * @param region Region
    * @returns {ISummonerDTO}
    * @throws Error params is invalid
    */
    async getBySummonerName(summonerName: string, region: string): Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

        let returnValue!: ISummonerDTO;

        const cacheName = CacheName.LEAGUE_SUMMONER.replace('{0}', realRegion).replace('{1}', summonerName);
        if (EnvVars.cache.enabled) {
            const cacheValue: ISummonerDTO | undefined = CacheService.getInstance().getCache<ISummonerDTO>(cacheName);
            if (cacheValue != undefined) {
                return cacheValue;
            }
        }

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getBySummonerName'));
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
        if (EnvVars.cache.enabled) {
            const cacheValue: ISummonerDTO | undefined = CacheService.getInstance().getCache<ISummonerDTO>(cacheName);
            if (cacheValue != undefined) {
                return cacheValue;
            }
        }

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getByPuuid'));
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
            CacheService.getInstance().setCache<ISummonerDTO>(cacheName, returnValue, CacheTimer.SUMMONER);
        }

        return returnValue;
    }
}

export class ChampionMasteryV4 {

    /**
     * Return a @type {Array<IChampionMasteryDTO>}
     * @param encryptedSummonerId
     * @param region
     * @returns {ChampionMasteryDTO}
     */
    async getByEncryptedSummonerId(encryptedSummonerId: string, region: string, options?: ChampionOption | null): Promise<ChampionMasteries> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const masteriesUrl = EnvVars.routes.championMastery.v4.getChampionMasteriesBySummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);

        const cacheName = CacheName.LEAGUE_MASTERIES.replace('{0}', realRegion).replace('{1}', encryptedSummonerId);
        if (EnvVars.cache.enabled) {
            const cacheValue: Array<IChampionMasteryDTO> | undefined = CacheService.getInstance().getCache<Array<IChampionMasteryDTO>>(cacheName);
            if (cacheValue != undefined) {
                return await this.buildChampionMasteries(cacheValue, options);
            }
        }

        let riotData: Array<IChampionMasteryDTO> = Array<IChampionMasteryDTO>();
        await RequestService.callRiotAPI<Array<IChampionMasteryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            riotData = result;

        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getByEncryptedSummonerId'));
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
            CacheService.getInstance().setCache<Array<IChampionMasteryDTO>>(cacheName, riotData, CacheTimer.MASTERIES);
        }

        // Cast
        return await this.buildChampionMasteries(riotData, options);
    }

/**
  * Use [IChampionInfo] for build Rotation with option.
  * [TODO: Review]
  * @param riotRotation
  * @param options
  * @returns
  */
    private async buildChampionMasteries(summonerMasteries: Array<IChampionMasteryDTO>, options?: ChampionOption | null): Promise<ChampionMasteries> {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        // TODO: Rework
        const prepareMasteries = new Promise<ChampionMasteries>(async (resolve: any) => {
            const returnValue: ChampionMasteries = new ChampionMasteries();


            await summonerMasteries.reduce(async (prevMasteries, currentMasteries) => {
                await prevMasteries;

                const info: DragonChampion = await DragonService.getChampionInfoById(currentMasteries.championId, options?.culture);

                const masteries: ChampionMastery = new ChampionMastery();
                masteries.summonerId = currentMasteries.summonerId;
                masteries.championId = currentMasteries.championId;
                masteries.championLevel = currentMasteries.championLevel;
                masteries.championPoints = currentMasteries.championPoints;
                masteries.championPointsSinceLastLevel = currentMasteries.championPointsSinceLastLevel;
                masteries.championPointsUntilNextLevel = currentMasteries.championPointsUntilNextLevel;
                masteries.chestGranted = currentMasteries.chestGranted;
                masteries.lastPlayTime = currentMasteries.lastPlayTime;
                masteries.tokensEarned = currentMasteries.tokensEarned;
                masteries.championId = currentMasteries.championId;

                if (options) {
                    masteries.champion = {
                        id: parseInt(info.key),
                    };

                    if (options.showChampionName == true) {
                        masteries.champion.name = info.name;
                    }
                    if (options.showSquare == true) {
                        masteries.champion.squareUrl = EnvVars.dragon.imageUrl.squareByChampionId.replace('{championId}', info.key);
                    }
                    if (options.showLoadingScreen == true) {
                        masteries.champion.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championName}', info.id).replace('{skinId}', '0');
                    }
                }

                returnValue.championMastery.push(masteries);

            }, Promise.resolve());

            // Todo CHeck


            if (options && options.showChampionName == true) {
                returnValue.championMastery.sort(function (a: ChampionMastery, b: ChampionMastery) {
                    // Inverted ( < = -1 | > 1 )
                    if (a.championPoints < b.championPoints) {
                        return 1;
                    }
                    if (a.championPoints > b.championPoints) {
                        return -1;
                    }
                    // return 0;
                    return a.champion.name!.localeCompare(b.champion.name!);
                    // return a.champion.name!.localeCompare(b.champion.name!);
                });
            }

            resolve(returnValue);
        });

        return await Promise.resolve(prepareMasteries);
    }

}

export class ChampionV3 {

    /**
     * Return a @type {IChampionInfo}
     * @param region
     * @returns  {IChampionInfo}
     */
    async getChampionRotations(region: string, options?: ChampionOption | null): Promise<Rotation> {

        const realRegion = ValidationService.convertToRealRegion(region);
        const championRotateUrl = EnvVars.routes.champion.v3.championRotation.replace('{region}', realRegion);

        const cacheName = CacheName.LEAGUE_ROTATE.replace('{0}', realRegion);
        if (EnvVars.cache.enabled) {
            const cacheValue: IChampionInfo = CacheService.getInstance().getCache<IChampionInfo>(cacheName)!;

            if (cacheValue != undefined) {
                return await this.buildRotation(cacheValue, options);
            }
        }

        let riotReturnValue!: IChampionInfo;
        await RequestService.callRiotAPI<IChampionInfo>(championRotateUrl, RiotGameType.LeagueOfLegend).then((result) => {
            riotReturnValue = result;
        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getChampionRotations'));
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
            CacheService.getInstance().setCache<IChampionInfo>(cacheName, riotReturnValue, CacheTimer.ROTATE);
        }

        return await this.buildRotation(riotReturnValue, options);
    }

    /**
     * Use [IChampionInfo] for build Rotation with option
     * @param riotRotation
     * @param options
     * @returns
     */
    private async buildRotation(riotRotation: IChampionInfo, options?: ChampionOption | null): Promise<Rotation> {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /* eslint-disable @typescript-eslint/no-unused-vars */
        // TODO: Reowrk
        const prepareRotation = new Promise<Rotation>(async (resolve: any, reject: any) => {
            const returnValue: Rotation = new Rotation();
            returnValue.maxNewPlayerLevel = riotRotation.maxNewPlayerLevel;

            await riotRotation.freeChampionIds.reduce(async (prevChampionId, currentChampId) => {
                await prevChampionId;

                const info: DragonChampion = await DragonService.getChampionInfoById(currentChampId, options?.culture);

                const freeChamp: IChampion = {
                    id: parseInt(info.key),
                };

                if (options && options.showChampionName == true) {
                    freeChamp.name = info.name;
                }
                if (options && options.showSquare == true) {
                    freeChamp.squareUrl = EnvVars.dragon.imageUrl.squareByChampionId.replace('{championId}', info.key);
                }
                if (options && options.showLoadingScreen == true) {
                    freeChamp.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championName}', info.id).replace('{skinId}', '0');
                }

                returnValue.freeChampionIds.push(freeChamp);
            }, Promise.resolve());

            await riotRotation.freeChampionIdsForNewPlayers.reduce(async (prevChampionId, currentChampId) => {
                await prevChampionId;

                const info: DragonChampion = await DragonService.getChampionInfoById(currentChampId, options?.culture);

                const freeChamp: IChampion = {
                    id: parseInt(info.key),
                };

                if (options && options.showChampionName == true) {
                    freeChamp.name = info.name;
                }
                if (options && options.showSquare == true) {
                    freeChamp.squareUrl = EnvVars.dragon.imageUrl.squareByChampionId.replace('{championId}', info.key);
                }
                if (options && options.showLoadingScreen == true) {
                    freeChamp.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championName}', info.id).replace('{skinId}', '0');
                }

                returnValue.freeChampionIdsForNewPlayers.push(freeChamp);
            }, Promise.resolve());

            // TODO CHECK IF OK
            if (options && options.showChampionName == true) {
                returnValue.freeChampionIds.sort(function (a: IChampion, b: IChampion) {
                    return a.name!.localeCompare(b.name!);
                });
                returnValue.freeChampionIdsForNewPlayers.sort((a: IChampion, b: IChampion) => {
                    return a.name!.localeCompare(b.name!);
                });
            }


            resolve(returnValue);
        });

        return await Promise.resolve(prepareRotation);
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
        if (EnvVars.cache.enabled) {
            const cacheValue: Array<ILeagueEntryDTO> | undefined = CacheService.getInstance().getCache<Array<ILeagueEntryDTO>>(cacheName);
            if (cacheValue != undefined) {
                return cacheValue;
            }
        }

        await RequestService.callRiotAPI<Array<ILeagueEntryDTO>>(masteriesUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;

        }).catch((err) => {
            console.error(exports.RiotLocalization.errInFunction('getLeagueEntriesByEncryptedSummonerId'));
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

        return returnValue;
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    RiotLocalization,
    RiotService,
} as const;
