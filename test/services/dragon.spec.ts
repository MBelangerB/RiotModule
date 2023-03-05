//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';

import { DragonService, ReturnData } from '../../src/index';
import { assert, expect } from "chai";
import { FileService } from '../../src/service/FileService';
import { DragonFileName, DragonPath } from '../../src/service/DragonService';
import { DragonCulture, DragonFileType } from '../../src/declaration/enum';
import { DragonChampion, DragonVersion, IDragonChampion, IDragonVersion, VersionData } from '../../src/model/DragonModel';
import { replaceAll } from '../../src/declaration/functions';
import { join, resolve } from 'path';
// import EnvVars from '../../src/declaration/major/EnvVars';

// let should = chai.should();
// require('dotenv').config();

// https://medium.com/nodejsmadeeasy/elegant-ways-to-pass-env-variables-to-mocha-test-cases-4486cb238bb1
// https://www.tabnine.com/code/javascript/functions/chai/Assertion/status
describe('===> Test DragonService', () => {

  const test_Folder: string = './_result/static/test';
  const defaultTestFileName: string = 'text.txt';
  const lastDragonVersion: string = "13.10.1";

  beforeEach(() => {
    // runs once before the first test in this block
    FileService.removeFile(DragonPath.dragonFolder);
    FileService.removeFile(test_Folder);
  });

  afterEach(() => {
    // runs once before the first test in this block
    // FileService.removeFile(DragonPath.dragonFolder);
    // FileService.removeFile(test_Folder);
  });


  it('1.0 => Get dragon default folder', (done) => {
    let result: string = DragonService.getDragonFullPath();
    console.info('Get DragonFullPath : ' + result);

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
    console.log('Data : ', result);

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
    console.log('=== START GET VERSION FILE ===');

    try {
      let textUrl: string = 'https://filesamples.com/samples/document/txt/sample3.txt';
      let fileName: string = 'sample.txt'

      FileService.createFolder(test_Folder);
      const test_TextFilePath: string = join(test_Folder, fileName);

      await DragonService.downloadAndWriteFile<string>(textUrl, test_TextFilePath).then((result: ReturnData<string>) => {
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
  });

  it('2.2 => Download version list (Dragon)', async () => {
    console.log('=== START GET VERSION FILE ===');

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
    console.log(result.data);

    console.log('=== END GET VERSION FILE ===\n\n');
  }); // .timeout(10000);

  it('2.3 => Download version and the list of champions (Dragon)', async () => {
    console.log('=== START GET CHAMPION FILE (with version) ===');

    let versionData: ReturnData<DragonVersion> = await DragonService.getDragonVersion();
    assert.ok(versionData);
    assert.isNotNull(versionData.data);
    assert.isNotNull(versionData.data?.internalVersion);
    assert.notEqual(versionData.data?.internalVersion, "0");

    const championUrl: string = DragonService.getFileUrl(DragonFileType.Champion, DragonCulture.fr_fr, versionData.data!);
    const dragonChampionFileName = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.champion);

    const championData = await DragonService.downloadDragonFile<IDragonChampion>(championUrl, DragonCulture.fr_fr, dragonChampionFileName, versionData.data!);

    assert.ok(championData);
    assert.isNotNull(championData);
    assert.isNotNull(championData.data);

    // Check tree
    let folders = new Array<string>();
    folders.push(DragonPath.dragonFilePath(DragonFileName.version));
    folders.push(dragonChampionFileName);

    assert.isNotNull(folders);
    assert.isArray(folders);

    folders.forEach((folder: string) => {
      assert.isTrue(FileService.checkFileExists(folder), `Error on file : '${folder}'`);
    });

    console.log('=== END GET CHAMPION FILE ===\n\n');
  }).timeout(30000);

  it('3.0 => Get champion info in file', async () => {
    console.log('=== START GET CHAMPION INFO ===');

    const championInfo: DragonChampion = await DragonService.getChampionInfo(99, DragonCulture.fr_fr)
    assert.ok(championInfo);
    assert.isNotNull(championInfo);
    assert.equal(championInfo.key, "99");
    assert.equal(championInfo.id, "Lux");
    assert.equal(championInfo.name, "Lux");

    console.log('=== END GET CHAMPION INFO ===');
  }).timeout(30000);

  it('3.1 => Get multi champions info', async () => {
    console.log('=== START GET CHAMPION INFO ===');

    const firstChampionInfo: DragonChampion = await DragonService.getChampionInfo(99, DragonCulture.fr_fr);
    assert.ok(firstChampionInfo);
    assert.isNotNull(firstChampionInfo);

    const cacheChampionInfo: DragonChampion = await DragonService.getChampionInfo(69, DragonCulture.fr_fr)
    assert.ok(cacheChampionInfo);
    assert.isNotNull(cacheChampionInfo);
    assert.equal(cacheChampionInfo.key, "69");
    assert.equal(cacheChampionInfo.id, "Cassiopeia");
    assert.equal(cacheChampionInfo.name, "Cassiopeia");

    console.log('=== END GET CHAMPION INFO ===');
  }).timeout(30000);

 
}); // END : 'Test DRAGON'