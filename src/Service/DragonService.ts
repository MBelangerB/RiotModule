// import path, { basename } from 'path';
import { resolve, join, basename, dirname } from 'path';
import { FileService } from './FileService';
import { CacheService, CacheName, CacheTimer } from './CacheService';

// import infoData from '../static/info.json';
// import dragonModel, { IDragonData } from '../models/dragon/dragon-model';
// import { DragonCulture } from '../declarations/enum';
// import { ReturnData } from '../models/IReturnData';
// import HttpStatusCodes from '../declarations/major/HttpStatusCodes';
// import { IChampion } from '../models/dragon/IChampion';
import EnvVars from '../declaration/major/EnvVars';
import { DragonCulture, DragonFile } from '../declaration/enum';
import { IChampionData, IDragonFile, IDragonVersion, IVersionData } from '../model/DragonModel';
import { ReturnData } from '../declaration/interface/IReturnData';
import RiotHttpStatusCode from '../declaration/RiotHttpStatusCode';
import { RequestService } from './RequestService';
import test from 'node:test';
import { castToNumber } from '../declaration/functions';

// **** Variables **** //

// Errors
export const DragonServiceLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName: string) => `An error occured in 'DragonService.${functionName}'.`,
    uninitialized: 'The \'Dragon\' files have not been initialized. Please initialize it first.',
    errDownloadingFile: 'An error occurred while downloading the file.',
    msgFileAlreadyUpdated: 'The files are already up to date.',
    msgFileHaveBeenUpdated: 'The files have been updated.',
} as const;

/**
 * Dragon Service Class
 */
export abstract class DragonService {

    //#region "Path Area"
    static getMainPath(): string {
        let returnPath: string = './';

        if (require.main && require.main.path) {
            const appDir = dirname(require.main.path);
            returnPath = dirname(appDir)

        } else if (require.main && require.main.filename) {
            const appDir = dirname(require.main.filename);
            returnPath = dirname(appDir)

        } else {
            const splitDirName = __dirname.split('node_modules');
            if (splitDirName && splitDirName.length > 1) {
                returnPath = dirname(splitDirName[0]);
            }

        }

        console.info('MainPath : %s', returnPath);
        return returnPath;
    }

    /**
     * Return the dragon file path folder with culture
     * @param {string} culture Culture @default DragonCulture.fr_fr
     * @param fileName file to open
     * @returns File path
     */
    static getDragonFullPath(culture?: DragonCulture, fileName: string = ''): string {
        if (!culture) {
            return DragonPath.dragonFolder;

        } else if (!fileName || fileName.length == 0) {
            return join(DragonPath.dragonFolder, culture);
        } else {
            return DragonPath.dragonCulturePath(culture, fileName);
        }
    }

    /**
     * Return the dragon version file location
     * @returns {string}
     */
    private static getDragonVersionPath(): string {
        return DragonPath.dragonFilePath(DragonFileName.version);
    }

    /**
     * Prepare the directory tree for the dragon files
     */
    static async prepareTree(): Promise<ReturnData<IDragonVersion>> {
        let treePromise = new Promise<ReturnData<IDragonVersion>>(async (resolve: any) => {
            let returnData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();

            if (!FileService.checkFileExists(DragonPath.dragonFolder)) {
                returnData.addMessage(await FileService.createFolder(DragonPath.dragonFolder));
            }

            let cultureFolder: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
            if (!FileService.checkFileExists(cultureFolder)) {
                returnData.addMessage(await FileService.createFolder(cultureFolder));
            }

            cultureFolder = DragonService.getDragonFullPath(DragonCulture.en_us);
            if (!FileService.checkFileExists(cultureFolder)) {
                returnData.addMessage(await FileService.createFolder(cultureFolder));
            }

            resolve(returnData)
        });

        return await Promise.resolve(treePromise);
    }
    //#endregion

    static readDragonFile() {
        // Check if cache enabled, if TRUE look if key exists
        // Else read the internal file
        // if file doesn't exist, download it ???
    }

