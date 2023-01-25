import EnvVars from "./Declaration/major/EnvVars";
import { RiotGameType } from './Declaration/enum';
import { RegionData } from './Declaration/types';
import { RiotService } from "./Service/RiotService";
import { ISummonerDTO, SummonerDTO } from "./Entity/Summoner-v4/SummonerDTO";
declare const _default: {
    ValidationService: {
        readonly ValidationLocalization: {
            readonly unauth: "Unauthorized";
            readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
            readonly errParamsIsMissing: (params: string) => string;
            readonly errInFunction: (functionName: string) => string;
            readonly errChampionNotExist: (list: string, championId: string) => string;
        };
        readonly ValidationService: typeof import("./Service/ValidationService").ValidationService;
    };
    RiotService: typeof RiotService;
};
export default _default;
export { EnvVars, RiotGameType, RegionData, SummonerDTO, ISummonerDTO };
