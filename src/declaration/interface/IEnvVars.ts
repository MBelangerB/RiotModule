import { RiotGameType } from '../../riotmodule.js';

interface IEnvVars {
    nodeEnv: string;

    readonly riot: IRiotTokens;

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

    readonly routes: Routes;

    validateToken(gameMode : RiotGameType) : boolean;
    getToken(gameMode : RiotGameType) : string;
};


  interface IRiotTokens {
    leagueToken: string;
    tftToken: string;
    valoToken: string;
    apiToken: string;
  }

  // Niveau finale, URL
  export type ModuleRoute = string;

  // Version : objet avec plusieurs routes
  export type ModuleVersion = {
    [routeName: string]: ModuleRoute;
  };

  // Module : objet avec plusieurs versions
  export type Module = {
    [version: string]: ModuleVersion;
  };

  // Routes globales : objet avec plusieurs modules
  export type Routes = {
    [moduleName: string]: Module;
  };


export type { IRiotTokens, IEnvVars };