import { AxiosError } from 'axios';
import { IChampionMasteryDTO } from '@bedy90/riotentity';

// Declaration import
import { EnvVars, RiotGameType, ModuleVersion, replaceRouteParams } from '../../riotmodule.js';

// Cache and type Import
import { ChampionMasteries, ChampionMastery, ChampionOption } from '../../riotmodule.js';

// Service import 
import { ValidationService, DragonService, RequestService, CacheService, CacheTimer, CacheName } from '../index.js';


import { RiotServiceLocalization } from '../RiotService.js'

export class ChampionMasteryService_V4 {
  routeService: ModuleVersion = EnvVars.routes.championMastery.v4;

  /**
   * Return a @type {Array<IChampionMasteryDTO>}
   * TODO: Rework encryptedSummonerId is @deprecated
   * @param encryptedSummonerId
   * @param region
   * @returns {ChampionMasteries}
   */
  async getByEncryptedSummonerId(encryptedSummonerId: string, region: string, options?: ChampionOption | null): Promise<ChampionMasteries> {
    const realRegion = ValidationService.convertToRealRegion(region);

    // const masteriesUrl = EnvVars.routes.championMastery.v4.getChampionMasteriesBySummoner.replace('{encryptedSummonerId}', encryptedSummonerId).replace('{region}', realRegion);
    const routeUrl: string = replaceRouteParams(this.routeService.getChampionMasteriesBySummoner, { encryptedSummonerId: encryptedSummonerId, region: realRegion });


    const cacheName = CacheName.LEAGUE_MASTERIES.replace('{0}', realRegion).replace('{1}', encryptedSummonerId);
    if (EnvVars.cache.enabled) {
      const cacheValue: Array<IChampionMasteryDTO> | undefined = CacheService.getInstance().getCache<Array<IChampionMasteryDTO>>(cacheName);
      if (cacheValue != undefined) {
        return await this.buildChampionMasteries(cacheValue, options);
      }
    }

    let riotData: Array<IChampionMasteryDTO> = Array<IChampionMasteryDTO>();
    await RequestService.callRiotAPI<Array<IChampionMasteryDTO>>(routeUrl, RiotGameType.LeagueOfLegend).then((result) => {
      riotData = result;

    }).catch((err) => {
      console.error(RiotServiceLocalization.errInFunction('getByEncryptedSummonerId', 'ChampionMasteryService'));
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
    * Use [IChampionInfo_v3] for build Rotation with option.
    * [TODO: Review]
    * @param summonerMasteries
    * @param options
    * @returns {ChampionMasteries}
    */
  private async buildChampionMasteries(summonerMasteries: Array<IChampionMasteryDTO>, options?: ChampionOption | null): Promise<ChampionMasteries> {
    const prepareMasteries = new Promise<ChampionMasteries>((resolve) => {
      const returnValue: ChampionMasteries = new ChampionMasteries();

      summonerMasteries.reduce((prevMasteries, currentMasteries) => {
        return prevMasteries.then(() => {
          return DragonService.getChampionInfoById(currentMasteries.championId, options?.culture).then((info) => {
            const masteries: ChampionMastery = new ChampionMastery();
            // masteries.summonerId = currentMasteries.summonerId;
            masteries.puuid = currentMasteries.puuid;
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
                masteries.champion.loadingScreenUrl = EnvVars.dragon.imageUrl.loadingScreenByChampion.replace('{championId}', info.key);
              }
            }

            returnValue.championMastery.push(masteries);
          });
        });
      }, Promise.resolve()).then(() => {
        resolve(returnValue);
      });
    });
    return prepareMasteries;
  }
}