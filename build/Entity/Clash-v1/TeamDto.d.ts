import { IPlayerDto } from "./PlayerDto";
export interface ITeamDto {
    id: string;
    tournamentId: number;
    name: string;
    iconId: number;
    tier: number;
    /**
     * Summoner ID of the team captain.
     */
    captain: string;
    abbreviation: string;
    /**
     * 	Team members.
     */
    players: Array<IPlayerDto>;
}
