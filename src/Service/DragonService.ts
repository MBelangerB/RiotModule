import { join, dirname } from 'path';
import { FileService } from './FileService';
import { CacheService, CacheName, CacheTimer } from './CacheService';

import EnvVars from '../declaration/major/EnvVars';
import { DragonCulture, DragonFile } from '../declaration/enum';
import { DragonChampion, DragonVersion, IDragonChampion, IDragonFile, IDragonVersion, VersionData } from '../model/DragonModel';
import { ReturnData } from '../declaration/interface/IReturnData';
import RiotHttpStatusCode from '../declaration/RiotHttpStatusCode';
import { RequestService } from './RequestService';
import { castToNumber } from '../declaration/functions';

/* eslint-disable @typescript-eslint/no-explicit-any */

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
// Forbidden non-null assertion
export abstract class DragonService {

    // #region "Path Area"
    /**
     * Read « Require Main » for get the default app path
     * TODO: Check result on debian
     * @returns 
     */
    static getMainPath(): string {
        let returnPath = './';

        if (require && require.main) {
            const isTest: boolean = require.main?.path.includes('mocha');

            if (isTest) {
                let paths: string[] = require.main.paths;
                for (let index = 0; index < paths.length; index++) {
                    const path = paths[index];
                    if (!path.includes('mocha')) {
                        returnPath = path;
                        index = paths.length;
                        break;
                    }
                    index++;
                }

                if (returnPath.includes('node_modules')) {
                    const testPath = dirname(returnPath);
                    if (!testPath.includes('node_modules')) {
                        returnPath = testPath;
                    } else {
                        const splitDirName = returnPath.split('node_modules');
                        if (splitDirName && splitDirName.length > 1) {
                            returnPath = dirname(splitDirName[0]);
                        }
                    }
                }

            } else {
                if (require.main && require.main.path) {
                    const appDir = dirname(require.main.path);
                    returnPath = dirname(appDir);

                } else if (require.main && require.main.filename) {
                    const appDir = dirname(require.main.filename);
                    returnPath = dirname(appDir);
                }
            }

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
    static getDragonFullPath(culture?: DragonCulture, fileName = ''): string {
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
     * Promise pattern OK (a 1ère vu)
     */
    static prepareTree(): Promise<ReturnData<DragonVersion>> {
        const treePromise = new Promise<ReturnData<DragonVersion>>((resolve: any) => {
            let arr = [];

            if (!FileService.checkFileExists(DragonPath.dragonFolder)) {
                arr.push(FileService.createFolder(DragonPath.dragonFolder));
            }

            let cultureFolder: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
            if (!FileService.checkFileExists(cultureFolder)) {
                arr.push(FileService.createFolder(cultureFolder));
            }

            cultureFolder = DragonService.getDragonFullPath(DragonCulture.en_us);
            if (!FileService.checkFileExists(cultureFolder)) {
                arr.push(FileService.createFolder(cultureFolder));
            }

            Promise.all(arr).then((results) => {
                const returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
                if (results && results.length > 0) {
                    results.forEach(msg => {
                        returnData.addMessage(msg);
                    })
                };
                resolve(returnData);
            });
        });

        return Promise.resolve(treePromise).then((result: ReturnData<DragonVersion>) => {
            return result;
        });
    }
    // #endregion

    //#region  "URL"
    /**
     * Get the file url
     * @param file
     * @param dragonCulture
     * @param dataVersion
     * @returns
     */
    static getFileUrl(file: DragonFile, dragonCulture: DragonCulture, dataVersion: IDragonVersion): string {
        let returnUrl = '';
        switch (file) {
            case DragonFile.Champion:
                returnUrl = EnvVars.dragon.url.champions.replace('{version}', dataVersion.internalVersion!)
                    .replace('{lang}', dragonCulture);
                break;
        }

        return returnUrl;
    }
    //#endregion

    // #region  "Cache"
    /**
     * Get cache value if keyName exists
     * @param keyName 
     * @returns 
     */
    static getKeyInCache<T>(keyName: string): Promise<ReturnData<T>> {
        const getKeyPromise = new Promise<ReturnData<T>>((resolve: any) => {
            const returnData: ReturnData<T> = new ReturnData<T>();

            if (EnvVars.cache.enabled) {
                const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
                if (cacheValue != undefined) {
                    returnData.data = cacheValue;
                }
            }

            resolve(returnData);
        });

        // Require getKeyInCache().then( {... } ) to have a result
        // or await Promise.resolve(getKeyPromise);
        // return Promise.resolve(getKeyPromise);
        return Promise.resolve(getKeyPromise).then((result: ReturnData<T>) => {
            return result;
        });
    }

    // #endregion

    // #region "Version"

    /**
     * Get the current version of the Dragon files
     * @returns
     * TODO: Check for remove « async » in Promise declaration [async (resolve: any, reject: any)]
     */
    static getDragonVersion(): Promise<ReturnData<DragonVersion>> {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /* eslint-disable no-async-promise-executor */
        console.log('Enter in DragonService.getDragonVersion');

        const versionPromise = new Promise<ReturnData<DragonVersion>>(async (resolve: any, reject: any) => {
            let returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();

            const versionCacheKey = CacheName.DRAGON_VERSION;
            try {
                // Check if data is in cache
                returnData = await DragonService.getKeyInCache<DragonVersion>(versionCacheKey);
                if (returnData && returnData.data) {
                    resolve(returnData);
                    return;
                }

                // No cache or no data, we prepare the data
                const dragonData: DragonVersion = {
                    internalVersion: null,
                };
                returnData.data = dragonData;

                // We check for download the newest version
                // We need to set current IDragonVersion for the update
                returnData = await DragonService.downloadDragonVersionFile(returnData.data!);

                // Prepare temp data
                const tmpData: VersionData = new VersionData();
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

                } else if (typeof tmpData !== 'undefined' && tmpData.version.length > 0) {
                    dragonData.internalVersion = tmpData.version[0];

                    if (EnvVars.cache.enabled) {
                        CacheService.getInstance().setCache<DragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
                    }

                    resolve(returnData);
                    return;
                }

            } catch (ex) {
                returnData.addMessage(DragonServiceLocalization.errInFunction('getDragonVersion'));
                returnData.code = RiotHttpStatusCode.INTERNAL_SERVER_ERROR;

                reject(returnData);
                return;
            }
        });

        return Promise.resolve(versionPromise).then((data: ReturnData<DragonVersion>) => {
            return data;
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Call the URL for download/read the content
     * @param url Download external file
     * @returns 
     */
    static downloadExternalFileContent<T>(url: string): Promise<ReturnData<T>> {
        console.log('Enter in DragonService.downloadExternalFileContent');

        const downloadVersionFile = new Promise<ReturnData<T>>((resolve: any, reject: any) => {
            const retData: ReturnData<T> = new ReturnData<T>();
            RequestService.downloadExternalFile<T>(url).then((fileContent: T) => {
                retData.data = fileContent;
                resolve(retData);
            }).catch(err => {
                reject(err);
            });
        });

        return Promise.resolve(downloadVersionFile).then(ret => {
            return ret;
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Call the Dragon URL for download/read the content.
     * @param url 
     * @returns 
     */
    static downloadExternalDragonFile<T>(url: string): Promise<IDragonFile<T>> {
        console.log('Enter in DragonService.downloadExternalDragonFile');

        const downloadVersionFile = new Promise<IDragonFile<T>>((resolve: any, reject: any) => {
            RequestService.downloadExternalFile<IDragonFile<T>>(url).then((fileContent: IDragonFile<T>) => {
                resolve(fileContent);
            }).catch(err => {
                reject(err);
            });
        });

        return Promise.resolve(downloadVersionFile).then(ret => {
            return ret;
        }).catch(err => {
            throw err;
        });
    }

    /**
    * [OK] Download the dragon version file and update it if necessary
    * @param dataDragon
    * @returns
    */
    static async downloadDragonVersionFile(dataDragon: DragonVersion): Promise<ReturnData<DragonVersion>> {
        console.log('Enter in DragonService.downloadDragonVersionFile');

        let intData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        intData = await DragonService.prepareTree();
        intData.data = dataDragon;

        // Download file content
        const versionUrl = EnvVars.dragon.url.version;
        const downloadData: ReturnData<VersionData> = await DragonService.downloadExternalFileContent<VersionData>(versionUrl);

        if (downloadData && downloadData.data && downloadData.data && Array.isArray(downloadData.data)) {
            intData.data.onlineVersion = downloadData.data[0];

            // Check version
            const newVersion: number = castToNumber(intData.data.onlineVersion!);
            const currentVersion: number = (intData.data.internalVersion != null ? castToNumber(intData.data.internalVersion!) : 0);
            const requiredUpdate: boolean = (currentVersion < newVersion);
            intData.data.requiredUpdate = requiredUpdate;

            if (requiredUpdate) {
                intData.data.previousVersion = (intData.data.internalVersion ?? '0');

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

    // #endregion


    // #region "Champion"
    static async getChampionInfo(championId: number, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        const dragonData: Map<number, IDragonChampion> = await DragonService.readDragonChampionFile(dragonCulture);
        if (dragonData.has(championId)) {
            championInfo = dragonData.get(championId)!;
        }

        return championInfo;
    }

    /**
     * Download a dragon file (not for version.json)
     * @param url
     * @param dragonCulture
     * @returns
    */
    static downloadDragonFile<T>(url: string, dragonCulture: DragonCulture, dragonVersion: DragonVersion): Promise<ReturnData<T>> {
        console.log('Enter in DragonService.downloadDragonFile');

        // We check the version
        let versionData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        // versionData = await DragonService.prepareTree();
        if (dragonVersion) {
            versionData.data = dragonVersion;
        } else {
            // versionData = await DragonService.getDragonVersion();
            DragonService.getDragonVersion().then(version => {
                versionData = version;
            })
        }

        const downloadingFilePromise = new Promise<ReturnData<T>>(async (resolve: any, reject: any) => {
            const returnData: ReturnData<T> = new ReturnData<T>();

            // We download the file
            if (versionData.data?.requiredUpdate) {
                DragonService.downloadExternalDragonFile<T>(url).then((fileContentData: IDragonFile<T>) => {
                    if (fileContentData && fileContentData.data != null) {
                        returnData.data = fileContentData.data;

                        const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);
                        FileService.writeFile(fileName, JSON.stringify(fileContentData)).then(success => {
                            if (success) {
                                returnData.addMessage(success);
                            }
                            resolve(returnData);
                        }).catch(err => {
                            throw err;
                        })
                    } else {
                        returnData.addMessage('Fail download external file content');
                        reject(returnData)
                    }
                });
            }
        });

        return Promise.resolve(downloadingFilePromise).then(ret => {
            return ret;
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Reads the dragon file associated with the champions.
     * @param culture
     * @returns
     */
    static async readDragonChampionFile(dragonCulture: DragonCulture): Promise<Map<number, IDragonChampion>> {
        const readResult = new Promise<Map<number, IDragonChampion>>((resolve: any) => {
            let championData: Map<number, IDragonChampion> = new Map<number, IDragonChampion>();

            // Check if champions data is in cache
            const championsCache = CacheName.DRAGON_CHAMPIONS.replace('{0}', dragonCulture);
            if (EnvVars.cache.enabled) {
                const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);
                if (cacheValue != undefined) {
                    championData = cacheValue;
                    resolve(championData);
                    return;
                }
            }

            // If cache isn't enabled we check if we can read it. If we can't we download it
            const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);
            if (!FileService.checkFileExists(this.getDragonFullPath()) || !FileService.checkFileExists(fileName)) {
                // Get current version for can get filename
                // const versionData: ReturnData<IDragonVersion> = await DragonService.getDragonVersion();
                let versionData: ReturnData<IDragonVersion> = new ReturnData<IDragonVersion>();
                DragonService.getDragonVersion().then((version: ReturnData<IDragonVersion>) => {
                    versionData = version;
                });

                const championUrl: string = DragonService.getFileUrl(DragonFile.Champion, dragonCulture, versionData.data!);

                // const downData: ReturnData<IDragonChampion> =
                // const downResult =
                DragonService.downloadDragonFile<IDragonChampion>(championUrl, dragonCulture, versionData.data!)?.then((content: ReturnData<IDragonChampion>) => {
                    console.log('Download success')
                });     
            }

            let dragonChampion!: IDragonFile<IDragonChampion[]>;
            FileService.readInternalFile(fileName).then(fileContent => {
                dragonChampion = fileContent;
            }).catch(err => {
                if (err && err?.message == 'Unexpected end of JSON input') {
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
                            image: dragonChampionInfo.image,
                        };

                        championData.set(Number(dragonChampionInfo.key), tmpChampion);
                    }
                }

                if (EnvVars.cache.enabled) {
                    CacheService.getInstance().setCache<Map<number, IDragonChampion>>(championsCache, championData, CacheTimer.DRAGON_VERSION);
                }
            }

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


    // #endregion

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


// **** Export default **** //

export default {
    DragonServiceLocalization,
    DragonService,
} as const;
