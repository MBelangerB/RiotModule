// Import data for export on default and module.exports
import { RiotService } from './service/RiotService.js';
import { DragonService } from './service/DragonService.js';
import { CacheService } from './service/CacheService.js';
import { ValidationService } from './service/ValidationService.js';
import { RiotGameType, DragonCulture, DragonFileType } from './declaration/enum.js';
// import { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';
import { RiotHttpStatusCode } from '@bedy90/riotentity';
// import { Rotation, ChampionMasteries } from './model/index.js';

// Export Declaraions pour import via { }
// export { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';
export { RiotGameType, DragonCulture, DragonFileType } from './declaration/enum.js';
export type { RegionData, ChampionOption } from './declaration/types.js';

// Export RiotService for import with { }
// Ex. : import { DragonService } from './service/DragonService';
export { RiotService, AccountV1, SummonerV4, ChampionV3, ChampionMasteryV4, LeagueV4 } from './service/RiotService.js';
export { ValidationService } from './service/ValidationService.js';
// export { Rotation, ChampionMasteries } from './model/index.js';

// Export DragonService for import with { }
// Ex. : import { DragonService } from './service/DragonService';
export { DragonService } from './service/DragonService.js';
export type { IDragonVersion, DragonVersion, IDragonChampion, IDragonFile, IChampDataImage, IVersionData } from './model/DragonModel.js';

// Generic return pattern
export { ReturnData } from './declaration/interface/IReturnData.js';

// 2025
export * from './model/index.js'
// 2025 END


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
// module.exports = {
//     RiotService: RiotService,
//     DragonService: DragonService,
//     ValidationService: ValidationService,
//     RiotGameType: RiotGameType,
//     RiotHttpStatusCode: RiotHttpStatusCode,
//     DragonCulture: DragonCulture,
//     DragonFileType: DragonFileType,
//     CacheService: CacheService,
// };