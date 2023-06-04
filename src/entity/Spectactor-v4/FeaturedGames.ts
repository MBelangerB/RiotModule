export interface IFeaturedGames {
    /**
     * The list of featured games
     */
    gameList: Array<IFeaturedGameInfo>;
    /**
     * 	The suggested interval to wait before requesting FeaturedGames again
     */
    clientRefreshInterval: number;
}
export interface IFeaturedGameInfo {
    /**
     * The game mode (Legal values: CLASSIC, ODIN, ARAM, TUTORIAL, ONEFORALL, ASCENSION, FIRSTBLOOD, KINGPORO)
     */
    gameMode: string;
    /**
     * The amount of time in seconds that has passed since the game started
     */
    gameLength: number;
    /**
     * The ID of the map
     */
    mapId: number;
    /**
     * The game type (Legal values: CUSTOM_GAME, MATCHED_GAME, TUTORIAL_GAME)
     */
    gameType: string;
    /**
     * Banned champion information
     */
    bannedChampions: Array<IBannedChampion>;
    /**
     * The ID of the game
     */
    gameId: number;
    /**
     * The observer information
     */
    observers: IObserver;
    /**
     * The queue type (queue types are documented on the Game Constants page)
     */
    gameQueueConfigId: number;
    /**
     * The game start time represented in epoch milliseconds
     */
    gameStartTime: number;
    /**
     * 	The participant information
     */
    participants: Array<IParticipant>;
    /**
     * The ID of the platform on which the game is being played
     */
    platformId: string;
}
export interface IBannedChampion {
    /**
     * 	The turn during which the champion was banned
     */
    pickTurn: number;
    /**
     * The ID of the banned champion
     */
    championId: number;
    /**
     * The ID of the team that banned the champion
     */
    teamId: number;
}
export interface IObserver {
    /**
     * Key used to decrypt the spectator grid game data for playback
     */
    encryptionKey: string;
}
export interface IParticipant {
    /**
     * Flag indicating whether or not this participant is a bot
     */
    bot: boolean;
    /**
     * The ID of the second summoner spell used by this participant
     */
    spell2Id: number;
    /**
     * The ID of the profile icon used by this participant
     */
    profileIconId: number;
    /**
     * The summoner name of this participant
     */
    summonerName: string;
    /**
     * The ID of the champion played by this participant
     */
    championId: number;
    /**
     * The team ID of this participant, indicating the participant's team
     */
    teamId: number;
    /**
     * The ID of the first summoner spell used by this participant
     */
    spell1Id: number;
}
