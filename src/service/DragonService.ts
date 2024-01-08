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
    errInFunction:  /* istanbul ignore next */ (functionName: string) => `An error occured in 'DragonService.${functionName}'.`,
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
     * @returns Current folder path
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
     * @param subFolder subfolder name
     * @returns Get full File path ({culture}/{subFolder}/{filename})
     */
    static getDragonFullPath(culture?: DragonCulture, fileName = '', subFolder = ''): string {
        if (!culture) {
            // Base folder
            return DragonPath.dragonFolder;

        } else if (!fileName || fileName.length == 0) {
            // Create folder without filename
            if (subFolder || subFolder.length > 0) {
                return join(DragonPath.dragonFolder, culture, subFolder);
            }
            return join(DragonPath.dragonFolder, culture);

        } else {
            // Create folder with subFolder
            if (subFolder || subFolder.length > 0) {
                return join(DragonPath.dragonFolder, culture, subFolder, fileName);
            }

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
        // TODO : For each availabled CULTURE. Add params (culture ?)
        const returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();

        if (!FileService.checkFileExists(DragonPath.dragonFolder)) {
            returnData.addMessage(FileService.createFolder(DragonPath.dragonFolder));
        }

        // French
        let cultureFolder: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
        if (!FileService.checkFileExists(cultureFolder)) {
            returnData.addMessage(FileService.createFolder(cultureFolder));
        }

        let championCulture: string = DragonService.getDragonFullPath(DragonCulture.fr_fr, '', 'champion');
        if (!FileService.checkFileExists(championCulture)) {
            returnData.addMessage(FileService.createFolder(championCulture));
        }

        // English
        cultureFolder = DragonService.getDragonFullPath(DragonCulture.en_us);
        if (!FileService.checkFileExists(cultureFolder)) {
            returnData.addMessage(FileService.createFolder(cultureFolder));
        }

        championCulture = DragonService.getDragonFullPath(DragonCulture.en_us, '', 'champion');
        if (!FileService.checkFileExists(championCulture)) {
            returnData.addMessage(FileService.createFolder(championCulture));
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

            case DragonFileType.ChampionDetail:
                returnUrl = EnvVars.dragon.url.championName.replace('{version}', dataVersion.internalVersion!)
                    .replace('{lang}', dragonCulture);
                break;
        }

        return returnUrl;
    }
    // #endregion

    // #region  "Cache"

    /**
     * Get cache value if keyName exists
     * @param keyName
     * @returns
     */
    static getKeyInCache<T>(keyName: string): ReturnData<T> {
        const returnData: ReturnData<T> = new ReturnData<T>();

        /* istanbul ignore else */
        if (EnvVars.cache.enabled) {
            const cacheValue: T | undefined = CacheService.getInstance().getCache<T>(keyName);
            /* istanbul ignore else */
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
     * @returns {ReturnData<DragonVersion>}
     */
    static async getDragonVersion(): Promise<ReturnData<DragonVersion>> {
        // console.log('Enter in DragonService.getDragonVersion');
        let returnData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();

        const versionCacheKey = CacheName.DRAGON_VERSION;
        try {
            // Check if data is in cache
            returnData = DragonService.getKeyInCache<DragonVersion>(versionCacheKey);
            /* istanbul ignore else */
            if (returnData && returnData.data) {
                return returnData;
            }

            // -----------------------------------------
            // No cache or no data, we prepare the data amd read static file (if exists)
            // We also download current version file (on URL) for validate the version
            // -----------------------------------------
            const dragonData: DragonVersion = {
                internalVersion: null,
            };
            returnData.data = dragonData;

            // Prepare and read temp data
            const tmpData: VersionData = new VersionData();
            tmpData.version = FileService.readStaticFileContent(this.getDragonVersionPath());
            /* istanbul ignore else */
            if (typeof tmpData !== 'undefined' && tmpData.version?.length > 0) {
                returnData.data.internalVersion = tmpData.version[0];
            }

            // We check for download the newest version
            // We need to set current IDragonVersion for the update
            returnData = await DragonService.downloadDragonVersionFile(returnData.data!);
            /* istanbul ignore else */
            if (returnData.data!.requiredUpdate) {
                dragonData.internalVersion = returnData.data?.onlineVersion?.toString() ?? '';
            }

            /* istanbul ignore else */
            if (EnvVars.cache.enabled) {
                CacheService.getInstance().setCache<DragonVersion>(versionCacheKey, dragonData, CacheTimer.DRAGON_VERSION);
            }

        } catch (ex) /* istanbul ignore next */ {
            returnData.addMessage(DragonServiceLocalization.errInFunction('getDragonVersion'));
            returnData.code = RiotHttpStatusCode.INTERNAL_SERVER_ERROR;
        }

        return returnData;
    }

    /**
    * [OK] Download the dragon version file and update it if necessary
    * @param dataDragon Current DragonVersion
    * @returns {ReturnData<DragonVersion>}
    */
    private static async downloadDragonVersionFile(dataDragon: DragonVersion): Promise<ReturnData<DragonVersion>> {
        // console.log('Enter in DragonService.downloadDragonVersionFile');

        // Create tree if doesn't exist
        let intData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        intData = DragonService.prepareTree();
        intData.data = dataDragon;

        // Convert FULL version to string version
        const currentVersion: number = (intData.data!.internalVersion != null ? castToNumber(intData.data!.internalVersion!) : 0);

        // Download file content
        const versionUrl = EnvVars.dragon.url.version;
        const downloadResult: ReturnData<VersionData> = await DragonService.downloadExternalFileContent<VersionData>(versionUrl);

        /* istanbul ignore else */
        if (downloadResult && downloadResult.code == 200 && downloadResult.data != null && Array.isArray(downloadResult.data)) {
            intData.data!.onlineVersion = downloadResult.data[0].toString();

            const newVersion: number = castToNumber(intData.data!.onlineVersion!);
            const requiredUpdate: boolean = (currentVersion < newVersion);
            intData.data!.requiredUpdate = requiredUpdate;
        }

        /* istanbul ignore else */
        if (intData.data!.requiredUpdate) {
            /* istanbul ignore else */
            if (!FileService.writeFile(this.getDragonVersionPath(), JSON.stringify(downloadResult.data))) {
                /* istanbul ignore next */
                intData.addMessage(DragonServiceLocalization.errDownloadingFile);
            }
        }

        return intData;
    }

    // #endregion

    // #region "Get Champion Summary/Detailed"

    /**
     * Get DragonChampion info by championId
     * @param championId League of Legend champion id
     * @param dragonCulture Dragon culture
     * @returns {DragonChampion}
     * TODO: ReturnData<DragonChampion> ?
     */
    static async getChampionInfoById(championId: number, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        // console.log('Enter in DragonService.getChampionInfoById');

        /* istanbul ignore else */
        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        const dragonData: Map<number, IDragonChampion> = await DragonService.readDragonChampionsFileById(dragonCulture);

        /* istanbul ignore else */
        if (dragonData.has(championId)) {
            championInfo = dragonData.get(championId)!;
        }

        return championInfo;
    }

    /**
     * Get DragonChampion info by championName
     * @param championName League of Legend champion name
     * @param dragonCulture  Dragon culture
     * @returns {DragonChampion}
     * TODO: ReturnData<DragonChampion> ?
     */
    static async getChampionInfoByName(championName: string, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        // console.log('Enter in DragonService.getChampionInfoByName');
        /* istanbul ignore else */
        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        const dragonData: Map<string, IDragonChampion> = await DragonService.readDragonChampionFileByName(dragonCulture);

        /* istanbul ignore else */
        if (dragonData.has(championName.toLowerCase())) {
            championInfo = dragonData.get(championName.toLowerCase())!;
        }

        return championInfo;
    }

    // #endregion

    // #region "Champion detailled"

    /**
     * Get DragonChampion info by championName
     * @param championName League of Legend champion name
     * @param dragonCulture  Dragon culture
     * @returns
     * TODO: ReturnData<DragonChampion> ?
     */
    static async getDetailedChampionInfoByName(championName: string, dragonCulture: DragonCulture | undefined): Promise<DragonChampion> {
        // console.log('Enter in DragonService.getDetailedChampionInfoByName');

        /* istanbul ignore else */
        if (!dragonCulture || dragonCulture == null) {
            dragonCulture = DragonCulture.fr_fr;
        }

        let championInfo: DragonChampion = new DragonChampion();
        championInfo = await DragonService.readDetailedDragonChampionFileByName(championName, dragonCulture);

        return championInfo;
    }

    // #endregion

    //#region "Read Dragon file"
    /**
     * Read dragon champion details file. The detail file content all information for a specific champion.
     * @param championName League of Legend champion name
     * @param dragonCulture Dragon culture
     * @returns  {IDragonChampion}
     */
    private static async readDetailedDragonChampionFileByName(championName: string, dragonCulture: DragonCulture): Promise<IDragonChampion> {
        let championData!: IDragonChampion; // = new IDragonChampion;

        // Check if data is cached
        const championsCache = CacheName.DRAGON_CHAMPION_DETAIL_BY_NAME.replace('{0}', dragonCulture).replace('{1}', championName);
        /* istanbul ignore else */
        if (EnvVars.cache.enabled) {
            const cacheValue: IDragonChampion | undefined = CacheService.getInstance().getCache<IDragonChampion>(championsCache);
            /* istanbul ignore else */
            if (cacheValue != undefined) {
                championData = cacheValue;
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        let aDragonChampion: DragonFile<DragonChampion[]> = new DragonFile<DragonChampion[]>;

        const downResult: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadAndReadDetailedChampionFile(championName, dragonCulture);
        /* istanbul ignore else */
        if (downResult && downResult.data != null) {
            aDragonChampion = downResult.data;
        }

        // let aDragonChampion: ChampionData = {};

        if (aDragonChampion && aDragonChampion.type == 'champion') {
            for (const keyName in aDragonChampion.data) {
                const dragonChampionInfo: IDragonChampion = aDragonChampion.data[keyName];

                /* istanbul ignore else */
                if (dragonChampionInfo) {
                    // Mandatory for clean extra values
                    championData = {
                        id: dragonChampionInfo.id,
                        key: dragonChampionInfo.key,
                        name: dragonChampionInfo.name,
                        title: dragonChampionInfo.title,
                        image: dragonChampionInfo.image,
                        skins: dragonChampionInfo.skins
                    }
                }
            }

            /* istanbul ignore else */
            if (EnvVars.cache.enabled) {
                CacheService.getInstance().setCache<IDragonChampion>(championsCache, championData, CacheTimer.DRAGON_CHAMPION);
            }
        }

        return championData;
    }

    /**
     * Reads the dragon champion file.  Mapped by ChampionId
     * @param dragonCulture Dragon culture
     * @returns {Map<number, IDragonChampion>}
     */
    private static async readDragonChampionsFileById(dragonCulture: DragonCulture): Promise<Map<number, IDragonChampion>> {
        let championData: Map<number, IDragonChampion> = new Map<number, IDragonChampion>();

        // Check if champions data is cached
        const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_ID.replace('{0}', dragonCulture);
        /* istanbul ignore else */
        if (EnvVars.cache.enabled) {
            const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);

            /* istanbul ignore else */
            if (cacheValue != undefined) {
                championData = cacheValue;
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        let aDragonChampion: DragonFile<DragonChampion[]> = new DragonFile<DragonChampion[]>;
        const dragonChampionFileName = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);

        const downResult: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadAndReadDragonFile<DragonChampion[]>('', DragonFileType.Champion, dragonChampionFileName, dragonCulture);
        /* istanbul ignore else */
        if (downResult && downResult.data != null) {
            aDragonChampion = downResult.data;
        }

        /* istanbul ignore else */
        if (aDragonChampion && aDragonChampion.type == 'champion') {
            for (const keyName in aDragonChampion.data) {
                const dragonChampionInfo: IDragonChampion = aDragonChampion.data[keyName];

                /* istanbul ignore else */
                if (dragonChampionInfo) {
                    // Mandatory for clean extra values
                    const tmpChampion: IDragonChampion = {
                        id: dragonChampionInfo.id,
                        key: dragonChampionInfo.key,
                        name: dragonChampionInfo.name,
                        title: dragonChampionInfo.title,
                        image: dragonChampionInfo.image,
                        skins: undefined,
                    };

                    championData.set(Number(dragonChampionInfo.key), tmpChampion);
                }
            }

            /* istanbul ignore else */
            if (EnvVars.cache.enabled) {
                CacheService.getInstance().setCache<Map<number, IDragonChampion>>(championsCache, championData, CacheTimer.DRAGON_CHAMPION);
            }
        }

        return championData;
    }

    /**
     * Reads the dragon champion file. Mapped by ChampionName
     * @param dragonCulture Dragon culture
     * @returns {Map<string, IDragonChampion>}
    */
    private static async readDragonChampionFileByName(dragonCulture: DragonCulture): Promise<Map<string, IDragonChampion>> {
        let championData: Map<string, IDragonChampion> = new Map<string, IDragonChampion>();

        // Check if champions data is in cache
        const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_NAME.replace('{0}', dragonCulture);

        /* istanbul ignore else */
        if (EnvVars.cache.enabled) {
            const cacheValue: Map<string, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<string, IDragonChampion>>(championsCache);

            /* istanbul ignore else */
            if (cacheValue != undefined) {
                championData = cacheValue;
                return championData;
            }
        }

        // If cache isn't enabled we check if we can read it. If we can't we download it
        let aDragonChampion: DragonFile<DragonChampion[]> = new DragonFile<DragonChampion[]>;
        const dragonChampionFileName = DragonPath.dragonCulturePath(dragonCulture, DragonFileName.champion);

        /* istanbul ignore else */
        if (!FileService.checkFileExists(this.getDragonFullPath()) || !FileService.checkFileExists(dragonChampionFileName)) {
            const downResult: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadAndReadDragonFile<DragonChampion[]>('', DragonFileType.Champion, dragonChampionFileName, dragonCulture);

            /* istanbul ignore else */
            if (downResult && downResult.data != null) {
                aDragonChampion = downResult.data;
            }
        }

        /* istanbul ignore else */
        if (aDragonChampion == null || aDragonChampion.data == null) {
            aDragonChampion = FileService.readInternalJSONFile(dragonChampionFileName);
        }

        /* istanbul ignore else */
        if (aDragonChampion && aDragonChampion.type == 'champion') {
            for (const keyName in aDragonChampion.data) {
                const dragonChampionInfo: IDragonChampion = aDragonChampion.data[keyName];

                /* istanbul ignore else */
                if (dragonChampionInfo) {
                    // Mandatory for clean extra values
                    const tmpChampion: IDragonChampion = {
                        id: dragonChampionInfo.id,
                        key: dragonChampionInfo.key,
                        name: dragonChampionInfo.name,
                        title: dragonChampionInfo.title,
                        image: dragonChampionInfo.image,
                        skins: dragonChampionInfo.skins,
                    };

                    championData.set(String(dragonChampionInfo.id.toLowerCase()), tmpChampion);
                }
            }

            /* istanbul ignore else */
            if (EnvVars.cache.enabled) {
                CacheService.getInstance().setCache<Map<string, IDragonChampion>>(championsCache, championData, CacheTimer.DRAGON_VERSION);
            }
        }

        return championData;
    }
    //#endregion

    // #region "Download/Write dragon file"

    /**
    * Call the URL for download/read the file content and write it.
    * @param url Target URL
    * @param filePath Destination file
    * @returns {ReturnData<T>}
    * TODO: Move to another service (RequestService) ?
    */
    static async downloadAndWriteFile<T>(url: string, filePath: string): Promise<ReturnData<T>> {
        // console.log('Enter in DragonService.downloadAndWriteFile');

        const retData: ReturnData<T> = new ReturnData<T>();
        retData.data = await RequestService.downloadAndWriteFile<T>(url, filePath);
        return retData;
    }

    /**
     * Download a specific dragon champion file and write the file in server
     * @param championName 
     * @param dragonCulture 
     * @returns 
     */
    private static async downloadAndReadDetailedChampionFile<T>(championName: string, dragonCulture: DragonCulture): Promise<ReturnData<DragonFile<DragonChampion[]>>> {
        // console.log('Enter in DragonService.downloadAndReadDetailedChampionFile');

        // We check the version
        let versionData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        versionData = DragonService.prepareTree();
        versionData = await DragonService.getDragonVersion();

        // Generate detailed URL
        let detailChampionUrl: string = DragonService.getFileUrl(DragonFileType.ChampionDetail, DragonCulture.fr_fr, versionData.data!);
        detailChampionUrl = detailChampionUrl.replace('{championName}', championName);

        const dragonChampionFileName = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.detailChampion.replace('{championName}', championName));

        const returnData: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadAndReadDragonFile<DragonChampion[]>(detailChampionUrl,
            DragonFileType.ChampionDetail,
            dragonChampionFileName, dragonCulture);

        return returnData;
    }

    /**
     * Download a dragon file (not for version.json)
     * @param url
     * @param dragonCulture
     * @returns
    */
    private static async downloadAndReadDragonFile<T>(url: string, dragonFileType: DragonFileType,
                                                        dragonFilePath: string, dragonCulture: DragonCulture): Promise<ReturnData<DragonFile<T>>> {
        // console.log('Enter in DragonService.downloadAndReadDragonFile');

        // We check the version
        let versionData: ReturnData<DragonVersion> = new ReturnData<DragonVersion>();
        versionData = DragonService.prepareTree();
        versionData = await DragonService.getDragonVersion();

        // Use Func StringIsNulLorEmpty (BedyAPI exemple)
        if (url == undefined || url.length == 0) {
            url = DragonService.getFileUrl(dragonFileType, dragonCulture, versionData.data!);
        }

        // ---------------------
        // Prepare return data
        let returnData: ReturnData<DragonFile<T>> = new ReturnData<DragonFile<T>>;
        let tmpData: DragonFile<T> = new DragonFile<T>();

        /* istanbul ignore else */
        if (FileService.checkFileExists(dragonFilePath)) {
            tmpData = FileService.readInternalJSONFile(dragonFilePath);

            // Check if current dragon file required a update
            const currentDragonFileVersion: number = castToNumber(tmpData.version);
            const currentOnlineVersion: number = castToNumber(versionData.data?.onlineVersion!);

            const requiredUpdate: boolean = (currentDragonFileVersion < currentOnlineVersion);
            versionData.data!.requiredUpdate = requiredUpdate;
        }

        // If required, download and write new dragon file data
        if (tmpData?.data == undefined || versionData.data?.requiredUpdate) {
            tmpData = await DragonService.downloadExternalDragonFile<T>(url);
            returnData.data = tmpData;

            /* istanbul ignore else */
            if (!FileService.writeFile(dragonFilePath, JSON.stringify(tmpData!))) {
                /* istanbul ignore next */
                returnData.addMessage(DragonServiceLocalization.errDownloadingFile);
            }

        } else {
            returnData.data = tmpData;
        }

        return returnData;
    }

    /**
    * Call the URL for download/read the content
    * @param url Download external file
    * @returns
    */
    private static async downloadExternalFileContent<T>(url: string): Promise<ReturnData<T>> {
        // console.log('Enter in DragonService.downloadExternalFileContent');

        const retData: ReturnData<T> = new ReturnData<T>();
        retData.data = await RequestService.downloadExternalFile<T>(url);
        return retData;
    }

    /**
     * Call the Dragon URL for download/read the content.
     * @param url
     * @returns
     */
    private static async downloadExternalDragonFile<T>(url: string): Promise<DragonFile<T>> {
        // console.log('Enter in DragonService.downloadExternalDragonFile');

        let retData: DragonFile<T> = new DragonFile<T>();
        retData = await RequestService.downloadExternalFile<DragonFile<T>>(url);

        return retData;
    }
    // #endregion
}


// Dragon file path
// TODO: Fix and use dragonChampionFolder
export const DragonPath = {
    basePath: DragonService.getMainPath(),
    dragonFolder: join(DragonService.getMainPath(), EnvVars.dragon.folder),
    dragonFilePath: (filename: string) => join(DragonPath.dragonFolder, filename),
    dragonCulturePath: (culture: string, fileName: string) => join(DragonPath.dragonFolder, culture, fileName),
    dragonChampionFolder: (culture: string) =>  join(DragonPath.dragonFolder, culture, 'champion'),
} as const;

export const DragonFileName = {
    champion: 'champion.json',
    version: 'version.json',
    detailChampion: 'champion/{championName}.json',
};


// **** Functions **** //


// **** Export default **** //

export default {
    DragonServiceLocalization,
    DragonService,
} as const;
