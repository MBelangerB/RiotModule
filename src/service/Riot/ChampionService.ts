import { AxiosError } from 'axios';
import { IChampionInfo } from '@bedy90/riotentity';

// Declaration import
import { EnvVars, RiotGameType, ChampionOption, ModuleVersion, replaceRouteParams } from '../../riotmodule.js';

// Model import
import { IChampion, Rotation, DragonChampion } from '../../riotmodule.js';

// Service import 
import { ValidationService, DragonService, RequestService, CacheService, CacheTimer, CacheName } from '../index.js';

import { RiotServiceLocalization} from '../RiotService.js'

export class ChampionService_V3 {
    routeService: ModuleVersion = EnvVars.routes.champion.v3;

    /**
     * Return a @type {IChampionInfo}
     * @param region
     * @param options
     * @returns  {IChampionInfo}
     */
    async getChampionRotations(region: string, options?: ChampionOption | null): Promise<Rotation> {

        const realRegion = ValidationService.convertToRealRegion(region);
        // const championRotateUrl = EnvVars.routes.champion.v3.championRotation.replace('{region}', realRegion);
        const routeUrl: string = replaceRouteParams(this.routeService.championRotation, { region: realRegion });


        const cacheName = CacheName.LEAGUE_ROTATE.replace('{0}', realRegion);
        if (EnvVars.cache.enabled) {
            const cacheValue: IChampionInfo = CacheService.getInstance().getCache<IChampionInfo>(cacheName)!;

            if (cacheValue != undefined) {
                return await this.buildRotation(cacheValue, options);
            }
        }

        let riotReturnValue!: IChampionInfo;
        await RequestService.callRiotAPI<IChampionInfo>(routeUrl, RiotGameType.LeagueOfLegend).then((result) => {
            riotReturnValue = result;
        }).catch((err) => {
            console.error(RiotServiceLocalization.errInFunction('getChampionRotations', 'ChampionService'));
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
        const returnValue: Rotation = new Rotation();
        returnValue.maxNewPlayerLevel = riotRotation.maxNewPlayerLevel;

        for (const currentChampId of riotRotation.freeChampionIds) {
          const info: DragonChampion = await DragonService.getChampionInfoById(BigInt(currentChampId), options?.culture);

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
          if (options && options.getSkins == true) {
            const detailInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName(info.id, options?.culture);
            freeChamp.skins = detailInfo.skins;
          }

          returnValue.freeChampionIds.push(freeChamp);
        }

        for (const currentChampId of riotRotation.freeChampionIdsForNewPlayers) {
          const info: DragonChampion = await DragonService.getChampionInfoById(BigInt(currentChampId), options?.culture);

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
          if (options && options.getSkins == true) {
            const detailInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName(info.id, options?.culture);
            freeChamp.skins = detailInfo.skins;
          }

          returnValue.freeChampionIdsForNewPlayers.push(freeChamp);
        }

        if (options && options.showChampionName == true) {
          returnValue.freeChampionIds.sort((a: IChampion, b: IChampion) => {
            return a.name!.localeCompare(b.name!);
          });
          returnValue.freeChampionIdsForNewPlayers.sort((a: IChampion, b: IChampion) => {
            return a.name!.localeCompare(b.name!);
          });
        }

        return returnValue;
      }

    // private async buildRotation(riotRotation: IChampionInfo, options?: ChampionOption | null): Promise<Rotation> {
    //     /* eslint-disable @typescript-eslint/no-explicit-any */
    //     /* eslint-disable @typescript-eslint/no-unused-vars */
    //     // TODO: Reowrk
    //     const prepareRotation = new Promise<Rotation>(async (resolve: any, reject: any) => {
    //         const returnValue: Rotation = new Rotation();
    //         returnValue.maxNewPlayerLevel = riotRotation.maxNewPlayerLevel;

    //         await riotRotation.freeChampionIds.reduce(async (prevChampionId, currentChampId) => {
    //             await prevChampionId;

    //             const info: DragonChampion = await DragonService.getChampionInfoById(currentChampId, options?.culture);

    //             const freeChamp: IChampion = {
    //                 id: parseInt(info.key),
    //             };

    //             if (options && options.showChampionName == true) {
    //                 freeChamp.name = info.name;
    //             }
    //             if (options && options.showSquare == true) {
    //                 freeChamp.squareUrl = EnvVars.dragon.imageUrl.squareByChampionId.replace('{championId}', info.key);
    //             }
    //             if (options && options.showLoadingScreen == true) {
    //                 freeChamp.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championName}', info.id).replace('{skinId}', '0');
    //             }
    //             if (options && options.getSkins == true) {
    //                 const detailInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName(info.id, options?.culture);
    //                 freeChamp.skins = detailInfo.skins;
    //             }

    //             returnValue.freeChampionIds.push(freeChamp);
    //         }, Promise.resolve());

    //         await riotRotation.freeChampionIdsForNewPlayers.reduce(async (prevChampionId, currentChampId) => {
    //             await prevChampionId;

    //             const info: DragonChampion = await DragonService.getChampionInfoById(currentChampId, options?.culture);

    //             const freeChamp: IChampion = {
    //                 id: parseInt(info.key),
    //             };

    //             if (options && options.showChampionName == true) {
    //                 freeChamp.name = info.name;
    //             }
    //             if (options && options.showSquare == true) {
    //                 freeChamp.squareUrl = EnvVars.dragon.imageUrl.squareByChampionId.replace('{championId}', info.key);
    //             }
    //             if (options && options.showLoadingScreen == true) {
    //                 freeChamp.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championName}', info.id).replace('{skinId}', '0');
    //             }
    //             if (options && options.getSkins == true) {
    //                 const detailInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName(info.id, options?.culture);
    //                 freeChamp.skins = detailInfo.skins;
    //             }

    //             returnValue.freeChampionIdsForNewPlayers.push(freeChamp);
    //         }, Promise.resolve());

    //         // TODO CHECK IF OK
    //         if (options && options.showChampionName == true) {
    //             returnValue.freeChampionIds.sort(function (a: IChampion, b: IChampion) {
    //                 return a.name!.localeCompare(b.name!);
    //             });
    //             returnValue.freeChampionIdsForNewPlayers.sort((a: IChampion, b: IChampion) => {
    //                 return a.name!.localeCompare(b.name!);
    //             });
    //         }


    //         resolve(returnValue);
    //     });

    //     return await Promise.resolve(prepareRotation);
    // }
}