import { RegionData } from "../Declaration/types";
export declare const ValidationLocalization: {
    readonly unauth: "Unauthorized";
    readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
    readonly errParamsIsMissing: (params: string) => string;
    readonly errInFunction: (functionName: string) => string;
    readonly errChampionNotExist: (list: string, championId: string) => string;
};
export declare class ValidationService {
    static autorizedRegion: string[];
    static regionDataMapping: RegionData;
    /**
     * Convert region parameters to riot region
     * @param region
     * @returns
     */
    static convertToRealRegion(region: string): string;
}
declare const _default: {
    readonly ValidationLocalization: {
        readonly unauth: "Unauthorized";
        readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
        readonly errParamsIsMissing: (params: string) => string;
        readonly errInFunction: (functionName: string) => string;
        readonly errChampionNotExist: (list: string, championId: string) => string;
    };
    readonly ValidationService: typeof ValidationService;
};
export default _default;
