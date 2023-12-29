//During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';
process.env.showTraceStack = 'false'

import { assert } from "chai";
import { describe } from "mocha";

import { FileService } from '../../src/service/FileService';
import { join } from "path";

describe('===> Test File Service', () => {
  const test_Folder: string = './_result/static/test';

  const test_FileName: string = '/shortStory.txt';
  const test_FileContent: string = 'Ceci est le contenu de mon fichier.';

  const test_JsonFileName: string = '/shortJson.json';
  const test_JsonFileContent: string = '{"msg": "Ceci est le contenu de mon fichier"}';

  const test_TextFilePath: string = join(test_Folder, test_FileName);
  const test_JsonFilePath: string = join(test_Folder, test_JsonFileName);


  beforeEach(() => {
    // runs once before the first test in this block
    FileService.removeFile(test_Folder);
  });

  afterEach(() => {
    // runs once before the first test in this block
    FileService.removeFile(test_Folder);
  });

  it('1.0 => Create test folder tree', (done) => {
    FileService.createFolder(test_Folder);
    let result: boolean = FileService.checkFileExists(test_Folder);

    assert.ok(result);
    assert.isNotNull(result);
    assert.isTrue(result);

    done();
  });

  it('1.1 => Create multiple test folder tree', (done) => {
    FileService.createFolder(test_Folder);
    let result: boolean = FileService.checkFileExists(test_Folder);

    // Test « File already exists »
    let secondReturn : string = FileService.createFolder(test_Folder);

    assert.ok(result);
    assert.isTrue(result);
    assert.isNotNull(result);

    assert.ok(secondReturn);
    assert.include(secondReturn, 'already exists');

    done();
  });

  it('1.2 => Try create folder with invalid name', (done) => {
    let result: string = FileService.createFolder('');

    assert.ok(result);
    assert.include(result, 'is null or empty');

    done();
  });

  it('1.3 => Create an empty test file', (done) => {
    let initialCheck: boolean = FileService.checkFileExists(test_TextFilePath);

    FileService.createFolder(test_Folder);
    FileService.writeFile(test_TextFilePath, '');
    let finalCheck: boolean = FileService.checkFileExists(test_TextFilePath);

    assert.isFalse(initialCheck);
    assert.notEqual(initialCheck, finalCheck)
    assert.isTrue(finalCheck);

    done();
  });

  it('1.4 => Create a new text file with content', (done) => {
    try {
      let initialCheck: boolean = FileService.checkFileExists(test_TextFilePath);

      FileService.createFolder(test_Folder);
      FileService.writeFile(test_TextFilePath, test_FileContent);
      let finalCheck: boolean = FileService.checkFileExists(test_TextFilePath);
  
      let content: string = FileService.readInternalTextFile(test_TextFilePath);
  
      assert.isFalse(initialCheck);
      assert.notEqual(initialCheck, finalCheck)
      assert.isTrue(finalCheck);
      assert.equal(content, test_FileContent);

      done();
    } catch (ex) {
      console.error(ex);
      assert.fail("Error on 1.4");
    }   
  });

  it('1.5 => Trying to write a new text file without filename', (done) => {
    let result: boolean = FileService.writeFile('', test_FileContent);

    assert.isFalse(result);
    done();
  });

  it('1.6 => Create a new JSON file with content', (done) => {
    let initialCheck: boolean = FileService.checkFileExists(test_JsonFilePath);

    FileService.createFolder(test_Folder);
    FileService.writeFile(test_JsonFilePath, JSON.parse(test_JsonFileContent));
    let finalCheck: boolean = FileService.checkFileExists(test_JsonFilePath);

    let content: any = FileService.readInternalJSONFile(test_JsonFilePath);

    assert.isFalse(initialCheck);
    assert.notEqual(initialCheck, finalCheck)

    assert.isTrue(finalCheck);
    assert.equal(content.msg, JSON.parse(test_JsonFileContent).msg);
    
    done();

  });

}); // END : 'Test FileService'