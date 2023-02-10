export interface IChampionInfo {
    maxNewPlayerLevel: number;
    freeChampionIdsForNewPlayers: Array<number>;
    freeChampionIds: Array<number>;
}

// export class ChampionInfo implements IChampionInfo {
//     maxNewPlayerLevel: number = 0;
//     freeChampionIdsForNewPlayers: number[] = [];
//     freeChampionIds: number[] = [];
// }