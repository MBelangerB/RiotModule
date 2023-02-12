import axios, { ResponseType } from 'axios';
import { RiotGameType } from '../declaration/enum';
import EnvVars from '../declaration/major/EnvVars';
import RiotHttpStatusCode from '../declaration/RiotHttpStatusCode';

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
    static async callRiotAPI<T>(requestUrl: string, gameType: RiotGameType, responseType: ResponseType = 'json'): Promise<T> {
        const token = EnvVars.getToken(gameType);

        const axiosQuery = new Promise<T>(function (resolve, reject) {
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
                        } catch (ex) {
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
            } catch (ex) {
                reject(ex);
            }
        });

        return Promise.resolve(axiosQuery);
    }

    /**
     * Request a URL for read the file content
     * @param requestUrl
     * @param responseType
     * @returns
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async downloadExternalFile<T>(requestUrl: string, responseType: ResponseType = 'json'): Promise<T> {
        const downloadResult = new Promise<T>(function (resolve, reject) {
            try {
                console.info(`Downloading the '${requestUrl}' file`);
                axios(encodeURI(requestUrl),
                    {
                        method: 'GET',
                        responseType: responseType,
                        responseEncoding: 'utf8',
                        transformResponse: [function (data) {
                            try {
                                if (data) {
                                    // Do whatever you want to transform the data
                                    return JSON.parse(data);
                                }
                            } catch (ex) {
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
            } catch (ex) {
                reject(ex);
            }
        });

        return await Promise.resolve(downloadResult);
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    RequestLocalization,
    RequestService,
} as const;
