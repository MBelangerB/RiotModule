
// -----------------------------
// Riot Champion
// -----------------------------
export interface IRotation {
    maxNewPlayerLevel: number;
    freeChampionIdsForNewPlayers: Array<IChampion>;
    freeChampionIds: Array<IChampion>;   

    getFreeChampionStr() : string;
    getNewbiesFreeChampionStr() : string;
}

export interface IChampion {
    id: number;
    name?: string;
    squareUrl?: string;
    loadingScreenUrl?: string;
}

export class Rotation implements IRotation {
    maxNewPlayerLevel: number = 0;
    freeChampionIdsForNewPlayers: IChampion[] = [];
    freeChampionIds: IChampion[] = [];

    getFreeChampionStr(): string {
        let returnValue = '';

        this.freeChampionIds.forEach(function (champ: IChampion) {
            if (returnValue.length > 0) { returnValue += ' | '; }
            returnValue += champ.name;
        });

        returnValue = returnValue.trimEnd();

        return returnValue;
    }
    getNewbiesFreeChampionStr(): string {
        let returnValue = '';

        this.freeChampionIdsForNewPlayers.forEach(function (champ: IChampion) {
            if (returnValue.length > 0) { returnValue += ' | '; }
            returnValue += champ.name;
        });

        returnValue = returnValue.trimEnd();

        return returnValue;
    }
}
