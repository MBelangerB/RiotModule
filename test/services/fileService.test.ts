// During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';
process.env.showTraceStack = 'false';

import { describe, expect } from '@jest/globals';
import { join } from 'path';
import { FileService } from '../../src/service/FileService.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const result: boolean = FileService.checkFileExists(test_Folder);

    expect(result).toBeTruthy();
    expect(result).not.toBeNull();
    expect(result).toBe(true);

    done();
  });

  it('1.1 => Create multiple test folder tree', (done) => {
    FileService.createFolder(test_Folder);
    const result: boolean = FileService.checkFileExists(test_Folder);

    // Test « File already exists »
    const secondReturn : string = FileService.createFolder(test_Folder);

    expect(result).toBeTruthy();
    expect(result).toBe(true);
    expect(result).not.toBeNull();

    expect(secondReturn).toBeTruthy();
    expect(secondReturn).toEqual(expect.stringContaining('already exists'));

    done();
  });

  it('1.2 => Try create folder with invalid name', (done) => {
    const result: string = FileService.createFolder('');

    expect(result).toBeTruthy();
    expect(result).toEqual(expect.stringContaining('is null or empty'));

    done();
  });

  it('1.3 => Create an empty test file', (done) => {
    const initialCheck: boolean = FileService.checkFileExists(test_TextFilePath);

    FileService.createFolder(test_Folder);
    FileService.writeFile(test_TextFilePath, '');
    const finalCheck: boolean = FileService.checkFileExists(test_TextFilePath);

    expect(initialCheck).toBeFalsy();
    expect(initialCheck).not.toEqual(finalCheck);
    expect(finalCheck).toBeTruthy();

    done();
  });

  it('1.4 => Create a new text file with content', (done) => {
    try {
      const initialCheck: boolean = FileService.checkFileExists(test_TextFilePath);

      FileService.createFolder(test_Folder);
      FileService.writeFile(test_TextFilePath, test_FileContent);
      const finalCheck: boolean = FileService.checkFileExists(test_TextFilePath);

      const content: string = FileService.readInternalTextFile(test_TextFilePath);

      expect(initialCheck).toBeFalsy();
      expect(initialCheck).not.toEqual(finalCheck);
      expect(finalCheck).toBeTruthy();
      expect(content).toEqual(test_FileContent);

      done();
    } catch (ex) {
      console.error(ex);
      throw new Error('Error on 1.4');
    }
  });

  it('1.5 => Trying to write a new text file without filename', (done) => {
    const result: boolean = FileService.writeFile('', test_FileContent);

    expect(result).toBeFalsy();
    done();
  });

  it('1.6 => Create a new JSON file with content', (done) => {
    const initialCheck: boolean = FileService.checkFileExists(test_JsonFilePath);

    FileService.createFolder(test_Folder);
    FileService.writeFile(test_JsonFilePath, JSON.parse(test_JsonFileContent));
    const finalCheck: boolean = FileService.checkFileExists(test_JsonFilePath);

    const content: any = FileService.readInternalJSONFile(test_JsonFilePath);

    expect(initialCheck).toBeFalsy();
    expect(initialCheck).not.toEqual(finalCheck);

    expect(finalCheck).toBeTruthy();
    expect(content.msg).toEqual(JSON.parse(test_JsonFileContent).msg);

    done();

  });

}); // END : 'Test FileService'