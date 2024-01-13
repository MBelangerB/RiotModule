import { readFileSync, mkdirSync, existsSync, writeFileSync, copyFileSync } from 'fs';
import { rmSync } from 'fs-extra';
import { castDataToJSON, isNullOrEmpty } from '../declaration/functions';

// **** Variables **** //

// Localization
export const FileServiceLocalization = {
    errInFunction:  /* istanbul ignore next */ (functionName: string) => `An error occured in 'FileService.${functionName}'.`,
    errEmptyParameters: (paramName: string) => `The parameters '${paramName} is null or empty.`,
    msgFolderBeenCreated: (folderName: string) => `The folder '${folderName}' has been created.`,
    msgFolderAlreadyExists: (folderName: string) => `The folder '${folderName}' already exists.`,
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
        if (FileService.checkFileExists(filePath)) {
            return rmSync(filePath, { recursive: true });
        }
    }

    /**
     * [Promise] Create folder recursively
     * @param folderPath
     * @returns
     */
    static createFolder(folderPath: string): string {
        try {
            if (isNullOrEmpty(folderPath)) {
                return FileServiceLocalization.errEmptyParameters(folderPath);
            }

            if (!existsSync(folderPath)) {
                // File not Exists
                mkdirSync(folderPath, { recursive: true });

                // console.info(FileServiceLocalization.msgFolderBeenCreated(folderPath));
                return FileServiceLocalization.msgFolderBeenCreated(folderPath);
            } else {
                return FileServiceLocalization.msgFolderAlreadyExists(folderPath);
            }

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (ex: any) /* istanbul ignore next */ {
            console.error('****************************************');
            console.error(FileServiceLocalization.errInFunction('createFolder'));
            console.error(ex);
            console.error('****************************************');
            // Dont return « ex ». Return custom exception with own message
            return ex.message;
        }
    }

    /**
     * Create a file and write it
     * @param filePath
     * @param fileContent
     * @returns
     */
    static writeFile(filePath: string, fileContent: string): boolean {
        try {
            if (isNullOrEmpty(filePath)) {
                return false;
            }

            if (typeof (fileContent) !== 'string') {
                writeFileSync(filePath, castDataToJSON(fileContent), { flag: 'w' });
            } else {
                writeFileSync(filePath, fileContent, { encoding: 'utf8', flag: 'w' });
            }
            console.info(FileServiceLocalization.msgFileCreatedOrUpdate(filePath));

            return true;

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (ex: any) /* istanbul ignore next */ {
            console.error('****************************************');
            console.error(FileServiceLocalization.errInFunction('writeFile'));
            console.error(ex);
            console.error('****************************************');
            return false;
        }
    }

    // https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
    /**
     * Read a file content and return JSON Object
     * @param filePath
     * @param fileEncoding
     * @param flag
     * @returns
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    static readInternalJSONFile(filePath: string, fileEncoding: BufferEncoding = 'utf8', flag = 'r'): any {
        const rawdata = readFileSync(filePath, { encoding: fileEncoding, flag: flag });
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const data: any = JSON.parse(rawdata);
        return data;
    }

    /**
     * Read a file content and return raw data
     * @param filePath
     * @param fileEncoding
     * @param flag
     * @returns
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    static readInternalTextFile(filePath: string, fileEncoding: BufferEncoding = 'utf8', flag = 'r'): string {
        return readFileSync(filePath, { encoding: fileEncoding, flag: flag });
    }

    /**
     * Read the content on a static file (if file exists)
     * @param filePath {string}
     * @returns {any | undefined}
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    static readStaticFileContent(filePath: string) : any | undefined {
        /* istanbul ignore else */
        if (FileService.checkFileExists(filePath)) {
            // If version file already exists we read the file
            return FileService.readInternalJSONFile(filePath);
        }
        return undefined;
    }

    static copyFile(sourcePath: string, destionationPath: string) : void {
        return copyFileSync(sourcePath, destionationPath);
    }
}

export default {
    FileServiceLocalization,
    FileService,
} as const;
