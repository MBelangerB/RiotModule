import { RiotService } from "./service/RiotService";
import { ValidationService } from "./service/ValidationService";
import { ISummonerDTO, SummonerDTO } from "./entity/Summoner-v4/SummonerDTO";
import { ILeagueEntryDTO } from "./entity/League-v4/LeagueEntryDTO";
import { RiotGameType } from './declaration/enum';
import { RegionData } from "./declaration/types";
import EnvVars from "./declaration/major/EnvVars";

// module.exports.default = {
//     RiotService, RiotGameType
// }

// export abstract class BedyApi {
//     ISummonerDTO: ISummonerDTO
// }

// module.exports.entity {
//     ISummonerDTO, ILeagueEntryDTO
// } 

// module.exports = {
//     RiotGameType,
//     // ISummonerDTO
//     //RiotService, RiotGameType
// }

// module.exports = {
//     ISummonerDTO, ILeagueEntryDTO
// }

// export * from './declaration/major/EnvVars';

export { ISummonerDTO } from "./entity/Summoner-v4/SummonerDTO";
export { RiotService } from "./service/RiotService";

// export { ValidationService } from "./service/ValidationService";

// OK ?
// export {
//     ILeagueEntryDTO
//     // RiotService, ISummonerDTO, ILeagueEntryDTO
// }

// FORMAT CONST (OK) : exports.default = {
export default {
    RiotService,
    ValidationService,
    RiotGameType,
    SummonerDTO
    // ISummonerDTO
} as const;

// // FORMAT (OK): module.exports = { 
module.exports = {
    // ISummonerDTO,
    RiotService: RiotService,
    // ValidationService,
    SummonerDTO: SummonerDTO
}

// // Format Export : OK ?
export {
    // RegionData,
    SummonerDTO, 
    // ISummonerDTO
}



// export const BedyApi = {
//     RiotService
// }

// export.default => service
// module.exports => service et class DTO