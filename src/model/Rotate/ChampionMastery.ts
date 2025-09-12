import { IChampionMasteryDTO } from '@bedy90/riotentity';
import { IChampion } from './Champion.js';

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
    champion!: IChampion;

    puuid = '';
    championPointsUntilNextLevel = 0n;
    chestGranted = false;
    championId = 0n;
    lastPlayTime = 0n;
    championLevel = 0;
    championPoints = 0;
    championPointsSinceLastLevel = 0n;
    markRequiredForNextLevel = 0;
    championSeasonMilestone = 0;
    nextSeasonMilestone = undefined;
    tokensEarned = 0;
    milestoneGrades = [];

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
 * List Of ChampionMastery
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