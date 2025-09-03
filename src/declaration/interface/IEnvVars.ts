import { RiotGameType } from '../../riotmodule.js';

interface IEnvVars {
    nodeEnv: string;

    readonly riot: {
        leagueToken: string;
        tftToken: string;
        valoToken: string;
        apiToken: string;
    };

    cache: {
        enabled: boolean;
    };

    readonly dragon: {
        folder: string;
        endPoint: string;
        url: {
            languages: string;
            version: string;
            queues: string;
            champions: string;
            profileIcons: string;
            summonerSpells: string;
            runesReforged: string;
            championIcon: string;
            realmInfo: string;
            championName: string;
        };
        imageUrl: {
            squareByChampionId: string;
            loadingScreenByChampion: string;
            splashArtByChampionId: string;
            skinSplashArtByChampionId: string;
            tilesByChampionId: string;
            skinTilesByChampionId: string;
        };
        rawUrl: {
            champion_tiles: string;
        };
    };

    readonly routes: Route;

    validateToken(gameMode : RiotGameType) : boolean;
    getToken(gameMode : RiotGameType) : string;
};

type ModuleVersion = {
    [version: string]: {
      [key: string]: string;
    };
  };

  type Route = {
    [module: string]: ModuleVersion;
  };

  type GameToken = {
    [gameName: string]: string;
  };


export type { IEnvVars, ModuleVersion, Route };