import { AccountService_V1 } from './Riot/AccountService.js';
import { ChampionService_V3 } from './Riot/ChampionService.js';
import { ChampionMasteryService_V4 } from './Riot/ChampionMasteryService.js';
import { SummonerService_V4 } from './Riot/SummonerService.js';
import { LeagueService_V4 } from './Riot/LeagueService.js';

// **** Variables **** //
// TEst : Htetkokolij

// Errors
export const RiotServiceLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName: string, subService?: string) => `An error occured in 'RiotService.${subService}.${functionName}'.`,
} as const;

export interface IRiotService {
    AccountV1: AccountService_V1;
    SummonerV4: SummonerService_V4;
    ChampionMasteryV4: ChampionMasteryService_V4;
    ChampionV3: ChampionService_V3;
    LeagueV4: LeagueService_V4;
}

// https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type#:~:text=The%20%22Property%20does%20not%20exist,type%20with%20variable%20key%20names.&text=Copied!

// **** Class  **** //
export class RiotService implements IRiotService {
    AccountV1: AccountService_V1 = new AccountService_V1;
    SummonerV4: SummonerService_V4 = new SummonerService_V4;
    ChampionMasteryV4: ChampionMasteryService_V4 = new ChampionMasteryService_V4;
    ChampionV3: ChampionService_V3 = new ChampionService_V3;
    LeagueV4: LeagueService_V4 = new LeagueService_V4;
}
// TODO: Replace AWAIT RequestService.callRiotAPI by Promise < resolve, reject >

// **** Functions **** //

// **** Export default **** //

export default {
    RiotServiceLocalization,
    // RiotService,
} as const;
