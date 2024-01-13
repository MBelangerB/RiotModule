import { RiotGameType } from '../enum';
import { getBoolean } from '../functions';

import * as dotenv from 'dotenv';
dotenv.config();

export default {
    nodeEnv: (process.env.NODE_ENV ?? 'development'),
    riot: {
        leagueToken: (process.env.Riot_LolToken ?? ''),
        tftToken: (process.env.Riot_TftToken ?? ''),
        valoToken: (process.env.Riot_ValoToken ?? ''),
        apiToken: (process.env.Riot_APIDevKey ?? ''),
    },
    cache: {
        enabled: (getBoolean(process.env.CacheEnabled) ?? true),
    },
    dragon: {
        folder: (process.env.dragonBaseFolder ?? '/dragon'),
        endPoint: 'https://cdn.communitydragon.org/endpoints',
        url: {
            languages: 'https://ddragon.leagueoflegends.com/cdn/languages.json',
            version: 'https://ddragon.leagueoflegends.com/api/versions.json',
            queues: 'https://static.developer.riotgames.com/docs/lol/queues.json',
            champions: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/champion.json',
            profileIcons: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/profileicon.json',
            summonerSpells: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/summoner.json',
            runesReforged: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/runesReforged.json',
            championIcon: 'http://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{name}.png',
            realmInfo: 'https://ddragon.leagueoflegends.com/realms/{region}.json',
            championName: 'http://ddragon.leagueoflegends.com/cdn/{version}/data/{lang}/champion/{championName}.json',
        },
        imageUrl: {
            squareByChampionId: 'https://cdn.communitydragon.org/latest/champion/{championId}/square.png',
            loadingScreenByChampion: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/{championName}_{skinId}.jpg',
            splashArtByChampionId: 'https://cdn.communitydragon.org/latest/champion/{championId}/splash-art/centered.jpg',
            skinSplashArtByChampionId: 'https://cdn.communitydragon.org/latest/champion/{championId}/splash-art/centered/skin/{skinId}.jpg',
            tilesByChampionId: 'https://cdn.communitydragon.org/latest/champion/{championId}/tile.jpg',
            skinTilesByChampionId: 'https://cdn.communitydragon.org/latest/champion/{championId}/tile/skin/{skinId}.jpg',
        },
        rawUrl: {
            champion_tiles: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/{championId}/{skinId}.jpg',
        },
    },
    routes: {
        account: {
            v1: {
                getRiotIdByGameNameAndTagLine: 'https://{globalRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}',
                getByPuuid: 'https://{globalRegion}.api.riotgames.com/riot/account/v1/accounts/by-puuid/{puuid}',
            },
        },
        spectator: {
            v4: {
                getCurrentGameInfoBySummoner: 'https://{region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}',
            },
        },
        match: {
            v4: {
                getMatchListByChampionAndQueue: 'https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?champion={championId}&queue={queueId}&season={seasonId}',
                getMatchlist: 'https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?endIndex={end}&beginIndex={begin}',
            },
            v5: {
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
