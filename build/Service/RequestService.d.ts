import { ResponseType } from "axios";
import { RiotGameType } from "../Declaration/enum";
export declare const RequestLocalization: {
    readonly unauth: "Unauthorized";
    readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
    readonly errParamsIsMissing: (params: string) => string;
    readonly errInFunction: (functionName: string) => string;
};
export declare class RequestService {
    /**
      * Call Riot API to obtains information
      * @param requestUrl
      * @param tokenType
      * @param responseType
      * @returns
      */
    static callRiotAPI<T>(requestUrl: string, gameType: RiotGameType, responseType?: ResponseType): Promise<T>;
}
declare const _default: {
    readonly RequestLocalization: {
        readonly unauth: "Unauthorized";
        readonly errParamsIsInvalid: (paramsName: string, region: string) => string;
        readonly errParamsIsMissing: (params: string) => string;
        readonly errInFunction: (functionName: string) => string;
    };
    readonly RequestService: typeof RequestService;
};
export default _default;
