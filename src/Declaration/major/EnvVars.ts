import { RiotGameType } from '../enum';

// import dotenv from 'dotenv';
// dotenv.config();

export default {
    nodeEnv: (process.env.NODE_ENV ?? 'development'),
    riot: {
        leagueToken: (process.env.Riot_LolToken ?? ''),
        tftToken: (process.env.Riot_TftToken ?? ''),
        valoToken: (process.env.Riot_ValoToken ?? ''),
        apiToken: (process.env.Riot_APIDevKey ?? ''),
    },
    cache: {
        enabled: (process.env.CacheEnabled ?? true),
    },
    dragon: {
        folder: (process.env.dragonBaseFolder ?? '/dragon'),
        url: {
            version: 'https://ddragon.leagueoflegends.com/api/versions.json',
            queues: 'http://static.developer.riotgames.com/docs/lol/queues.json',
            champions: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/champion.json',
            profileIcons: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/profileicon.json',
            summonerSpells: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/summoner.json',
            runesReforged: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/runesReforged.json',
            championIcon: 'http://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{name}.png',
        },
    },
    routes: {
        v2: {
            liveGame: {
                getCurrentGameInfoBySummoner: 'https://{region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}',
            },
            matchHistory: {
                getMatchListByChampionAndQueue: 'https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?champion={championId}&queue={queueId}&season={seasonId}',
                getMatchlist: 'https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?endIndex={end}&beginIndex={begin}',
            },
        },
        league: {
            v4: {
                getLeagueEntriesForSummoner: 'https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}',
            },
        },
        championMastery: {
            v4: {
                getChampionMasteriesBySummoner: 'https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}',
                getChampionMasteriesBySummonerAndChampionId: 'https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}',
                getChampionMasteriesBySummonerAndCount: 'https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/top',
            },
        },
        champion: {
            v3: {
                championRotation: 'https://{region}.api.riotgames.com/lol/platform/v3/champion-rotations',
            },
        },
        summoner: {
            v4: {
                getBySummonerName: 'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}',
                getByPuuid: 'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}',
            },
        },
        tft_summoner: {
            v1: {
                getBySummonerName: 'https://{region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/{summonerName}',
                getByPuuid: 'https://{region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}',
            },
        },
        tft_league: {
            v1: {
                getTFTLeagueEntriesForSummoner: 'https://{region}.api.riotgames.com/tft/league/v1/entries/by-summoner/{encryptedSummonerId}',
            },
        },
    },

     /**
     * Check if token exists
     * @param gameMode
     * @returns
     */
      validateToken(gameMode : RiotGameType) {
        let apiKey = '';
        if (this.nodeEnv.toLocaleLowerCase() == 'development') {
            // In DEV check if API Dev key exists
            apiKey = this.riot.apiToken;
            return (apiKey.toString().trim().length > 0);
        } else {
            apiKey = this.getToken(gameMode);
            return (apiKey.toString().trim().length > 0);
        }
    },

    /**
     * Get Riot API Token
     * @param gameMode
     * @returns
     */
    getToken(gameMode : RiotGameType) {
        let token = '';
        switch (gameMode) {
            case RiotGameType.TeamFightTactic:
                if (this.nodeEnv.toLocaleLowerCase() == 'development') {
                    token = this.riot.tftToken || this.riot.apiToken;
                } else {
                    token = this.riot.tftToken;
                }
                break;
            case RiotGameType.LeagueOfLegend:
                if (this.nodeEnv.toLocaleLowerCase() == 'development') {
                    token = this.riot.leagueToken || this.riot.apiToken;
                } else {
                    token = this.riot.leagueToken;
                }
                break;
        }
        return token;
    },

} as const;