    /**
     * Get the current version of the Dragon files
     * @returns
     */
    static getDragonVersion(): Promise<ReturnData<IDragonVersion>> {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /* eslint-disable no-async-promise-executor */
        let versionPromise = new Promise<ReturnData<IDragonVersion>>(async (resolve: any, reject: any) => {
            let returnData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();

            const versionCacheKey = CacheName.DRAGON_VERSION;
            try {
                // TODO
                if (EnvVars.cache.enabled) {
                    const cacheValue: IDragonVersion | undefined = CacheService.getInstance().getCache<IDragonVersion>(versionCacheKey);
                    if (cacheValue != undefined) {
                        returnData.data = cacheValue;
                        resolve(returnData);
                        return;
                    }
                }

                // No cache or no data
                const dragonData: IDragonVersion = {
                    internalVersion: null
                };
                returnData.data = dragonData;

                // Check if Dragon file and dragon version exists
                // await ?
                if (!FileService.checkFileExists(this.getDragonFullPath()) ||
                    !FileService.checkFileExists(this.getDragonVersionPath())) {
                    // TODO: Change for APIStatusOK or return global HttpStatusCode
                    returnData.addMessage(DragonServiceLocalization.uninitialized);
                    returnData.code = RiotHttpStatusCode.OK;
                    resolve(returnData);
                    return;
                }

                // Prepare temp data
                let tmpData!: any[];
                let invalidFile = false;

                // Read the version file
                await FileService.readInternalFile(this.getDragonVersionPath()).then(fileContent => {
                    tmpData = fileContent;
                }).catch(err => {
                    if (err && err?.message == 'Unexpected end of JSON input') {
                        invalidFile = true;
                        return;
                    } else {
                        throw err;
                    }
                });

                if (invalidFile) {
                    // TODO: Change for APIStatusOK or return global HttpStatusCode
                    returnData.addMessage(DragonServiceLocalization.uninitialized);
                    returnData.code = RiotHttpStatusCode.OK;
                    resolve(returnData);
                    return;

                } else {
                    // const data: IDragonVersion = {
                    //     internalVersion: null
                    // };

                    if (typeof tmpData !== 'undefined' && tmpData.length > 0) {
                        dragonData.internalVersion = tmpData[0];

                        if (EnvVars.cache.enabled) {
                            CacheService.getInstance().setCache<IDragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
                        }

                        // returnData.data = dragonData;
                        resolve(dragonData);
                        return;
                    }
                }

            } catch (ex) {
                returnData.addMessage(DragonServiceLocalization.errInFunction("getDragonVersion"));
                returnData.code = RiotHttpStatusCode.INTERNAL_SERVER_ERROR;

                reject(returnData);
                return;
            }
        });

        return Promise.resolve(versionPromise);
    }

    // /**
    //  * Reads the specified dragon file.
    //  * @param filename
    //  * @param culture
    //  * @returns
    //  */
    // static async readDragonFile(filename: string, culture: DragonCulture): Promise<any> {
    //     return new Promise(async (resolve: any, reject: any) => {
    //         let fileData: any = null;
    //         try {
    //             await services.FileService.readInternalFile(this.getDragonFullPath(culture, filename)).then(fileContent => {
    //                 if (typeof (fileContent) !== 'string') {
    //                     fileData = fileContent;
    //                 } else {
    //                     fileData = JSON.parse(fileContent);
    //                 }
    //             }).catch(err => {
    //                 if (err && err?.message == 'Unexpected end of JSON input') {
    //                     return;
    //                 } else {
    //                     throw err;
    //                 }

    //             });
    //         } catch (ex: any) {
    //             if (!ex?.message.includes('ENOENT: no such file or directory')) {
    //                 console.error(localization.errReadDragonFile);
    //                 console.error(ex);
    //             }

    //             reject(fileData);
    //             return;
    //         }

    //         resolve(fileData);
    //     });
    // }

    // /**
    //  * Reads the dragon file associated with the champions.
    //  * @param culture
    //  * @returns
    //  */
    // static async readDragonChampionFile(culture: DragonCulture): Promise<IChampion[]> {
    //     const readResult = new Promise<IChampion[]>(async (resolve: any, reject: any) => {
    //         const championData: Array<IChampion> = new Array<IChampion>;

    //         //   let scoresA = new Map<string, number>();
    //         //   scoresA.set("bill", 10);
    //         //   scoresA.get("bill")

    //         //   interface AssociativeArray {
    //         //     [key: number]: string
    //         //  }

    //         //  const id : number = 5;
    //         //  var associative_array: AssociativeArray[] = []
    //         //  associative_array[id] = 'Tutorialspoint'

    //         //  console.log(associative_array[id]);

