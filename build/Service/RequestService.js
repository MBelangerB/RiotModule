"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = exports.RequestLocalization = void 0;
const axios_1 = __importDefault(require("axios"));
const EnvVars_1 = __importDefault(require("../Declaration/major/EnvVars"));
const RiotHttpStatusCode_1 = __importDefault(require("../Declaration/RiotHttpStatusCode"));
exports.RequestLocalization = {
    unauth: 'Unauthorized',
    errParamsIsInvalid: (paramsName, region) => `The parameters '${paramsName}' with value '${region}' is invalid.`,
    errParamsIsMissing: (params) => `The parameter '${params}' is mandatory.`,
    errInFunction: (functionName) => `An error occured in 'RequestService.${functionName}'.`,
};
class RequestService {
    /**
      * Call Riot API to obtains information
      * @param requestUrl
      * @param tokenType
      * @param responseType
      * @returns
      */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async callRiotAPI(requestUrl, gameType, responseType = 'json') {
        const token = EnvVars_1.default.getToken(gameType);
        const axiosQuery = new Promise(function (resolve, reject) {
            try {
                console.info(`Call Riot API with '${requestUrl}'`);
                (0, axios_1.default)(encodeURI(requestUrl), {
                    method: 'GET',
                    responseType: responseType,
                    headers: { 'X-Riot-Token': token },
                    responseEncoding: 'utf8',
                    transformResponse: [function (data) {
                            try {
                                if (data) {
                                    // Do whatever you want to transform the data
                                    return JSON.parse(data);
                                }
                            }
                            catch (ex) {
                                return data;
                            }
                        }],
                }).then(response => {
                    switch (response.status) {
                        case RiotHttpStatusCode_1.default.OK:
                            resolve(response.data);
                            break;
                        default:
                            reject(response);
                    }
                }).catch(error => {
                    reject(error);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
        return Promise.resolve(axiosQuery);
    }
}
exports.RequestService = RequestService;
// **** Export default **** //
exports.default = {
    RequestLocalization: exports.RequestLocalization,
    RequestService,
};
