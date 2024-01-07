import { DragonChampion } from '../model/DragonModel';
import { DragonCulture } from './enum';

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
