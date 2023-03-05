import { readFileSync, mkdirSync, existsSync } from 'fs';
import { removeSync } from 'fs-extra';
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
     * Delete a file or folder
     * @param filePath 
     * @returns 
     */
    static removeFile(filePath: string): void {
        return removeSync(filePath);
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
        const writingFile = new Promise<string>(async (resolve, reject) => {
            try {
                let fileWrite;
                if (typeof (fileContent) !== 'string') {
                    fileWrite = writeFile(filePath, castDataToJSON(fileContent), { flag: 'w' });
                } else {
                    fileWrite = writeFile(filePath, fileContent, { encoding: 'utf8', flag: 'w' });
                }

                fileWrite.then(res => {
                    console.info(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                    resolve(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                }).catch(err => {
                    throw err;
                });

                // await Promise.resolve(fileWrite).then( () => {
                //     console.info(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                //     resolve(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));
                // }).catch(err => {
                //     throw err;
                // });

            } catch (ex) {
                console.error(FileServiceLocalization.errInFunction('writeFile'));
                console.error(ex);
                reject(ex);
            }
        });

        return Promise.resolve(writingFile).then(ret => {
            return ret;
        }).catch(err => {
            throw err;
        });

        // return Promise.resolve(writingFile);
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
}

export default {
    FileServiceLocalization,
    FileService,
} as const;
