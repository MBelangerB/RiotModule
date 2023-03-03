import { RiotService } from './service/RiotService';
import { DragonService } from './service/DragonService';
import { ValidationService } from './service/ValidationService';
import { RiotGameType } from './declaration/enum';
import { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';

// Export Declaraions pour import via { }
export { RiotHttpStatusCode } from './declaration/RiotHttpStatusCode';
export { RiotGameType } from './declaration/enum';

// Export DTO pour import via { }
export { ISummonerDTO } from './entity/Summoner-v4/SummonerDTO';
export { IChampionInfo } from './entity/Champion-v3/ChampionInfo';
export { IChampionMasteryDTO } from './entity/ChampionMasteries-v4/ChampionMasteryDTO';
export { ILeagueEntryDTO } from './entity/League-v4/LeagueEntryDTO';

// Export Service pour import via { }
export { RiotService, ChampionV3, ChampionMasteryV4, LeagueV4, SummonerV4 } from './service/RiotService';
export { ValidationService } from './service/ValidationService';

export { DragonService } from './service/DragonService';
export { IDragonVersion } from './model/DragonModel';
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
    RiotHttpStatusCode,
} as const;


// FORMAT (OK): module.exports = {
module.exports = {
    RiotService: RiotService,
    DragonService: DragonService,
    ValidationService: ValidationService,
    RiotGameType: RiotGameType,
    RiotHttpStatusCode: RiotHttpStatusCode,
};