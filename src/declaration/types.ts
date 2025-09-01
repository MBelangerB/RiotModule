import { DragonChampion } from '../model/DragonModel.js';
import { DragonCulture } from './enum.js';

export type RegionData = {
    [key: string]: string
}

export type ChampionData = {
    [key: string]: DragonChampion
}

/**
 * Champion options
 */
export type ChampionOption = {
    /**
     * The culture used for the display of the champions.
     */
    culture?: DragonCulture | undefined,
    /**
     * Show the champion name
     */
    showChampionName?: boolean | undefined
    /**
     * Show the square icon url. (JSON Only)
     */
    showSquare?: boolean | undefined
    /**
     *  Show the loading screen char url. (default skin) (JSON Only)
     */
    showLoadingScreen?: boolean | undefined
    /**
     *  Get skins data. (JSON Only)
     */
    getSkins?: boolean | undefined
}

/**
 * Summoner rank options
 */
export type SummonerRank = {
  /**
     * The culture used for the display of the champions.
     */
  culture?: DragonCulture | undefined,

  showSummonerName?: boolean | undefined

  showAccontName?: boolean | undefined

  showLP?: boolean | undefined

  showWinRate?: boolean | undefined

  showQueueName?: boolean | undefined
}