import { join, dirname } from 'path';
import { FileService } from './FileService';
import { CacheService, CacheName, CacheTimer } from './CacheService';

import EnvVars from '../declaration/major/EnvVars';
import { DragonCulture, DragonFile } from '../declaration/enum';
import { IDragonChampion, IDragonFile, IDragonVersion, IVersionData, VersionData } from '../model/DragonModel';
import { ReturnData } from '../declaration/interface/IReturnData';
import RiotHttpStatusCode from '../declaration/RiotHttpStatusCode';
import { RequestService } from './RequestService';
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


    /**
     * Get the file url
     * @param file 
     * @param dragonCulture 
     * @param dataVersion 
     * @returns 
     */
    static getFileUrl(file: DragonFile, dragonCulture: DragonCulture, dataVersion: IDragonVersion): string {
        let returnUrl: string = '';
        switch (file) {
            case DragonFile.Champion:
                returnUrl = EnvVars.dragon.url.champions.replace('{version}', dataVersion.internalVersion!)
                    .replace('{lang}', dragonCulture);
                break;
        }

        return returnUrl;
    }

    //#region  "Cache"
    static async getKeyInCache<T>(keyName: string): Promise<ReturnData<T>> {

        let getKeyPromise = new Promise<ReturnData<T>>(async (resolve: any, reject: any) => {
            let returnData: ReturnData<T> = new ReturnData<T>();

            if (EnvVars.cache.enabled) {
                const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
                if (cacheValue != undefined) {
                    returnData.data = cacheValue;
                }
            }
            resolve(returnData);
        });

        return await Promise.resolve(getKeyPromise);
    }

    //#endregion

    //#region "Version"

    /**
     * [OK] Get the current version of the Dragon files
     * @returns
     */
    static getDragonVersion(): Promise<ReturnData<IDragonVersion>> {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /* eslint-disable no-async-promise-executor */
        let versionPromise = new Promise<ReturnData<IDragonVersion>>(async (resolve: any, reject: any) => {
            let returnData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();

            const versionCacheKey = CacheName.DRAGON_VERSION;
            try {
                // Check if data is in cache
                returnData = await DragonService.getKeyInCache<IDragonVersion>(versionCacheKey);
                if (returnData && returnData.data) {
                    resolve(returnData);
                    return;
                }

                // No cache or no data, we prepare the data
                const dragonData: IDragonVersion = {
                    internalVersion: null
                };
                returnData.data = dragonData;

                // We check for download the newest version
                // We need to set current IDragonVersion for the update
                returnData = await DragonService.downloadDragonVersionFile(returnData.data!);

                // Prepare temp data
                let tmpData: VersionData = new VersionData();
                let invalidFile = false;

                // Read the version file
                // TODO: If error in reading we need force download
                await FileService.readInternalFile(this.getDragonVersionPath()).then(fileContent => {
                    tmpData.version = fileContent;
                }).catch(err => {
                    if (err && err?.message == 'Unexpected end of JSON input') {
                        invalidFile = true;
                    } else {
                        throw err;
                    }
                });

                if (invalidFile) {
                    // Should NEVER occur because we download the file before
                    // But ...
                    returnData.addMessage(DragonServiceLocalization.uninitialized);
                    returnData.code = RiotHttpStatusCode.OK;
                    resolve(returnData);
                    return;

                } else {
                    if (typeof tmpData !== 'undefined' && tmpData.version.length > 0) {
                        dragonData.internalVersion = tmpData.version[0];

                        if (EnvVars.cache.enabled) {
                            CacheService.getInstance().setCache<IDragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
                        }

                        resolve(returnData);
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

    /**
     * [OK] Download the dragon version file and update it if necessary 
     * @param dataDragon
     * @returns
     */
    static async downloadDragonVersionFile(dataDragon: IDragonVersion): Promise<ReturnData<IDragonVersion>> {
        let intData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();
        intData = await DragonService.prepareTree();
        intData.data = dataDragon;

        // Download file content
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
            const newVersion: number = castToNumber(intData.data.onlineVersion!);
            const currentVersion: number = (intData.data.internalVersion != null ? castToNumber(intData.data.internalVersion!) : 0);
            let requiredUpdate: boolean = (currentVersion < newVersion);
            intData.data.requiredUpdate = requiredUpdate;

            if (requiredUpdate) {
                intData.data.previousVersion = (intData.data.internalVersion ?? "0");

                // TODO: Gérer le cas ou WriteFile échoue
                const processFile = new Promise<string>((resolve: any, reject: any) => {
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

    //#endregion


    //#region "Champion"

    /**
     * Download a dragon file (not for version.json)
     * @param url
     * @param dragonCulture
     * @returns
    */
    static async downloadDragonFile<T>(url: string, dragonCulture: DragonCulture, dragonVersion: IDragonVersion): Promise<ReturnData<T>> {
        let returnData: ReturnData<T> = new ReturnData<T>();

        // We check the version
        let versionData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();
        versionData = await DragonService.prepareTree();
        if (dragonVersion) {
            versionData.data = dragonVersion;
        } else {
            versionData = await DragonService.getDragonVersion();
        }

        // We download the file
        if (versionData.data?.requiredUpdate) {
            const downloadDragonFile = new Promise<IDragonFile<T>>((resolve: any, reject: any) => {
                let retData: IDragonFile<T>;

                try {
                    RequestService.downloadExternalFile<IDragonFile<T>>(url).then((fileContent: IDragonFile<T>) => {
                        retData = fileContent;
                        resolve(retData);
                    }).catch(err => {
                        throw err;
                    });

                } catch (ex) {
                    reject(ex);
                }
            });

            // We download the contente Data
            let fileContentData: IDragonFile<T> = await Promise.resolve(downloadDragonFile);

            if (fileContentData && fileContentData.data != null) {
                let fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);

                const processFile = new Promise<string>((resolve: any, reject: any) => {
                    resolve(FileService.writeFile(fileName, JSON.stringify(fileContentData)));
                });

                const message: string = await Promise.resolve(processFile);
                if (message) {
                    returnData.data = fileContentData.data;
                    returnData.addMessage(message);
                }
            }
        }

        return returnData;
    }

    /**
     * Reads the dragon file associated with the champions.
     * @param culture
     * @returns
     */
    // Array<INumericChampionData>
    static async readDragonChampionFile(dragonCulture: DragonCulture): Promise<Map<number, IDragonChampion>> { // Promise<Array<INumericChampionData>> {
        // const readResult = new Promise<Array<INumericChampionData>>(async (resolve: any, reject: any) => {
        const readResult = new Promise<Map<number, IDragonChampion>>(async (resolve: any, reject: any) => {
            // const championData: Array<IDragonChampion> = new Array<IDragonChampion>;
            // const championData: Array<INumericChampionData> = new  Array<INumericChampionData>();
            let championData: Map<number, IDragonChampion> = new Map<number, IDragonChampion>();

            const championsCache = CacheName.DRAGON_CHAMPIONS.replace('{0}', dragonCulture);
            if (EnvVars.cache.enabled) {
                const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);
                if (cacheValue != undefined) {
                    championData = cacheValue;
                    resolve(championData);
                    return;
                }
            }


            let fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);
            if (!FileService.checkFileExists(this.getDragonFullPath()) || !FileService.checkFileExists(fileName)) {
                // Get current version for can get filename
                let versionData: ReturnData<IDragonVersion> = await DragonService.getDragonVersion();

                const championUrl: string = DragonService.getFileUrl(DragonFile.Champion, dragonCulture, versionData.data!);

                const downData: ReturnData<IDragonChampion> = await DragonService.downloadDragonFile<IDragonChampion>(championUrl, dragonCulture, versionData.data!);
                // console.log(downData);
            }
            // If cache isn't enabled we check if we can read it. If we can't we download it
            // const dragonChampion: any = await DragonService.readDragonFile(DragonFile.Champion, culture);


            let dragonChampion!: IDragonFile<IDragonChampion[]>;
            await FileService.readInternalFile(fileName).then(fileContent => {
                dragonChampion = fileContent;
            }).catch(err => {
                if (err && err?.message == 'Unexpected end of JSON input') {
                    // invalidFile = true;
                    return;
                } else {
                    throw err;
                }
            });

            if (dragonChampion && dragonChampion.type == 'champion') {
                for (const keyName in dragonChampion.data) {
                    const dragonChampionInfo: IDragonChampion = dragonChampion.data[keyName];

                    if (dragonChampionInfo) {
                        // Mandatory for clean extra values
                        const tmpChampion: IDragonChampion = {
                            id: dragonChampionInfo.id,
                            key: dragonChampionInfo.key,
                            name: dragonChampionInfo.name,
                            title: dragonChampionInfo.title,
                            image: dragonChampionInfo.image
                        };

                        championData.set(Number(dragonChampionInfo.key), tmpChampion);
                    }
                }

                if (EnvVars.cache.enabled) {
                    CacheService.getInstance().setCache<Map<number, IDragonChampion>>(championsCache, championData, CacheTimer.DRAGON_VERSION);
                }
            }
            // }

            resolve(championData);

            // NOte
            /*
               let scoresA = new Map<string, number>();
               scoresA.set("bill", 10);
              scoresA.get("bill")
            */

            /*
          interface AssociativeArray {
              [key: number]: string
           }

           const id : number = 5;
           var associative_array: AssociativeArray[] = []
           associative_array[id] = 'Tutorialspoint'

           console.log(associative_array[id]);
          */
        });

        return Promise.resolve(readResult);
    }


    //#endregion

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
