export interface IChampionMasteryDto {
    /**
     * Number of points needed to achieve next level. Zero if player reached maximum champion level for this champion.
     */
    championPointsUntilNextLevel: number;
    /**
     * Is chest granted for this champion or not in current season.
     */
    chestGranted: boolean;
    /**
     * Champion ID for this entry.
     */
    championId: number;
    /**
     * Last time this champion was played by this player - in Unix milliseconds time format.
     */
    lastPlayTime: number;
    /**
     * 	Champion level for specified player and champion combination.
     */
    championLevel: number;
    /**
     * Summoner ID for this entry. (Encrypted)
     */
    summonerId: string;
    /**
     * Total number of champion points for this player and champion combination - they are used to determine championLevel.
     */
    championPoints: number;
    /**
     * Number of points earned since current level has been achieved.
     */
    championPointsSinceLastLevel: number;
    /**
     * 	The token earned for this champion at the current championLevel. When the championLevel is advanced the tokensEarned resets to 0.
     */
    tokensEarned: number;
}
