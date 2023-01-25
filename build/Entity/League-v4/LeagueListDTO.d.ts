export interface ILeagueListDTO {
    leagueId: string;
    entries: Array<ILeagueItemDTO>;
    tier: string;
    name: string;
    queue: string;
}
export interface ILeagueItemDTO {
    freshBlood: boolean;
    /**
     * 	Winning team on Summoners Rift.
     */
    wins: number;
    summonerName: string;
    miniSeries: IMiniSeriesDTO;
    inactive: boolean;
    veteran: boolean;
    hotStreak: boolean;
    rank: string;
    leaguePoints: number;
    /**
     * Losing team on Summoners Rift.
     */
    losses: number;
    /**
     * Player's encrypted summonerId.
     */
    summonerId: string;
}
export interface IMiniSeriesDTO {
    losses: number;
    progress: string;
    target: number;
    wins: number;
}
