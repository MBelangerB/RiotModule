import { IBannedChampion, IObserver } from "./FeaturedGames";
export interface ICurrentGameInfo {
    /**
     * The ID of the game
     */
    gameId: number;
    /**
     * The game type
     */
    gameType: string;
    /**
     * The game start time represented in epoch milliseconds
     */
    gameStartTime: number;
    /**
     * 	The ID of the map
     */
    mapId: number;
    /**
     * 	The amount of time in seconds that has passed since the game started
     */
    gameLength: number;
    /**
     * The ID of the platform on which the game is being played
     */
    platformId: string;
    /**
     * The game mode
     */
    gameMode: string;
    /**
     * 	Banned champion information
     */
    bannedChampions: Array<IBannedChampion>;
    /**
     * The queue type (queue types are documented on the Game Constants page)
     */
    gameQueueConfigId: number;
    /**
     * 	The observer information
     */
    observers: IObserver;
    /**
     * 	The participant information
     */
    participants: Array<ICurrentGameParticipant>;
}
export interface ICurrentGameParticipant {
    /**
     * 	The ID of the champion played by this participant
     */
    championId: number;
    /**
     * Perks / Runes Reforged Information
     */
    perks: IPerks;
    /**
     * The ID of the profile icon used by this participant
     */
    profileIconId: number;
    /**
     * 	Flag indicating whether or not this participant is a bot
     */
    bot: boolean;
    /**
     * The team ID of this participant, indicating the participant's team
     */
    teamId: number;
    /**
     * The summoner name of this participant
     */
    summonerName: string;
    /**
     * The encrypted summoner ID of this participant
     */
    summonerId: string;
    /**
     * 	The ID of the first summoner spell used by this participant
     */
    spell1Id: number;
    /**
     * The ID of the second summoner spell used by this participant
     */
    spell2Id: number;
    /**
     * List of Game Customizations
     */
    gameCustomizationObjects: Array<IGameCustomizationObject>;
}
export interface IPerks {
    /**
     * IDs of the perks/runes assigned.
     */
    perkIds: Array<number>;
    /**
     * Primary runes path
     */
    perkStyle: number;
    /**
     * Secondary runes path
     */
    perkSubStyle: number;
}
export interface IGameCustomizationObject {
    /**
     * Category identifier for Game Customization
     */
    category: string;
    /**
     * 	Game Customization content
     */
    content: string;
}
