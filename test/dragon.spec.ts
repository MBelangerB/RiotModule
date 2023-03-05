//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';

import { DragonService, ReturnData } from '../src/index';
import { assert } from "chai";
import { FileService } from '../src/service/FileService';
import { DragonFileName, DragonPath } from '../src/service/DragonService';
import { DragonCulture, DragonFile } from '../src/declaration/enum';
import { DragonVersion, IDragonChampion } from '../src/model/DragonModel';

// let should = chai.should();
// require('dotenv').config();

// https://medium.com/nodejsmadeeasy/elegant-ways-to-pass-env-variables-to-mocha-test-cases-4486cb238bb1
// https://www.tabnine.com/code/javascript/functions/chai/Assertion/status
describe('==> Test DRAGON <==', () => {

  beforeEach(() => {
    // runs once before the first test in this block
    console.log('beforeEach : Remove dragon path.');
    FileService.removeFile(DragonPath.dragonFolder);
  });

  afterEach(() => {
    // runs once before the first test in this block
    console.log('afterEach : Remove dragon path.');
    FileService.removeFile(DragonPath.dragonFolder);
  });

  it('Create dragon folder tree', (done) => {
    console.log('=== START PREPARE TREE ===');
    DragonService.prepareTree().then((result: ReturnData<DragonVersion>) => {
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
    console.log('=== END PREPARE TREE ===\n\n');
  });

  it('Download version list (Dragon)', (done) => {
    console.log('=== START GET VERSION FILE ===');
    DragonService.getDragonVersion().then((result: ReturnData<DragonVersion>) => {
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

      done();

    }).catch((ex) => {
      console.log(ex);
      done();
    });
    console.log('=== END GET VERSION FILE ===\n\n');
  }); // .timeout(10000);

  it('Download the list of champions (Dragon)', (done) => {
    console.log('=== START GET CHAMPION FILE (with version) ===');

    DragonService.getDragonVersion().then((versionData: ReturnData<DragonVersion>) => {
      assert.ok(versionData);
      assert.ok(versionData.data);

      assert.isNotNull(versionData.data);
      assert.isNotNull(versionData.data?.internalVersion);
      assert.notEqual(versionData.data?.internalVersion, "0");

      const championUrl: string = DragonService.getFileUrl(DragonFile.Champion, DragonCulture.fr_fr, versionData.data!);
      DragonService.downloadDragonFile<IDragonChampion>(championUrl, DragonCulture.fr_fr, versionData.data!)?.then((content: ReturnData<IDragonChampion>) => {
        assert.ok(content);
        assert.isNotNull(content);
        assert.isNotNull(content.data);

        // Check tree
        const dragonChampionFileName: string = DragonPath.dragonCulturePath(DragonCulture.fr_fr, DragonFileName.champion);
        let folders = new Array<string>();
        folders.push(DragonPath.dragonFolder);
        folders.push(DragonService.getDragonFullPath(DragonCulture.fr_fr));
        folders.push(DragonService.getDragonFullPath(DragonCulture.en_us));
        folders.push(DragonPath.dragonFilePath(DragonFileName.version));
        folders.push(dragonChampionFileName);

        assert.isNotNull(folders);
        assert.isArray(folders);
  
        folders.forEach((folder: string) => {
          assert.isTrue(FileService.checkFileExists(folder), `Error on file : '${folder}'`);
        });
        // TODO: Problem « The file 'D:\Source\BedyRiotModule\RiotModule\_result\static\dragon\fr_FR\champion.json' has been created or updated. »
        //  show after complete test
        done();
      }).catch((ex) => {
        console.error(ex);
        done();
      });

      // done();
    });
    console.log('=== END GET CHAMPION FILEE ===\n\n');
  }).timeout(15000); 

}); // END : 'Test DRAGON'