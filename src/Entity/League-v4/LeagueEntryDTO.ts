import { IMiniSeriesDTO } from "./LeagueListDTO";
export interface ILeagueEntryDTO {
    leagueId: string;
    /**
     * 	Player's summonerId (Encrypted)
     */
    summonerId: string;
    summonerName: string;
    queueType: string;
    tier: string;
    /**
     * The player's division within a tier.
     */
    rank: string;
    leaguePoints: number;
    /**
     * Winning team on Summoners Rift. First placement in Teamfight Tactics.
     */
    wins: number;
    /**
     * Losing team on Summoners Rift. Second through eighth placement in Teamfight Tactics.
     */
    losses: number;
    hotStreak: boolean;
    veteran: boolean;
    freshBlood: boolean;
    inactive: boolean;
    miniSeries: IMiniSeriesDTO;
}
