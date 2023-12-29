import { DragonCulture } from './enum';

export type RegionData = {
    [key: string]: string
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
     * Show the square icon url
     */
    showSquare?: boolean | undefined
    /**
     *  Show the loading screen char url. (default skin)
     */
    showLoadingScreen?: boolean | undefined
}
