/* eslint-disable max-len */
/* eslint-disable no-shadow */

export enum RiotGameType {
    LeagueOfLegend = 1,
    TeamFightTactic = 2,
    Valorant = 3,
    LegendOfRunterra = 4
}

export enum DragonCulture {
    fr_fr = 'fr_FR',
    en_us = 'en_US'
  }


export default {
    RiotGameType,
    DragonCulture,
} as const;