    //         try {
    //             const dragonChampion: any = await DragonService.readDragonFile(dragonFileName.champion, culture);
    //             if (dragonChampion.type == 'champion') {
    //                 for (const keyName in dragonChampion.data) {
    //                     const dragonChampionInfo = dragonChampion.data[keyName];
    //                     if (dragonChampionInfo) {
    //                         const champion: IChampion = {
    //                             id: dragonChampionInfo.key,
    //                             name: dragonChampionInfo.name,
    //                         };
    //                         championData.push(champion);
    //                     }
    //                 }
    //             }
    //         } catch (ex) {
    //             reject(ex);
    //         }

    //         resolve(championData);
    //     });

    //     return Promise.resolve(readResult);
    // }


    static getFileUrl(file: DragonFile, dragonCulture: DragonCulture, dataVersion: IDragonVersion) : string {
        let returnUrl: string = '';
        switch (file) {
            case DragonFile.Champion:
                returnUrl = EnvVars.dragon.url.champions.replace('{version}', dataVersion.onlineVersion!)
                                                                                .replace('{lang}', dragonCulture);
                break;
        }

        return returnUrl;
    }

    /**
     * Download a dragon file (not for version.json)
     * @param url
     * @param dragonCulture
     * @returns
     */
    static async downloadDragonFile(url: string, dragonCulture: DragonCulture, data: IDragonVersion) {
        // const downloadFile = new Promise((resolve: any, reject: any) => {
        //     services.FileService.downloadExternalFile(url).then(fileContent => {
        //         resolve(fileContent);
        //     }).catch(err => {
        //         reject(err);
        //     });
        // });
        // const fileContent: any = await Promise.resolve(downloadFile);


        const promiseFileContent = new Promise<IDragonFile<IChampionData>>((resolve: any, reject: any) => {
            let retData: IDragonFile<IChampionData>;

            try {
                RequestService.downloadExternalFile<IDragonFile<IChampionData>>(url).then((fileContent: IDragonFile<IChampionData>) => {
                    retData = fileContent;
                    resolve(retData);
                }).catch(err => {
                    throw err;
                });

            } catch (ex) {
                reject(ex);
            }
        });
        let fileContent: IDragonFile<IChampionData> = await Promise.resolve(promiseFileContent);
        console.log(fileContent);

        // if (fileContent) {
        //     const filename = basename(url);
        //     const filePath: string = DragonService.getDragonFullPath(dragonCulture, filename);

        //     const processFile = new Promise<string>((resolve: any, reject: any) => {
        //         try {
        //             resolve(services.FileService.writeFile(filePath, fileContent));
        //         } catch (ex) {
        //             reject(ex);
        //         }
        //     });

        //     const message: any = await Promise.resolve(processFile);
        //     if (message) {
        //         data.addMessage(message);
        //     }
        // } else {
        //     throw new Error(localization.errDownloadingFile);
        // }

        return null;
    }

    /**
     * Download the dragon version file and update it if necessary
     * @param dataDragon
     * @param previousVersion
     * @returns
     */
    static async downloadDragonVersionFile(dataDragon: IDragonVersion) : Promise<ReturnData<IDragonVersion>> {
        // let requiredUpdate = false;
        // let newVersion: number = dataDragon.internalVersion;
        let intData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();
        intData = await DragonService.prepareTree();
        intData.data = dataDragon;

        const downloadVersionFile = new Promise<ReturnData<IVersionData>>((resolve: any, reject: any) => {
            let retData: ReturnData<IVersionData> = new ReturnData<IVersionData>();

            try {
                const versionUrl = EnvVars.dragon.url.version;

                RequestService.downloadExternalFile<IVersionData>(versionUrl).then((fileContent: IVersionData) => {
                    retData.data = fileContent;
                    resolve(retData);
                }).catch(err => {
                    throw err;
                });

            } catch (ex) {
                reject(ex);
            }
        });
        let downloadData: ReturnData<IVersionData> = await Promise.resolve(downloadVersionFile);

        if (downloadData && downloadData.data && downloadData.data && Array.isArray(downloadData.data)) {
            intData.data.onlineVersion = downloadData.data[0];

            // Check version
            const newVersion : number = castToNumber(intData.data.onlineVersion!);
            const currentVersion: number = (intData.data.internalVersion != null ? castToNumber(intData.data.internalVersion!) : 0);
            let requiredUpdate: boolean = (currentVersion < newVersion);

            if (requiredUpdate) {
                intData.data.previousVersion = (intData.data.internalVersion ?? "0");

                // TODO: Gérer le cas ou WriteFile échoue
                const processFile = new Promise<boolean>((resolve: any, reject: any) => {
                    resolve(FileService.writeFile(this.getDragonVersionPath(), JSON.stringify(downloadData.data)));
                });

                const message: any = await Promise.resolve(processFile);
                if (message) {
                    intData.addMessage(message);
                }
            }
        }
     

        return intData;  
    }
}


