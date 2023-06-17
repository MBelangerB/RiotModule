import { join, resolve } from 'path';
import { FileService } from './FileService';
import { CacheService, CacheName, CacheTimer } from './CacheService';

import EnvVars from '../declaration/major/EnvVars';
import { DragonCulture, DragonFileType } from '../declaration/enum';
import { DragonChampion, DragonFile, DragonVersion, IDragonChampion, IDragonVersion, VersionData } from '../model/DragonModel';
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
        const returnPath = './';
        const mainPath: string = resolve(returnPath);

        // console.info('MainPath : %s', mainPath);
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
    static getKeyInCache<T>(keyName: string): ReturnData<T> {
        const returnData: ReturnData<T> = new ReturnData<T>();

        if (EnvVars.cache.enabled) {
            const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
            if (cacheValue != undefined) {
                returnData.data = cacheValue;
            }
        }

        return returnData;
    }

    // #endregion

    // #region "Version"

    /**
     * Get the current version of the Dragon files
     * @returns
     */
    static async getDragonVersion(): Promise<ReturnData<DragonVersion>> {
        // console.log('Enter in DragonService.getDragonVersion');

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

            // Prepare and read temp data
            const tmpData: VersionData = new VersionData();

            if (FileService.checkFileExists(this.getDragonVersionPath())) {
                // If version file already exists we read the file
                tmpData.version = FileService.readInternalJSONFile(this.getDragonVersionPath());
                if (typeof tmpData !== 'undefined' && tmpData.version.length > 0) {
                    returnData.data.internalVersion = tmpData.version[0];
                }
            }

            // We check for download the newest version
            // We need to set current IDragonVersion for the update
            returnData = await DragonService.downloadDragonVersionFile(returnData.data!);

            // Read file
            tmpData.version = FileService.readInternalJSONFile(this.getDragonVersionPath());

            if (typeof tmpData !== 'undefined' && tmpData.version.length > 0) {
                dragonData.internalVersion = tmpData.version[0];

                if (EnvVars.cache.enabled) {
                    CacheService.getInstance().setCache<DragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
                }
            } else {
                // Should NEVER occur because we download the file before
                // But ...
                returnData.addMessage(DragonServiceLocalization.uninitialized);
                returnData.code = RiotHttpStatusCode.OK;
            }

        } catch (ex) {
            returnData.addMessage(DragonServiceLocalization.errInFunction('getDragonVersion'));
            returnData.code = RiotHttpStatusCode.INTERNAL_SERVER_ERROR;
        }

        return returnData;
    }

    /**
     * Call the URL for download/read the content
     * TODO: Test
     * @param url Download external file
     * @returns
     */
    static async downloadExternalFileContent<T>(url: string): Promise<ReturnData<T>> {
        // console.log('Enter in DragonService.downloadExternalFileContent');

        const retData: ReturnData<T> = new ReturnData<T>();
        retData.data = await RequestService.downloadExternalFile<T>(url);
        return retData;
    }

    /**
     * Call the URL for download/read the file content and write it.
     * @param url
     * @param filePath
     * @returns
     * TODO: Move to another service (RequestService) ?
     */
    static async downloadAndWriteFile<T>(url: string, filePath: string): Promise<ReturnData<T>> {
        // console.log('Enter in DragonService.downloadAndWriteFile');

        const retData: ReturnData<T> = new ReturnData<T>();
        retData.data = await RequestService.downloadAndWriteFile<T>(url, filePath);
        return retData;
    }

    /**
     * Call the Dragon URL for download/read the content.
     * TODO: test
     * @param url
     * @returns
     */
    static async downloadExternalDragonFile<T>(url: string): Promise<DragonFile<T>> {
        // console.log('Enter in DragonService.downloadExternalDragonFile');

        let retData: DragonFile<T> = new DragonFile<T>();
        retData = await RequestService.downloadExternalFile<DragonFile<T>>(url);

        return retData;
    }

    /**
    * [OK] Download the dragon version file and update it if necessary
    * @param dataDragon
    * @returns
    * TODO: Est-ce bien de retourner le DragonVersion (qui pourrait être le param dataDragon)
    *       ou est-ce que ça serait mieux de retourne « downloadResult » pour éviter de faire une lecture après
    */
    static async downloadDragonVersionFile(dataDragon: DragonVersion): Promise<ReturnData<DragonVersion>> {
        // console.log('Enter in DragonService.downloadDragonVersionFile');

        // Create tree if doesn't exist
        let intData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        intData = DragonService.prepareTree();
        intData.data = dataDragon;

        // TODO: Gérer a nouveau le « CurrentVersion » pour ne pas toujours mettre à jour le fichier de Version a chaque call.
        const currentVersion: number = (intData.data!.internalVersion != null ? castToNumber(intData.data!.internalVersion!) : 0);
        const versionUrl = EnvVars.dragon.url.version;

        // Download file content
        const downloadResult: ReturnData<VersionData> = await DragonService.downloadExternalFileContent<VersionData>(versionUrl);
        if (downloadResult && downloadResult.code == 200 && downloadResult.data != null && Array.isArray(downloadResult.data)) {
            intData.data!.onlineVersion = downloadResult.data[0].toString();

            const newVersion: number = castToNumber(intData.data!.onlineVersion!);
            const requiredUpdate: boolean = (currentVersion < newVersion);
            intData.data!.requiredUpdate = requiredUpdate;
        }

        if (intData.data!.requiredUpdate) {
            if (!FileService.writeFile(this.getDragonVersionPath(), JSON.stringify(downloadResult.data))) {
                intData.addMessage(DragonServiceLocalization.errDownloadingFile);
            }
        }

        return intData;
    }

    // #endregion

    // #region "Champion"

    /**
     * Get DragonChampion info by championId
     * @param championId
     * @param dragonCulture
     * @returns
     */
    static async getChampionInfoById(championId: number, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        // console.log('Enter in DragonService.getChampionInfoById');

        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        const dragonData: Map<number, IDragonChampion> = await DragonService.readDragonChampionFileById(dragonCulture);
        if (dragonData.has(championId)) {
            championInfo = dragonData.get(championId)!;
        }

        return championInfo;
    }

    /**
     * Get DragonChampion info by championName
     * @param championName
     * @param dragonCulture
     * @returns
     */
    static async getChampionInfoByName(championName: string, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        // console.log('Enter in DragonService.getChampionInfoByName');
        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        const dragonData: Map<string, IDragonChampion> = await DragonService.readDragonChampionFileByName(dragonCulture);
        if (dragonData.has(championName.toLowerCase())) {
            championInfo = dragonData.get(championName.toLowerCase())!;
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
        // console.log('Enter in DragonService.downloadDragonFile');

        // We check the version
        let versionData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        versionData = DragonService.prepareTree();

        if (dragonVersion) {
            versionData.data = dragonVersion;
        } else {
            // Double check, This scenario is not supposed to happen.
            versionData = await DragonService.getDragonVersion();
        }

        // Prepare return data
        const returnData: ReturnData<T> = new ReturnData<T>;

        // Read current file if exists
        const tmpData: DragonFile<T> = new DragonFile<T>();
        if (FileService.checkFileExists(dragonFileName)) {
            tmpData.data = FileService.readInternalJSONFile(dragonFileName);
        }

        let downloadResult: DragonFile<T>;
        const currentVersion: number = (versionData != undefined && versionData!.data!.internalVersion != null ? castToNumber(versionData!.data!.internalVersion!) : 0);
        // let dragonFileVersion: DragonVersion = new DragonVersion();

        if (tmpData?.data == undefined) {
            // Downlaod current file for check version
            downloadResult = await DragonService.downloadExternalDragonFile<T>(url);
            if (downloadResult && downloadResult.data != null) {
                versionData.data!.onlineVersion = downloadResult.version;

                const newVersion: number = castToNumber(downloadResult.version!);
                // const currentVersion: number = castToNumber(versionData.data!.internalVersion!);
                const requiredUpdate: boolean = (currentVersion < newVersion);
                versionData.data!.requiredUpdate = requiredUpdate;
            }
        }

        if ((versionData && versionData.data!.requiredUpdate || tmpData?.data == undefined) && dragonVersion != null) {
            if (!FileService.writeFile(dragonFileName, JSON.stringify(downloadResult!))) {
                returnData.addMessage(DragonServiceLocalization.errDownloadingFile);
            }
        }

        return returnData;
    }

    /**
     * Reads the dragon file associated with the champions.
     * @param culture
     * @returns Map<string, IDragonChampion> (key is champion id)
     */
    static async readDragonChampionFileById(dragonCulture: DragonCulture): Promise<Map<number, IDragonChampion>> {
        let championData: Map<number, IDragonChampion> = new Map<number, IDragonChampion>();

        // Check if champions data is in cache
        const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_ID.replace('{0}', dragonCulture);
        if (EnvVars.cache.enabled) {
            const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);
            if (cacheValue != undefined) {
                championData = cacheValue;
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);

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

    /**
    * Reads the dragon file associated with the champions.
    * @param culture
    * @returns Map<string, IDragonChampion> (key is lower champion name)
    */
    static async readDragonChampionFileByName(dragonCulture: DragonCulture): Promise<Map<string, IDragonChampion>> {
        let championData: Map<string, IDragonChampion> = new Map<string, IDragonChampion>();

        // Check if champions data is in cache
        const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_NAME.replace('{0}', dragonCulture);
        if (EnvVars.cache.enabled) {
            const cacheValue: Map<string, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<string, IDragonChampion>>(championsCache);
            if (cacheValue != undefined) {
                championData = cacheValue;
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        const fileName: string = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);

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

                    championData.set(String(dragonChampionInfo.id.toLowerCase()), tmpChampion);
                }
            }

            if (EnvVars.cache.enabled) {
                CacheService.getInstance().setCache<Map<string, IDragonChampion>>(championsCache, championData, CacheTimer.DRAGON_VERSION);
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
