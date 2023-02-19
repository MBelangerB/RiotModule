// -----------------------------
// Riot Rotation

import { IChampionMasteryDTO } from '../entity/ChampionMasteries-v4/ChampionMasteryDTO';

// -----------------------------
export interface IRotation {
    maxNewPlayerLevel: number;
    freeChampionIdsForNewPlayers: Array<IChampion>;
    freeChampionIds: Array<IChampion>;

    getFreeChampionStr(): string;
    getNewbiesFreeChampionStr(): string;
}

export interface IChampion {
    id: number;
    name?: string;
    squareUrl?: string;
    loadingScreenUrl?: string;
}

export class Rotation implements IRotation {
    maxNewPlayerLevel = 0;
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


// -----------------------------
// Riot Masteries
// -----------------------------

export interface IChampionMastery extends IChampionMasteryDTO {
    champion?: IChampion;
    toString(): string;
}

/**
 * A champion mastery for a summoner
 */
export class ChampionMastery implements IChampionMastery {
    summonerId = '';
    championId = 0;
    champion!: IChampion;
    championLevel = 0;
    championPointsUntilNextLevel = 0;
    championPoints = 0;
    championPointsSinceLastLevel = 0;
    chestGranted = false;
    tokensEarned = 0;
    lastPlayTime = 0;

    /**
     * Get Champion name + pts
     * @returns
     */
    public toString(): string {
        const returnValue = `${this.champion?.name} (${this.championPoints} pts)`;
        return returnValue.trimEnd();
    }
}

/**
 * Summoner champion masteries
 */
export class ChampionMasteries {
    championMastery: Array<ChampionMastery> = new Array<ChampionMastery>;

    public toString(): string {
        let returnValue = '';
        this.championMastery.forEach(function (champion: ChampionMastery) {
            if (returnValue.length > 0) { returnValue += ' | '; }

            returnValue += `${champion.champion?.name} (${champion.championPoints} pts)`; // champion.toString();
        });
        return returnValue.trimEnd();
    }

    getResult(n: number): string {
        let returnValue = '';
        for (let index = 0; index < n; index++) {
            const element: ChampionMastery = this.championMastery[index];
            if (returnValue.length > 0) { returnValue += ' | '; }

            returnValue += `${element.champion?.name} (${element.championPoints} pts)`; // element.toString();
        }

        return returnValue.trimEnd();
    }
}