// Dragon file path
export const DragonPath = {
    basePath: DragonService.getMainPath(),
    dragonFolder: join(DragonService.getMainPath(), EnvVars.dragon.folder),
    dragonFilePath: (filename: string) => join(DragonPath.dragonFolder, filename),
    dragonCulturePath: (culture: string, fileName: string) => join(DragonPath.dragonFolder, culture, fileName),
} as const;

export const DragonFileName = {
    champion: 'champion.json',
    version: 'version.json',
};


// **** Functions **** //

// /**
//  * [ROUTE] Call to update dragons files. Does nothing if the files are already up to date.
//  * TODO: Vérifier les fichiers en fonction de la culture. Si on passe une autre culture on reçoit « deja a jour »
//  */
// async function updateDragon(forceUpdate = false, dragonCulture: DragonCulture): Promise<ReturnData<IDragonData>> {
//     // Read current version files for get version
//     const returnData: ReturnData<IDragonData> = new ReturnData<IDragonData>();
//     const dataDragon: IDragonData = await DragonService.getDragonVersion(returnData);
//     returnData.clear();
//     dataDragon.previousVersion = (dataDragon.currentVersion || '0');

//     // Create tree if doesn't exists
//     await DragonService.prepareTree(dragonCulture, returnData);

//     // Read new version file to validate if update is required
//     let needUpdate = false;
//     await DragonService.downloadDragonVersionFile(dataDragon, returnData, dragonModel.castToNumber(dataDragon.previousVersion)).then(requiredUpdate => {
//         needUpdate = requiredUpdate;

//     }).catch(err => {
//         // TODO: Check err value ?
//         console.error(err);

//         returnData.code = HttpStatusCodes.INTERNAL_SERVER_ERROR;
//         returnData.addMessage(localization.errDownloadingFile);
//     });

//     // If we dont have update, we check if file exists

//     if (!needUpdate && !forceUpdate) {
//         await DragonService.readDragonFile(dragonFileName.champion, dragonCulture).then(content => {
//             if (content && content.version) {
//                 const newVersion: number = dragonModel.castToNumber(content.version);
//                 const currentVersion: number = dragonModel.castToNumber(dataDragon.currentVersion as string);
//                 needUpdate = (newVersion < currentVersion);
//             } else {
//                 needUpdate = true;
//             }
//         }).catch((err) => {
//             // Do nothing
//             if (!err) {
//                 needUpdate = true;
//             }
//         });
//     }

//     // Si changement de langue, il faudrait un moyen de keep info pour télécharger
//     if (needUpdate || forceUpdate) {
//         const dragonChampionUrl = infoData.dragon.champions.replace('{version}', dataDragon.currentVersion as string).replace('{lang}', dragonCulture);
//         const dragonProfileIconsUrl = infoData.dragon.profileIcons.replace('{version}', dataDragon.currentVersion as string).replace('{lang}', dragonCulture);

//         await DragonService.downloadDragonFile(dragonChampionUrl, dragonCulture, returnData).then(state => {
//             return state;
//         }).catch(err => {
//             // TODO: Check err value ?
//             if (err.response) {
//                 console.error(err.response);
//             } else if (err.stack) {
//                 console.error(err.stack);
//             } else {
//                 console.error(err);
//             }


//             returnData.code = HttpStatusCodes.INTERNAL_SERVER_ERROR;
//             returnData.addMessage(localization.errDownloadingFile);
//         });

//         await DragonService.downloadDragonFile(dragonProfileIconsUrl, dragonCulture, returnData).then(state => {
//             return state;
//         }).catch(err => {
//             // TODO: Check err value ?
//             if (err.response) {
//                 console.error(err.response);
//             } else if (err.stack) {
//                 console.error(err.stack);
//             } else {
//                 console.error(err);
//             }

//             returnData.code = HttpStatusCodes.INTERNAL_SERVER_ERROR;
//             returnData.addMessage(localization.errDownloadingFile);
//         });

//     } else {
//         returnData.code = 200;
//         returnData.addMessage(localization.msgFileAlreadyUpdated);
//     }

//     return returnData;
// }


// **** Export default **** //

export default {
    DragonServiceLocalization,
    DragonService,
} as const;
