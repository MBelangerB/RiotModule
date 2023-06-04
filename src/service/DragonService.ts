import { join, resolve } from 'path';
import { FileService } from './FileService';
import { CacheService, CacheName, CacheTimer } from './CacheService';

import EnvVars from '../declaration/major/EnvVars';
import { DragonCulture, DragonFileType } from '../declaration/enum';
import { DragonChampion, DragonFile, DragonVersion, IDragonChampion, IDragonFile, IDragonVersion, VersionData } from '../model/DragonModel';
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
// Forbidden non-null assertion
export abstract class DragonService {

    // #region "Path Area"
    /**
     * Read « Require Main » for get the default app path
     * @returns
     */
    static getMainPath(): string {
        let returnPath = './';
        let mainPath: string =  resolve(returnPath);

        console.info('MainPath : %s', mainPath);
        return mainPath;
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
     */
    static prepareTree(): ReturnData<DragonVersion> {
        const returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();

        if (!FileService.checkFileExists(DragonPath.dragonFolder)) {
            returnData.addMessage(FileService.createFolder(DragonPath.dragonFolder));
        }

        let cultureFolder: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
        if (!FileService.checkFileExists(cultureFolder)) {
            returnData.addMessage(FileService.createFolder(cultureFolder));
        }

        cultureFolder = DragonService.getDragonFullPath(DragonCulture.en_us);
        if (!FileService.checkFileExists(cultureFolder)) {
            returnData.addMessage(FileService.createFolder(cultureFolder));
        }

        return returnData;
    }
    // #endregion

    // #region  "URL"
    /**
     * Get the file dragon file url for a specific version
     * @param file
     * @param dragonCulture
     * @param dataVersion
     * @returns
     */
    static getFileUrl(file: DragonFileType, dragonCulture: DragonCulture, dataVersion: IDragonVersion): string {
        let returnUrl = '';
        switch (file) {
            case DragonFileType.Champion:
                returnUrl = EnvVars.dragon.url.champions.replace('{version}', dataVersion.internalVersion!)
                    .replace('{lang}', dragonCulture);
                break;
        }

        return returnUrl;
    }
    // #endregion

    // #region  "Cache"
    /**
     * Get cache value if keyName exists
     * TODO: Unit test
     * @param keyName
     * @returns
     */
    static getKeyInCache<T>(keyName: string): ReturnData<T> { // Promise<ReturnData<T>> {
        const returnData: ReturnData<T> = new ReturnData<T>();

        if (EnvVars.cache.enabled) {
            const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
            if (cacheValue != undefined) {
                returnData.data = cacheValue;
            }
        }

        return returnData;

        // const getKeyPromise = new Promise<ReturnData<T>>((resolve: any) => {
        //     const returnData: ReturnData<T> = new ReturnData<T>();

        //     if (EnvVars.cache.enabled) {
        //         const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
        //         if (cacheValue != undefined) {
        //             returnData.data = cacheValue;
        //         }
        //     }

        //     resolve(returnData);
        // });

        // // Require getKeyInCache().then( {... } ) to have a result
        // // or await Promise.resolve(getKeyPromise);
        // // return Promise.resolve(getKeyPromise);
        // return Promise.resolve(getKeyPromise).then((result: ReturnData<T>) => {
        //     return result;
        // });
    }

    // #endregion

    // #region "Version"

    /**
     * Get the current version of the Dragon files
     * @returns
     * TODO: Check for remove « async » in Promise declaration [async (resolve: any, reject: any)]
     * 20230416 - Try Remove ASYNC and fix « pattern » ????
     */
    static async getDragonVersion(): Promise<ReturnData<DragonVersion>> {
        console.log('Enter in DragonService.getDragonVersion');

        let returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();

        const versionCacheKey = CacheName.DRAGON_VERSION;
        try {
            // Check if data is in cache
            returnData = DragonService.getKeyInCache<DragonVersion>(versionCacheKey);
            if (returnData && returnData.data) {
                return returnData;
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
            const invalidFile = false;

            // Read the version file
            // TODO: If error in reading we need force download
            tmpData.version = FileService.readInternalJSONFile(this.getDragonVersionPath());
            /* .then(fileContent => {
                tmpData.version = fileContent;
            }).catch(err => {
                if (err && err?.message == 'Unexpected end of JSON input') {
                    invalidFile = true;
                } else {
                    throw err;
                }
            });*/

            if (invalidFile) {
                // Should NEVER occur because we download the file before
                // But ...
                returnData.addMessage(DragonServiceLocalization.uninitialized);
                returnData.code = RiotHttpStatusCode.OK;

            } else if (typeof tmpData !== 'undefined' && tmpData.version.length > 0) {
                dragonData.internalVersion = tmpData.version[0];

                if (EnvVars.cache.enabled) {
                    CacheService.getInstance().setCache<DragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
                }
            }

        } catch (ex) {
            returnData.addMessage(DragonServiceLocalization.errInFunction('getDragonVersion'));
            returnData.code = RiotHttpStatusCode.INTERNAL_SERVER_ERROR;
        }

        return returnData;
    }

    /**
     * Call the URL for download/read the content
     * @param url Download external file
     * @returns
     */
    static async downloadExternalFileContent<T>(url: string): Promise<ReturnData<T>> {
        console.log('Enter in DragonService.downloadExternalFileContent');

        return new Promise<ReturnData<T>>((resolve: any, reject: any) => {
            const retData: ReturnData<T> = new ReturnData<T>();
            RequestService.downloadExternalFile<T>(url).then((fileContent: T) => {
                retData.data = fileContent;
                resolve(retData);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static async downloadAndWriteFile<T>(url: string, filePath: string): Promise<ReturnData<T>> {
        console.log('Enter in DragonService.downloadExternalFileContent');

        const retData: ReturnData<T> = new ReturnData<T>();
        retData.data = await RequestService.downloadAndWriteFile<T>(url, filePath);
        return retData;
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
    static async downloadDragonVersionFile(dataDragon: DragonVersion): Promise<ReturnData<DragonVersion>> { // Promise<ReturnData<DragonVersion>> {
        console.log('Enter in DragonService.downloadDragonVersionFile');

        // Create tree if doesn't exist
        let intData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        intData = DragonService.prepareTree();
        intData.data = dataDragon;

        // TODO: Gérer a nouveau le « CurrentVersion » pour ne pas toujours mettre à jour le fichier de Version a chaque call.
        const currentVersion: number = (intData.data!.internalVersion != null ? castToNumber(intData.data!.internalVersion!) : 0);
        const versionUrl = EnvVars.dragon.url.version;

        // Download file content
        let downloadResult: ReturnData<VersionData>;
        downloadResult = await DragonService.downloadAndWriteFile<VersionData>(versionUrl, this.getDragonVersionPath());
        if (downloadResult && downloadResult.code == 200 && downloadResult.data != null && Array.isArray(downloadResult.data)) {
            intData.data!.onlineVersion = downloadResult.data[0].toString();

            const newVersion: number = castToNumber(intData.data!.onlineVersion!);
            const currentVersion: number = (intData.data!.internalVersion != null ? castToNumber(intData.data!.internalVersion!) : 0);
            const requiredUpdate: boolean = (currentVersion < newVersion);
            intData.data!.requiredUpdate = requiredUpdate;
        }

        if (intData.data!.requiredUpdate) {
            //         // const processFile = new Promise<string>((resolve: any, reject: any) => {
            //         //     resolve(FileService.writeFile(this.getDragonVersionPath(), JSON.stringify(downloadResult.data)));
            //         if (!downloadStatut) {
            //             intData.addMessage(DragonServiceLocalization.errDownloadingFile);
            //         }
            //         // });
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
    static async downloadDragonFile<T>(url: string, dragonCulture: DragonCulture, dragonFileName: string, dragonVersion: DragonVersion): Promise<ReturnData<T>> {
        console.log('Enter in DragonService.downloadDragonFile');

        // We check the version
        let versionData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        versionData = DragonService.prepareTree();

        if (dragonVersion) {
            versionData.data = dragonVersion;
        } else {
            versionData = await DragonService.getDragonVersion();
        }

        const returnData: ReturnData<T> = new ReturnData<T>;

        // TODO: Just download and check if need update
        const downloadResult: ReturnData<T> = await DragonService.downloadAndWriteFile<T>(url, dragonFileName);
        if (downloadResult && downloadResult.code == 200 && downloadResult.data != null) {
            returnData.data = downloadResult.data;
            // intData.data!.onlineVersion = downloadResult.data[0].toString();

            // const newVersion: number = castToNumber(intData.data!.onlineVersion!);
            // const currentVersion: number = (intData.data!.internalVersion != null ? castToNumber(intData.data!.internalVersion!) : 0);
            // const requiredUpdate: boolean = (currentVersion < newVersion);
            // intData.data!.requiredUpdate = requiredUpdate;
        }

        // const downloadingFilePromise = new Promise<ReturnData<T>>(async (resolve: any, reject: any) => {
        //     const returnData: ReturnData<T> = new ReturnData<T>();

        //     // We download the file
        //     if (versionData.data?.requiredUpdate) {
        //         DragonService.downloadExternalDragonFile<T>(url).then((fileContentData: IDragonFile<T>) => {
        //             if (fileContentData && fileContentData.data != null) {
        //                 returnData.data = fileContentData.data;

        //                 const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);
        //                 // FileService.writeFile(fileName, JSON.stringify(fileContentData)).then(success => {
        //                 //     if (success) {
        //                 //         returnData.addMessage(success);
        //                 //     }
        //                 //     resolve(returnData);
        //                 // }).catch(err => {
        //                 //     throw err;
        //                 // })
        //             } else {
        //                 returnData.addMessage('Fail download external file content');
        //                 reject(returnData);
        //             }
        //         });
        //     }
        // });

        return returnData;

        // return Promise.resolve(downloadingFilePromise).then(ret => {
        //     return ret;
        // }).catch(err => {
        //     throw err;
        // });
    }

    /**
     * Reads the dragon file associated with the champions.
     * 20230416 : Remove Async in this func
     * @param culture
     * @returns
     */
    static async readDragonChampionFile(dragonCulture: DragonCulture): Promise<Map<number, IDragonChampion>> {
        // const readResult = new Promise<Map<number, IDragonChampion>>(async (resolve: any) => {
        let championData: Map<number, IDragonChampion> = new Map<number, IDragonChampion>();

        // Check if champions data is in cache
        const championsCache = CacheName.DRAGON_CHAMPIONS.replace('{0}', dragonCulture);
        if (EnvVars.cache.enabled) {
            const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);
            if (cacheValue != undefined) {
                championData = cacheValue;
                // resolve(championData);
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);
        // dragonChampion!
        let aDragonChampion: DragonFile<DragonChampion[]> = new DragonFile<DragonChampion[]>;
        const dragonChampionFileName = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.champion);

        if (!FileService.checkFileExists(this.getDragonFullPath()) || !FileService.checkFileExists(fileName)) {
            // Get current version for can get filename
            const versionData: ReturnData<IDragonVersion> = await DragonService.getDragonVersion();

            // Get champion Url
            const championUrl: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, versionData.data!);

            const downResult: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadDragonFile<DragonFile<DragonChampion[]>>(championUrl, dragonCulture, dragonChampionFileName, versionData.data!);
            if (downResult && downResult.data != null) {
                aDragonChampion = downResult.data;
            }
        }

        if (aDragonChampion == null || aDragonChampion.data == null) {
            aDragonChampion = FileService.readInternalJSONFile(dragonChampionFileName);
            /* .then((fileContent : DragonFile<DragonChampion[]>)=> {
                aDragonChampion = fileContent;
            }).catch((err : any)=> {
                if (err && err?.message == 'Unexpected end of JSON input') {
                    return;
                } else {
                    throw err;
                }
            });*/
        }


        if (aDragonChampion && aDragonChampion.type == 'champion') {
            for (const keyName in aDragonChampion.data) {
                const dragonChampionInfo: IDragonChampion = aDragonChampion.data[keyName];

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

        return championData;
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
