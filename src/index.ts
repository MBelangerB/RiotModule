// Import data for export default and module.exports
import { RiotService } from './service/RiotService';
import { DragonService } from './service/DragonService';
import { CacheService } from './service/CacheService';
import { ValidationService } from './service/ValidationService';
import { RiotGameType, DragonCulture, DragonFileType } from './declaration/enum';
import { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';

// Export Declaraions pour import via { }
export { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';
export { RiotGameType, DragonCulture, DragonFileType } from './declaration/enum';

// Export DTO pour import via { }
export { IAccountDTO } from './entity/Account-v1/AccountDTO';
export { ISummonerDTO } from './entity/Summoner-v4/SummonerDTO';
export { IChampionInfo } from './entity/Champion-v3/ChampionInfo';
export { IChampionMasteryDTO } from './entity/ChampionMasteries-v4/ChampionMasteryDTO';
export { ILeagueEntryDTO } from './entity/League-v4/LeagueEntryDTO';

// Export RiotService for import with { }
// Ex. : import { DragonService } from './service/DragonService';
export { RiotService, AccountV1, SummonerV4, ChampionV3, ChampionMasteryV4, LeagueV4 } from './service/RiotService';
export { ValidationService } from './service/ValidationService';

// Export DragonService for import with { }
// Ex. : import { DragonService } from './service/DragonService';
export { DragonService } from './service/DragonService';
export { IDragonVersion, DragonVersion } from './model/DragonModel';

// Generic return pattern
export { ReturnData } from './declaration/interface/IReturnData';


// FORMAT CONST (OK) : exports.default = {
/*
    Accessible via BedyRiot dans import tel que
        import BedyRiot from 'bedyriot';
*/
export default {
    RiotService,
    DragonService,
    ValidationService,
    RiotGameType,
    DragonCulture,
    DragonFileType,
    RiotHttpStatusCode,
    CacheService,
} as const;


// FORMAT (OK): module.exports = {
module.exports = {
    RiotService: RiotService,
    DragonService: DragonService,
    ValidationService: ValidationService,
    RiotGameType: RiotGameType,
    RiotHttpStatusCode: RiotHttpStatusCode,
    DragonCulture: DragonCulture,
    DragonFileType: DragonFileType,
    CacheService: CacheService,
};