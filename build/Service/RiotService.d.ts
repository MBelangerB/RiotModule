import { ISummonerDTO } from "../Entity/Summoner-v4/SummonerDTO";
export declare const RiotServiceLocalization: {
    readonly unauth: "Unauthorized";
    readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
    readonly errParamsIsMissing: (params: string) => string;
    readonly errInFunction: (functionName: string) => string;
};
export declare class RiotService {
    /**
     * Return a @type {ISummonerDTO}
     * @param summonerName SummonerName
     * @param region Region
     * @returns
     * @throws Error params is invalid
     */
    static getRiotSummonerByName(summonerName: string, region: string): Promise<ISummonerDTO>;
}
declare const _default: {
    readonly RiotServiceLocalization: {
        readonly unauth: "Unauthorized";
        readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
        readonly errParamsIsMissing: (params: string) => string;
        readonly errInFunction: (functionName: string) => string;
    };
    readonly RiotService: typeof RiotService;
};
export default _default;
