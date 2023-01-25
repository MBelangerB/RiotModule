export interface ITournamentDto {
    id: number;
    themeId: number;
    nameKey: string;
    nameKeySecondary: string;
    /**
     * 	Tournament phase
     */
    schedule: Array<ITournamentPhaseDto>;
}
export interface ITournamentPhaseDto {
    id: number;
    registrationTime: number;
    startTime: number;
    cancelled: boolean;
}
