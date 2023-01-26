import axios, { ResponseType } from 'axios';
import { RiotGameType } from '../Declaration/enum';
import EnvVars from "../Declaration/major/EnVars";
import RiotHttpStatusCode from "../Declaration/RiotHttpStatusCode";

// **** Variables **** //

// Errors
export const RequestLocalization = {
    unauth: 'Unauthorized',
} as const;

// **** Class  **** //
export abstract class RequestService {
  /**
      * Call Riot API to obtains information
      * @param requestUrl
      * @param tokenType
      * @param responseType
      * @returns
      */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async callRiotAPI(requestUrl: string, gameType: RiotGameType, responseType : ResponseType = 'json') {
        const token = EnvVars.getToken(gameType);
        
        const axiosQuery = new Promise(function (resolve, reject) {
            try {
                console.info(`Call Riot API with '${requestUrl}'`);
                axios(encodeURI(requestUrl), {
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
                        case RiotHttpStatusCode.OK:
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

// **** Functions **** //

// **** Export default **** //

export default {
    RequestLocalization,
    RequestService,
} as const;
