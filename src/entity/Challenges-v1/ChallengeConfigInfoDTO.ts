/* eslint-disable max-len */
/* eslint-disable no-shadow */

export interface IChallengeConfigInfoDTO {
    id: number;
    localizedNames: Map<string, Map<string, string>>;
    /**
     * - DISABLED - not visible and not calculated, HIDDEN - not visible, but calculated, ENABLED - visible and calculated, ARCHIVED - visible, but not calculated
     */
    state: State;
    /**
     * LIFETIME - stats are incremented without reset, SEASON - stats are accumulated by season and reset at the beginning of new season
     */
    tracking: Tracking;
    startTimestamp: number;
    endTimestamp: number;
    leaderboard: boolean;
    thresholds: Map<string, number>;
}

export enum State {
    /**
     * DISABLED - not visible and not calculated
     */
    DISABLED = 0,
    /**
     *  HIDDEN - not visible, but calculated,
     */
    HIDDEN = 1,
    /**
     * ENABLED - visible and calculated,
     */
    ENABLED = 2,
    /**
     * ARCHIVED - visible, but not calculated
     */
    ARCHIVED = 3
}

export enum Tracking {
    /**
     * LIFETIME - stats are incremented without reset
     */
    LIFETIME = 0,
    /**
     * SEASON - stats are accumulated by season and reset at the beginning of new season
     */
    SEASON = 1
}
