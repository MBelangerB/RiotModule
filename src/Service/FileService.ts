import { readFileSync, mkdirSync, existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { castDataToJSON } from '../declaration/functions';


// **** Variables **** //


// Localization
export const FileServiceLocalization = {
    errInFunction: (functionName: string) => `An error occured in 'FileService.${functionName}'.`,
    msgFolderBeenCreated: (folderName: string) => `The folder '${folderName}' has been created.`,
    msgFileCreatedOrUpdate: (fileName: string) => `The file '${fileName}' has been created or updated.`,
} as const;


/**
 * File process
 */
export abstract class FileService {

    /**
     * Check if a file or directory exists
     * @param filePath
     * @returns
     */
    static checkFileExists(filePath: string): boolean {
        return existsSync(filePath);
    }

    /**
     * Create folder recursively
     * @param folderPath
     * @returns
     */
    static async createFolder(folderPath: string): Promise<string> {
        const folder = new Promise<string>((resolve, reject) => {
            try {
                if (!existsSync(folderPath)) {
                    // File not Exists
                    mkdirSync(folderPath, { recursive: true });

                    console.info(FileServiceLocalization.msgFolderBeenCreated(folderPath));
                    resolve(FileServiceLocalization.msgFolderBeenCreated(folderPath));
                }

            } catch (ex) {
                console.error(FileServiceLocalization.errInFunction('createFolder'));
                console.error(ex);
                reject(ex);
            }
        });

        return Promise.resolve(folder);
    }

    /**
     * Create a file and write it
     * @param filePath
     * @param fileContent
     * @returns
     */
    static async writeFile(filePath: string, fileContent: string): Promise<string> {
        const file = new Promise<string>(async (resolve, reject) => {
            try {
                let fileWrite;
                if (typeof (fileContent) !== 'string') {
                    fileWrite = writeFile(filePath, castDataToJSON(fileContent), { flag: 'w' });
                } else {
                    fileWrite = writeFile(filePath, fileContent, { encoding: 'utf8', flag: 'w' });
                }

                await Promise.resolve(fileWrite).then(success => {
                    console.info(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                    resolve(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                }).catch(err => {
                    throw err;
                });

            } catch (ex) {
                console.error(FileServiceLocalization.errInFunction('writeFile'));
                console.error(ex);
                reject(ex);
            }
        });

        return Promise.resolve(file);
    }

    // https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
    /**
     * Read a file content and return JSON Object
     * @param filePath
     * @param fileEncoding
     * @param flag
     * @returns
     */
    static async readInternalFile(filePath: string, fileEncoding: BufferEncoding = 'utf8', flag = 'r') {
        const rawdata = readFileSync(filePath, { encoding: fileEncoding, flag: flag });
        const data = JSON.parse(rawdata);
        return data;
    }

    // /**
    //  * Request a URL for read the file content
    //  * @param requestUrl
    //  * @param responseType
    //  * @returns
    //  */
    // /* eslint-disable @typescript-eslint/no-explicit-any */
    // static async downloadExternalFile(requestUrl: string, responseType: ResponseType = 'json'): Promise<any> {
    //     const downloadResult = new Promise<any>(function (resolve, reject) {
    //         try {
    //             console.info(`Downloading the '${requestUrl}' file`);
    //             axios(encodeURI(requestUrl),
    //                 {
    //                     method: 'GET',
    //                     responseType: responseType,
    //                     responseEncoding: 'utf8', // default
    //                     transformResponse: [function (data) {
    //                         try {
    //                             if (data) {
    //                                 // Do whatever you want to transform the data
    //                                 return JSON.parse(data);
    //                             }
    //                         } catch (ex) {
    //                             return data;
    //                         }
    //                     }],
    //                 }).then(response => {
    //                     switch (response.status) {
    //                         case RiotHttpStatusCode.OK:
    //                             resolve(response.data);
    //                             break;
    //                         default:
    //                             reject(response);
    //                     }
    //                 }).catch(error => {
    //                     reject(error);
    //                 });
    //             } catch (ex) {
    //                 reject(ex);
    //             }
    //     });

    //     return Promise.resolve(downloadResult);
    // }

}

export default {
    FileServiceLocalization,
    FileService,
} as const;
