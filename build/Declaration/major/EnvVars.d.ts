import { RiotGameType } from '../enum';
declare const _default: {
    readonly nodeEnv: string;
    readonly riot: {
        readonly leagueToken: string;
        readonly tftToken: string;
        readonly valoToken: string;
        readonly apiToken: string;
    };
    readonly routes: {
        readonly v2: {
            readonly liveGame: {
                readonly getCurrentGameInfoBySummoner: "https://{region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}";
            };
            readonly matchHistory: {
                readonly getMatchListByChampionAndQueue: "https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?champion={championId}&queue={queueId}&season={seasonId}";
                readonly getMatchlist: "https://{region}.api.riotgames.com/lol/match/v4/matchlists/by-account/{encryptedAccountId}?endIndex={end}&beginIndex={begin}";
            };
        };
        readonly league: {
            readonly v4: {
                readonly getLeagueEntriesForSummoner: "https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}";
            };
        };
        readonly championMastery: {
            readonly v4: {
                readonly getChampionMasteriesBySummoner: "https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}";
                readonly getChampionMasteriesBySummonerAndChampionId: "https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}";
            };
        };
        readonly champion: {
            readonly v3: {
                readonly championRotation: "https://{region}.api.riotgames.com/lol/platform/v3/champion-rotations";
            };
        };
        readonly summoner: {
            readonly v4: {
                readonly getBySummonerName: "https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}";
                readonly getByPuuid: "https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}";
            };
        };
        readonly tft_summoner: {
            readonly v1: {
                readonly getBySummonerName: "https://{region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/{summonerName}";
                readonly getByPuuid: "https://{region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}";
            };
        };
        readonly tft_league: {
            readonly v1: {
                readonly getTFTLeagueEntriesForSummoner: "https://{region}.api.riotgames.com/tft/league/v1/entries/by-summoner/{encryptedSummonerId}";
            };
        };
    };
    /**
     * Check if token exists
     * @param gameMode
     * @returns
     */
    readonly validateToken: (gameMode: RiotGameType) => boolean;
    /**
     * Get Riot API Token
     * @param gameMode
     * @returns
     */
    readonly getToken: (gameMode: RiotGameType) => string;
};
export default _default;
