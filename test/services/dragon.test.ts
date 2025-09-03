//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
process.env.dragonBaseFolder = './_result/static/dragon';
// process.env.CacheEnabled = 'false';

import { join, resolve } from 'path';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

import { DragonService, ReturnData } from '../../src/index.js';
import { FileService } from '../../src/service/FileService.js';
import { DragonFileName, DragonPath } from '../../src/service/DragonService.js';
import { DragonCulture, DragonFileType } from '../../src/declaration/enum.js';
import { DragonChampion, DragonVersion, IDragonChampion } from '../../src/model/DragonModel.js';
import { CacheService, CacheName } from '../../src/service/CacheService.js';
import EnvVars from '../../src/declaration/major/EnvVars.js';

// https://medium.com/nodejsmadeeasy/elegant-ways-to-pass-env-variables-to-mocha-test-cases-4486cb238bb1
// https://www.tabnine.com/code/javascript/functions/chai/Assertion/status
describe('===> Test DragonService', () => {

  const test_Folder: string = './_result/static/test';
  const test_subFolder: string = 'champion'
  const versionSourceFile: string = './test/baseFile/versions.json';
  const defaultTestFileName: string = 'text.txt';
  const lastDragonVersion: string = "13.10.1";

  // beforeEach
  beforeAll(() => {
    // runs once before the first test in this block
    // FileService.removeFile(DragonPath.dragonChampionFolder(DragonCulture.fr_fr));
    try {
      FileService.removeFile(DragonPath.dragonFolder);
      FileService.removeFile(test_Folder);
    } catch (err) {
      console.error(err)
    }
  });

  // afterEach
  afterAll(() => {
    // runs once before the first test in this block
    FileService.removeFile(DragonPath.dragonChampionFolder(DragonCulture.fr_fr));
    FileService.removeFile(DragonPath.dragonFolder);
    FileService.removeFile(test_Folder);
  });


  test('1.0.0 => Get dragon default folder', (done) => {
    let result: string = DragonService.getDragonFullPath();
    // console.info('Get DragonFullPath : ' + result);

    let baseString: string = resolve(process.env.dragonBaseFolder?.replace('./', '') || '');

    expect(result).not.toBeNull;
    expect(result).toContain(baseString);

    done();
  });

  test('1.0.1 => Get dragon default folder with culture', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr)
    let englishBaseString = join(baseString!, DragonCulture.en_us)

    expect(frenchResult).not.toBeNull;
    expect(frenchResult).toContain(frenchBaseString);
    expect(englishResult).not.toBeNull;
    expect(englishResult).toContain(englishBaseString);

    done();
  });

  test('1.0.2 => Get dragon default folder with culture and filename', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr, defaultTestFileName);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us, defaultTestFileName);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr, defaultTestFileName);
    let englishBaseString = join(baseString!, DragonCulture.en_us, defaultTestFileName);

    expect(frenchResult).toBeTruthy();
    expect(frenchResult).toContain(frenchBaseString);
    expect(englishResult).toBeTruthy();
    expect(englishResult).toContain(englishBaseString);
    done();
  });

  test('1.0.3 => Get dragon default folder with culture, filename and subfolder', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr, defaultTestFileName, test_subFolder);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us, defaultTestFileName, test_subFolder);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr, test_subFolder, defaultTestFileName);
    let englishBaseString = join(baseString!, DragonCulture.en_us, test_subFolder, defaultTestFileName);

    expect(frenchResult).toBeTruthy();
    expect(frenchResult).toContain(frenchBaseString);
    expect(englishResult).toBeTruthy();
    expect(englishResult).toContain(englishBaseString);
    done();
  });

  test('1.0.4 => Get dragon default folder with culture and subfolder', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr, '', test_subFolder);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us, '', test_subFolder);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr, test_subFolder);
    let englishBaseString = join(baseString!, DragonCulture.en_us, test_subFolder);

    expect(frenchResult).toBeTruthy();
    expect(frenchResult).toContain(frenchBaseString);
    expect(englishResult).toBeTruthy();
    expect(englishResult).toContain(englishBaseString);
    done();
  });

  test('1.0.5 => Get dragon champion file url path', (done) => {
    let testDragonVersion: DragonVersion = {
      internalVersion: null,
      onlineVersion: undefined,
    };
    testDragonVersion.internalVersion = lastDragonVersion;
    testDragonVersion.onlineVersion = lastDragonVersion;

    let result: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, testDragonVersion);
    // console.log('Data : ', result);

    expect(result).toBeTruthy();
    expect(result).toContain('ddragon.leagueoflegends.com/cdn/');
    expect(result).toContain('/data/fr_FR/champion.json');
    expect(result).toContain(lastDragonVersion);
    done();
  });

  test('2.0 => Prepare dragon folder tree', (done) => {
    let result: ReturnData<DragonVersion> = DragonService.prepareTree();

    expect(result).toBeTruthy();
    expect(result).not.toBeNull();
    expect(result.messages).not.toBeNull();
    expect(result.data).not.toBeNull();

    let folders = new Array<string>();
    folders.push(DragonPath.dragonFolder);
    folders.push(DragonService.getDragonFullPath(DragonCulture.fr_fr));
    folders.push(DragonService.getDragonFullPath(DragonCulture.en_us));

    expect(folders).not.toBeNull();
    expect(folders).toBeInstanceOf(Array);

    // console.dir(folders);

    folders.forEach((folder: string) => {
      // console.info(folder);
      expect(FileService.checkFileExists(folder)).toBeTruthy();
    });

    done();
  });

  test('2.1 => Download external file', async () => {
    try {
      let textUrl: string = 'https://filesamples.com/samples/document/txt/sample3.txt';
      let fileName: string = 'sample.txt'

      FileService.createFolder(test_Folder);
      const test_TextFilePath: string = join(test_Folder, fileName);

      await DragonService.downloadAndWriteFile<string>(textUrl, test_TextFilePath).then((result: ReturnData<string>) => {
        expect(result).toBeTruthy();
        expect(result.code).toBe(200);
        expect(result).not.toBeNull();
        expect(result.data).not.toBeNull();

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      }).catch((err: any) => {
        throw err;
        // assert.fail(err);
      });

    }
    catch (ex) {
      console.error(ex);
    };

  }); //, 5000);

  test('2.2.0 => Download version list (Dragon)', async () => {
    let result: ReturnData<DragonVersion> = await DragonService.getDragonVersion();

    expect(result).toBeTruthy();
    expect(result.data).toBeTruthy();

    expect(result).not.toBeNull();
    expect(result.messages).not.toBeNull();

    let folders = new Array<string>();
    folders.push(DragonPath.dragonFolder);
    folders.push(DragonService.getDragonFullPath(DragonCulture.fr_fr));
    folders.push(DragonService.getDragonFullPath(DragonCulture.en_us));
    folders.push(DragonPath.dragonFilePath(DragonFileName.version));

    expect(folders).not.toBeNull();
    expect(folders).toBeInstanceOf(Array);

    folders.forEach((folder: string) => {
      expect(FileService.checkFileExists(folder)).toBeTruthy();
    });

    expect(result.data).not.toBeNull();
    expect(result.data?.internalVersion).not.toBeNull();
    expect(result.data?.internalVersion).toBeDefined();
    expect(result.data?.internalVersion).not.toEqual("0.0.0");

  }); //, 5000);

  test('2.2.1 => Update version list (Dragon)', async () => {
    // Because cache is enabled, we need to clean the cache created  by lastest tests
    CacheService.getInstance().cleanCache();

    let sourceFile: string = join(DragonService.getMainPath(), versionSourceFile);
    let fileDestination: string = DragonPath.dragonFilePath(DragonFileName.version);

    // Check if base version file exists
    let baseFileExists: boolean = FileService.checkFileExists(sourceFile);
    expect(baseFileExists).toBe(true);

    if (baseFileExists) {
      // Prepare test tree
      let result: ReturnData<DragonVersion> = DragonService.prepareTree();
      expect(result).toBeTruthy();

      // Copy base file
      FileService.copyFile(sourceFile, fileDestination);
      let destinationFileExists: boolean = FileService.checkFileExists(fileDestination);
      expect(destinationFileExists).toBe(true);

      // Check for update
      result = await DragonService.getDragonVersion();
      expect(result).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data?.requiredUpdate).toBe(true);

    } else {
      throw new Error('BaseFile doesn\'t exists');
      // assert.fail('BaseFile doesn\'t exists')
    }
  }); // .timeout(10000);

  test('3.0.0 => Get summary champion info in file by championId', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(99), DragonCulture.fr_fr);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).toBeUndefined();

  }); //, 20000);

  test('3.0.1 => Get summary champion info by championId without specify a culture (default culture)', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(99), undefined);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).toBeUndefined();

  }); //, 20000);

  test('3.0.2 => Get summary champion info in file by championName', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoByName("LUX", DragonCulture.fr_fr);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).toBeUndefined();
  }); //, 20000);

  test('3.0.3 => Get summary champion info by championName without specify a culture (default culture)', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoByName("LUX", undefined);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).toBeUndefined();

  }); //, 20000);

  test('3.0.4 => Get several summary champions info by id', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(99), DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeUndefined();

    const secondChampionInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(69), DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeUndefined();

  }); //, 30000);

  test('3.0.5 => Get several summary champions info by id (without cache)', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(99), DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeUndefined();

    CacheService.getInstance().cleanCache();

    const secondChampionInfo: DragonChampion = await DragonService.getChampionInfoById(BigInt(69), DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeUndefined();

  }); //, 30000);

  test('3.0.6 => Get several summary champions info by name', async () => {
    // process.env.CacheEnabled = 'false';
    // const cacheEnabled : boolean = getBoolean(process.env.CacheEnabled);
    // const newEnvVars = { ...EnvVars, cache: { ...EnvVars.cache, enabled: false } };

    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoByName("Lux", DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeUndefined();

    const secondChampionInfo: DragonChampion = await DragonService.getChampionInfoByName("Cassiopeia", DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeUndefined();

  }); //, 30000);

  test('3.0.7 => Get several summary champions info by name (without cache)', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoByName("Lux", DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeUndefined();

    CacheService.getInstance().cleanCache();

    const secondChampionInfo: DragonChampion = await DragonService.getChampionInfoByName("Cassiopeia", DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeUndefined();

  }); //, 30000);

  test('3.1.0 => Get detailed champion info in file by championId', async () => {
    const championInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Lux", DragonCulture.fr_fr);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).not.toBeNull();
    expect(championInfo.skins).toBeDefined();

  }); //, 20000);

  test('3.1.1 => Get detailed champion info by championId without specify a culture (default culture)', async () => {
    const championInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Lux", undefined);

    expect(championInfo).toBeTruthy();
    expect(championInfo).not.toBeNull();
    expect(championInfo).toBeDefined();
    expect(championInfo.key).toBe("99");
    expect(championInfo.id).toBe("Lux");
    expect(championInfo.name).toBe("Lux");
    expect(championInfo.skins).not.toBeNull();
    expect(championInfo.skins).toBeDefined();
  }); //, 20000);

  test('3.1.2 => Get several detail champions info by name', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Lux", DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeDefined();

    const secondChampionInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Cassiopeia", DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeDefined();

  }); //, 30000);

  test('3.1.3 => Get several detail champions info by name (without cache)', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Lux", DragonCulture.fr_fr);
    expect(firstChampionInfo).toBeTruthy();
    expect(firstChampionInfo).not.toBeNull();
    expect(firstChampionInfo).toBeDefined();
    expect(firstChampionInfo.key).toBe("99");
    expect(firstChampionInfo.skins).toBeDefined();

    CacheService.getInstance().cleanCache();

    const secondChampionInfo: DragonChampion = await DragonService.getDetailedChampionInfoByName("Cassiopeia", DragonCulture.fr_fr)
    expect(secondChampionInfo).toBeTruthy();
    expect(secondChampionInfo).not.toBeNull();
    expect(secondChampionInfo).toBeDefined();
    expect(secondChampionInfo.key).toBe("69");
    expect(secondChampionInfo.id).toBe("Cassiopeia");
    expect(secondChampionInfo.name).toBe("Cassiopeia");
    expect(secondChampionInfo.skins).toBeDefined();;

  }); //, 30000);

  test('3.2 => Get champs in cache', async () => {
    let value: boolean = EnvVars.cache.enabled;
    if (!value) {
      throw new Error('Cache is not enabled');
    }
    let championIdKey: string = "Lux";

    // let championInfo: IDragonChampion | undefined;

    await DragonService.getChampionInfoByName("LuX", DragonCulture.fr_fr).then((championInfo: DragonChampion) => {
      expect(championInfo).toBeTruthy();
      expect(championInfo).not.toBeNull();
      expect(championInfo.key).toBe("99");
      expect(championInfo.id).toBe("Lux");
      expect(championInfo.name).toBe("Lux");
    });

    await DragonService.getChampionInfoByName("Lux", DragonCulture.fr_fr).then((championInfo: IDragonChampion) => {
      expect(championInfo).toBeTruthy();
      expect(championInfo).not.toBeNull();
      // toBeTruthy and Not.ToBeNull can be transform to : expect(championInfo).toBeDefined();
      expect(championInfo.key).toBe("99");
      expect(championInfo.id).toBe("Lux");
      expect(championInfo.name).toBe("Lux");
    });

    const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_NAME.replace('{0}', DragonCulture.fr_fr);
    const cacheValue: Map<string, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<string, IDragonChampion>>(championsCache);
    if (cacheValue != undefined) {
      let data: IDragonChampion = cacheValue.get(championIdKey.toLowerCase())!;
      expect(data).toBeTruthy();
      expect(data.id).toBe(championIdKey);
      expect(data.key).toBe("99");
    } else {
      throw new Error('Value isn\'t in cache.');
    }
  });

}); // END : 'Test DRAGON'