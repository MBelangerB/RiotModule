import axios, { ResponseType } from 'axios';
import { RiotGameType } from '../declaration/enum';
import EnvVars from '../declaration/major/EnvVars';
import RiotHttpStatusCode from '../declaration/RiotHttpStatusCode';
import { FileService } from './FileService';

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
    static async callRiotAPI<T>(requestUrl: string, gameType: RiotGameType, responseType: ResponseType = 'json'): Promise<T> {
        const token = EnvVars.getToken(gameType);

        const axiosQuery = new Promise<T>(function (resolve, reject) {
            console.info(`Call Riot API with '${requestUrl}'`);

            axios(encodeURI(requestUrl), {
                method: 'GET',
                responseType: responseType,
                headers: { 'X-Riot-Token': token },
                responseEncoding: 'utf8',
                transformResponse: [function (data) {
                    try {
                        /* istanbul ignore else */
                        if (data) {
                            // Do whatever you want to transform the data
                            return JSON.parse(data);
                        }
                    } catch (ex) {
                        return data; // Never supposed to happen with API Riot.
                    }
                }],
            }).then(response => {
                switch (response.status) {
                    case RiotHttpStatusCode.OK:
                        resolve(response.data);
                        break;

                    /* istanbul ignore next */
                    default:
                        // En théorie, n'est jamais supposé ce produire, si le status est <> 200 c'est le catch qui effectue le traitement
                        reject(response);
                }
            }).catch(error => {
                reject(error);
            });
        });

        return Promise.resolve(axiosQuery);
    }

    /**
     * Request a URL for read the file content
     * @param requestUrl
     * @param responseType
     * @returns
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    static async downloadExternalFile<T>(requestUrl: string, responseType: ResponseType = 'json'): Promise<T> {
        console.info(`Downloading the '${requestUrl}' file.`);

        const axiosQuery = new Promise<T>(function (resolve, reject) {
            axios(encodeURI(requestUrl), {
                method: 'GET',
                responseType: responseType,
                responseEncoding: 'utf8',
                transformResponse: [function (data) {
                    try {
                        /* istanbul ignore else */
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

                    /* istanbul ignore next */
                    default:
                        // En théorie, n'est jamais supposé ce produire, si le status est <> 200 c'est le catch qui effectue le traitement
                        reject(response);
                }
            }).catch(error => {
                reject(error);
            });
        });

        return Promise.resolve(axiosQuery);
    }

    /**
     * Download and write the file content on drive
     * @param requestUrl
     * @param filePath
     * @param responseType
     * @returns
     */
    static async downloadAndWriteFile<T>(requestUrl: string, filePath: string, responseType: ResponseType = 'json'): Promise<T> {
        console.info(`Downloading the '${requestUrl}' file and writing in '${filePath}'.`);
        // ---------------
        const axiosQuery = new Promise<T>(function (resolve, reject) {
            axios(encodeURI(requestUrl), {
                method: 'GET',
                responseType: responseType,
                responseEncoding: 'utf8',
                transformResponse: [function (data) {
                    try {
                        /* istanbul ignore else */
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
                        FileService.writeFile(filePath, JSON.stringify(response.data));
                        resolve(response.data);
                        break;

                    /* istanbul ignore next */
                    default:
                        // En théorie, n'est jamais supposé ce produire, si le status est <> 200 c'est le catch qui effectue le traitement
                        reject(response);
                }
            }).catch(error => {
                reject(error);
            });
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
