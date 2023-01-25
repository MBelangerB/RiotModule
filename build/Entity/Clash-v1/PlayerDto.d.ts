export interface IPlayerDto {
    summonerId: string;
    teamId: string;
    /**
     * (Legal values: UNSELECTED, FILL, TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY)
     */
    position: string;
    /**
     * 	(Legal values: CAPTAIN, MEMBER)
     */
    role: string;
}
