/* eslint-disable max-len */
/* eslint-disable no-shadow */

export enum RiotGameType {
    LeagueOfLegend = 1,
    TeamFightTactic = 2,
    Valorant = 3,
    LegendOfRunterra = 4
}

export enum DragonCulture {
    /**
     * French (France)
     */
    fr_fr = 'fr_FR',
    /**
     * English (United States)
     */
    en_us = 'en_US',
    /**
     * Korean (Korea)
     */
    ko_kr = 'ko_KR',
    /**
     *  	English (United Kingdom)
     */
    en_gb = 'en_GB'
}

export enum DragonFile {
    Champion,
}


export default {
    RiotGameType,
    DragonCulture,
    DragonFile,
} as const;