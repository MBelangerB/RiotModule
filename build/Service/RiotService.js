"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiotService = exports.RiotServiceLocalization = void 0;
const axios_1 = require("axios");
const enum_1 = require("../Declaration/enum");
const EnvVars_1 = __importDefault(require("../Declaration/major/EnvVars"));
const RequestService_1 = require("./RequestService");
const ValidationService_1 = require("./ValidationService");
exports.RiotServiceLocalization = {
    unauth: 'Unauthorized',
    errParamsIsInvalid: (paramsName, region) => `The parameters '${paramsName}' with value '${region}' is invalid.`,
    errParamsIsMissing: (params) => `The parameter '${params}' is mandatory.`,
    errInFunction: (functionName) => `An error occured in 'RequestService.${functionName}'.`,
};
class RiotService {
    /**
     * Return a @type {ISummonerDTO}
     * @param summonerName SummonerName
     * @param region Region
     * @returns
     * @throws Error params is invalid
     */
    static async getRiotSummonerByName(summonerName, region) {
        const realRegion = ValidationService_1.ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars_1.default.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);
        let returnValue;
        // TODO: Cache for Riot Info
        await RequestService_1.RequestService.callRiotAPI(summonerUrl, enum_1.RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getRiotSummonerByName'));
            if (err instanceof axios_1.AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });
        return returnValue;
    }
}
exports.RiotService = RiotService;
// **** Export default **** //
exports.default = {
    RiotServiceLocalization: exports.RiotServiceLocalization,
    RiotService,
};
