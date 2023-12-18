//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
process.env.dragonBaseFolder = './_result/static/dragon';
// process.env.CacheEnabled = 'false';

import { DragonService, ReturnData } from '../../src/index';
import { assert, expect } from "chai";
import { FileService } from '../../src/service/FileService';
import { DragonFileName, DragonPath } from '../../src/service/DragonService';
import { DragonCulture, DragonFileType } from '../../src/declaration/enum';
import { DragonChampion, DragonFile, DragonVersion, IDragonChampion } from '../../src/model/DragonModel';
import { join, resolve } from 'path';
import { CacheService, CacheName } from '../../src/service/CacheService';

// https://medium.com/nodejsmadeeasy/elegant-ways-to-pass-env-variables-to-mocha-test-cases-4486cb238bb1
// https://www.tabnine.com/code/javascript/functions/chai/Assertion/status
describe('===> Test DragonService', () => {

  const test_Folder: string = './_result/static/test';
  const versionSourceFile: string = './test/baseFile/versions.json';
  const defaultTestFileName: string = 'text.txt';
  const lastDragonVersion: string = "13.10.1";

  // beforeEach
  before(() => {
    // runs once before the first test in this block
    FileService.removeFile(DragonPath.dragonFolder);
    FileService.removeFile(test_Folder);
  });

  // afterEach
  after(() => {
    // runs once before the first test in this block
    FileService.removeFile(DragonPath.dragonFolder);
    FileService.removeFile(test_Folder);
  });


  it('1.0 => Get dragon default folder', (done) => {
    let result: string = DragonService.getDragonFullPath();
    // console.info('Get DragonFullPath : ' + result);

    let baseString: string = resolve(process.env.dragonBaseFolder?.replace('./', '') || '');
    assert.ok(result);
    expect(result).to.contain(baseString);
    done();
  });

  it('1.1 => Get dragon default folder with culture', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr)
    let englishBaseString = join(baseString!, DragonCulture.en_us)

    assert.ok(frenchResult);
    expect(frenchResult).to.contain(frenchBaseString);
    assert.ok(englishResult);
    expect(englishResult).to.contain(englishBaseString);
    done();
  });

  it('1.2 => Get dragon default folder with culture and filename', (done) => {
    let frenchResult: string = DragonService.getDragonFullPath(DragonCulture.fr_fr, defaultTestFileName);
    let englishResult: string = DragonService.getDragonFullPath(DragonCulture.en_us, defaultTestFileName);

    let baseString: string | undefined = process.env.dragonBaseFolder?.replace('./', '');
    let frenchBaseString = join(baseString!, DragonCulture.fr_fr, defaultTestFileName);
    let englishBaseString = join(baseString!, DragonCulture.en_us, defaultTestFileName);

    assert.ok(frenchResult);
    expect(frenchResult).to.contain(frenchBaseString);
    assert.ok(englishResult);
    expect(englishResult).to.contain(englishBaseString);
    done();
  });

  it('1.3 => Get dragon champion file url path', (done) => {
    let testDragonVersion: DragonVersion = {
      internalVersion: null,
      onlineVersion: undefined,
    };
    testDragonVersion.internalVersion = lastDragonVersion;
    testDragonVersion.onlineVersion = lastDragonVersion;

    let result: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, testDragonVersion);
    // console.log('Data : ', result);

    assert.ok(result);
    expect(result).to.contain('ddragon.leagueoflegends.com/cdn/');
    expect(result).to.contain('/data/fr_FR/champion.json');
    expect(result).to.contain(lastDragonVersion);
    done();
  });

  it('2.0 => Prepare dragon folder tree', (done) => {
    let result: ReturnData<DragonVersion> = DragonService.prepareTree();

    assert.ok(result);
    assert.isNotNull(result);
    assert.isNotNull(result.messages);
    assert.isNotNull(result.data);

    let folders = new Array<string>();
    folders.push(DragonPath.dragonFolder);
    folders.push(DragonService.getDragonFullPath(DragonCulture.fr_fr));
    folders.push(DragonService.getDragonFullPath(DragonCulture.en_us));

    assert.isNotNull(folders);
    assert.isArray(folders);

    folders.forEach((folder: string) => {
      assert.isTrue(FileService.checkFileExists(folder));
    });

    done();
  });

  it('2.1 => Download external file', async () => {
    try {
      let textUrl: string = 'https://filesamples.com/samples/document/txt/sample3.txt';
      let fileName: string = 'sample.txt'

      FileService.createFolder(test_Folder);
      const test_TextFilePath: string = join(test_Folder, fileName);

      DragonService.downloadAndWriteFile<string>(textUrl, test_TextFilePath).then((result: ReturnData<string>) => {
        assert.ok(result);
        assert.equal(result.code, 200);
        assert.isNotNull(result);
        assert.isNotNull(result.data);

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      }).catch((err: any) => {
        assert.fail(err);
      });

    }
    catch (ex) {
      console.error(ex);
    };

  }).timeout(5000);

  it('2.2.0 => Download version list (Dragon)', async () => {
    let result: ReturnData<DragonVersion> = await DragonService.getDragonVersion();

    assert.ok(result);
    assert.ok(result.data);

    assert.isNotNull(result);
    assert.isNotNull(result.messages);

    let folders = new Array<string>();
    folders.push(DragonPath.dragonFolder);
    folders.push(DragonService.getDragonFullPath(DragonCulture.fr_fr));
    folders.push(DragonService.getDragonFullPath(DragonCulture.en_us));
    folders.push(DragonPath.dragonFilePath(DragonFileName.version));

    assert.isNotNull(folders);
    assert.isArray(folders);

    folders.forEach((folder: string) => {
      assert.isTrue(FileService.checkFileExists(folder));
    });

    assert.isNotNull(result.data);
    assert.isNotNull(result.data?.internalVersion);
    assert.notEqual(result.data?.internalVersion, "0");
  }); // .timeout(10000);

  it('2.2.1 => Update version list (Dragon)', async () => {
    // Because cache is enabled, we need to clean the cache created  by lastest tests
    CacheService.getInstance().cleanCache();

    let sourceFile: string = join(DragonService.getMainPath(), versionSourceFile);
    let fileDestination: string = DragonPath.dragonFilePath(DragonFileName.version);

    // Check if base version file exists
    let baseFileExists: boolean = FileService.checkFileExists(sourceFile);
    assert.isTrue(baseFileExists);

    if (baseFileExists) {
      // Prepare test tree
      let result: ReturnData<DragonVersion> = DragonService.prepareTree();
      assert.ok(result);

      // Copy base file
      FileService.copyFile(sourceFile, fileDestination);
      let destinationFileExists: boolean = FileService.checkFileExists(fileDestination);
      assert.isTrue(destinationFileExists);

      // Check for update
      result = await DragonService.getDragonVersion();
      assert.ok(result);
      assert.isDefined(result.data);
      assert.isTrue(result.data?.requiredUpdate)

    } else {
      assert.fail('BaseFile doesn\'t exists')
    }
  }); // .timeout(10000);

  it('2.3.1 => Download version and the list of champions (Dragon)', async () => {
    let versionData: ReturnData<DragonVersion> = await DragonService.getDragonVersion();
    assert.ok(versionData);
    assert.isNotNull(versionData.data);
    assert.isDefined(versionData.data);
    assert.isNotNull(versionData.data?.internalVersion);
    assert.notEqual(versionData.data?.internalVersion, "0");

    const championUrl: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, versionData.data!);
    const dragonChampionFileName = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.champion);

    DragonService.downloadDragonFile<IDragonChampion>(championUrl, DragonCulture.fr_fr, dragonChampionFileName, versionData.data!).then((championData => {
      assert.ok(championData);
      assert.isNotNull(championData);
      assert.isNotNull(championData.data);

      // Check tree
      let folders = new Array<string>();
      folders.push(DragonPath.dragonFilePath(DragonFileName.version));
      folders.push(dragonChampionFileName);

      assert.isNotNull(folders);
      assert.isArray(folders);

      // folders.forEach((folder: string) => {
      //   assert.isTrue(FileService.checkFileExists(folder), `Error on file : '${folder}'`);
      // });

    }));
  }).timeout(35000);

  it('2.3.2 => Download version and the list of champions several times (Dragon)', async () => {
    let versionData: ReturnData<DragonVersion> = await DragonService.getDragonVersion();
    assert.ok(versionData);
    assert.isNotNull(versionData.data);
    assert.isDefined(versionData.data);
    assert.isNotNull(versionData.data?.internalVersion);
    assert.notEqual(versionData.data?.internalVersion, "0");

    const championUrl: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, versionData.data!);
    const dragonChampionFileName = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.champion);

    //  ReturnData<IDragonChampion>   => DragonFile<DragonChampion[]
    let firstChampionData: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadDragonFile<DragonFile<DragonChampion[]>>(championUrl, DragonCulture.fr_fr, dragonChampionFileName, versionData.data!);
    let secondChampionData: ReturnData<DragonFile<DragonChampion[]>> = await DragonService.downloadDragonFile<DragonFile<DragonChampion[]>>(championUrl, DragonCulture.fr_fr, dragonChampionFileName, versionData.data!);

    // First validation
    assert.ok(firstChampionData);
    assert.isNotNull(firstChampionData);
    assert.isDefined(firstChampionData);
    assert.isNotNull(firstChampionData.data);
    assert.isDefined(firstChampionData.data);
    // expect(championData.data).to.not.be.null;
    // expect(championData.data).to.not.be.undefined;

    // Second validation
    assert.ok(secondChampionData);
    assert.isNotNull(secondChampionData);
    assert.isDefined(secondChampionData);
    assert.isNotNull(secondChampionData.data);
    assert.isDefined(secondChampionData.data);

    // Check tree pattern
    let folders = new Array<string>();
    folders.push(DragonPath.dragonFilePath(DragonFileName.version));
    folders.push(dragonChampionFileName);

    assert.isNotNull(folders);
    assert.isArray(folders);

  }).timeout(40000);


  it('3.0.0 => Get champion info in file by championId', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoById(99, DragonCulture.fr_fr);

    assert.ok(championInfo);
    assert.isNotNull(championInfo);
    assert.isDefined(championInfo);
    assert.equal(championInfo.key, "99");
    assert.equal(championInfo.id, "Lux");
    assert.equal(championInfo.name, "Lux");

  }).timeout(20000);

  it('3.0.1 => Get champion info by championId without specify a culture (default culture)', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoById(99, undefined);

    assert.ok(championInfo);
    assert.isNotNull(championInfo);
    assert.isDefined(championInfo);
    assert.equal(championInfo.key, "99");
    assert.equal(championInfo.id, "Lux");
    assert.equal(championInfo.name, "Lux");

  }).timeout(20000);

  it('3.0.2 => Get champion info in file by championName', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoByName("LUX", DragonCulture.fr_fr);

    assert.ok(championInfo);
    assert.isNotNull(championInfo);
    assert.isDefined(championInfo);
    assert.equal(championInfo.key, "99");
    assert.equal(championInfo.id, "Lux");
    assert.equal(championInfo.name, "Lux");

  }).timeout(20000);

  it('3.0.3 => Get champion info by championName without specify a culture (default culture)', async () => {
    const championInfo: DragonChampion = await DragonService.getChampionInfoByName("LUX", undefined);

    assert.ok(championInfo);
    assert.isNotNull(championInfo);
    assert.isDefined(championInfo);
    assert.equal(championInfo.key, "99");
    assert.equal(championInfo.id, "Lux");
    assert.equal(championInfo.name, "Lux");
  }).timeout(20000);


  it('3.1 => Get multi champions info', async () => {
    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoById(99, DragonCulture.fr_fr);
    assert.ok(firstChampionInfo);
    assert.isNotNull(firstChampionInfo);
    assert.isDefined(firstChampionInfo);
    assert.equal(firstChampionInfo.key, "99");

    const secondChampionInfo: DragonChampion = await DragonService.getChampionInfoById(69, DragonCulture.fr_fr)
    assert.ok(secondChampionInfo);
    assert.isNotNull(secondChampionInfo);
    assert.isDefined(secondChampionInfo);
    assert.equal(secondChampionInfo.key, "69");
    assert.equal(secondChampionInfo.id, "Cassiopeia");
    assert.equal(secondChampionInfo.name, "Cassiopeia");

  }).timeout(30000);

  // it('3.2 => Get champs in cache', async () => { 
  //   // let value: boolean = EnvVars.cache.enabled;
  //   // if (!value) {
  //   //   assert.fail('Cache is not enabled');
  //   // }
  //   // const firstChampionInfo: DragonChampion = await DragonService.getChampionInfoById(99, DragonCulture.fr_fr);
  //   // assert.ok(firstChampionInfo);
  //   // assert.isNotNull(firstChampionInfo);
  //   // console.log('After get first champ')
  //   let championId : string = "99";
  // 
  //   DragonService.getChampionInfoByName("LuX", DragonCulture.fr_fr).then((championInfo: DragonChampion) => {
  //     assert.ok(championInfo);
  //     assert.isNotNull(championInfo);
  //     assert.equal(championInfo.key, "99");
  //     assert.equal(championInfo.id, "Lux");
  //     assert.equal(championInfo.name, "Lux");
  //   });
  // 
  //   let championInfo: IDragonChampion | undefined;
  //   DragonService.getChampionInfoByName("Lux", DragonCulture.fr_fr).then((championInfo: IDragonChampion) => {
  //     assert.ok(championInfo);
  //     assert.isNotNull(championInfo);
  //     assert.equal(championInfo.key, "99");
  //     assert.equal(championInfo.id, "Lux");
  //     assert.equal(championInfo.name, "Lux");
  //   });
  // 
  // // DragonService.readDragonChampionFileByName(DragonCulture.fr_fr).then()
  // 
  //   // const championsCache = CacheName.DRAGON_CHAMPIONS_KEY_ID.replace('{0}', DragonCulture.fr_fr);
  //   // const cacheValue: Map<number, IDragonChampion> | undefined = CacheService.getInstance().getCache<Map<number, IDragonChampion>>(championsCache);
  //   // if (cacheValue != undefined) {
  //   //   let data: IDragonChampion = cacheValue.get(99)!;
  //   //   assert.ok(data);
  //   //   assert.equal(data.id, championId);
  //   // } else {
  //   //   assert.fail('Value isn\'t in cache.')
  //   // }
  // 
  // 
  // }).timeout(30000);


}); // END : 'Test DRAGON'