//During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';
process.env.showTraceStack = 'false'

// import * as dotenv from 'dotenv';
// dotenv.config();

import { assert } from "chai";
import { RequestService } from '../../src/service/RequestService';
import { ValidationService } from '../../src/service/ValidationService';
import { ISummonerDTO, RiotGameType } from "../../src";
import EnvVars from "../../src/declaration/major/EnvVars";
import { VersionData } from "../../src/model/DragonModel";
import { join } from "path";

describe('===> Test RequestService', () => {
  const test_Folder: string = './_result/static/test';
  const test_FileName: string = '/test.txt';
  const test_TextFilePath: string = join(test_Folder, test_FileName);

  const summonerName: string = "Bedy90";

  beforeEach(() => {
    // runs once before the first test in this block
  });

  afterEach(() => {
    // runs once before the first test in this block
  });

  it('1.0 => (Riot call) Get Summoner info', async () => {
    // Call Riot API
    const realRegion = ValidationService.convertToRealRegion('NA');
    const summonerUrl = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

    try {
      let returnValue: ISummonerDTO = await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend);

      assert.ok(returnValue);
      assert.equal(returnValue.name, summonerName)
    } catch (error: any) {
      assert.ok(error);
    }

  });

  it('1.1 => (Riot call) Get TFT Summoner info without Token', async () => {
    // Call Riot API
    const realRegion = ValidationService.convertToRealRegion('NA'); // ToT0L@pin
    const summonerUrl = EnvVars.routes.tft_summoner.v1.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);
    const token = EnvVars.getToken(RiotGameType.TeamFightTactic);

    try {
      await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.TeamFightTactic);
    } catch (error: any) {
      assert.ok(error);

      if (error.response.statusText == 'Forbidden') {
        assert.equal(error.response.status, 403);
      } else if (token == "") {
        assert.equal(error.response.status, 401);
      } else {
        assert.equal(error.response.status, 404);
      }
    }
  });

  it('1.2 => (Riot call) Get text file', async () => {
    let returnValue: string = await RequestService.callRiotAPI<string>('https://www.dwsamplefiles.com/?dl_id=176', RiotGameType.Valorant);

    assert.ok(returnValue);
    assert.isNotNull(returnValue);
  });

  it('1.3 => (Riot call) Get text file - 404', async () => {
    try {
      await RequestService.callRiotAPI<string>('https://en.wikipedia.org/bedyapi', RiotGameType.Valorant);
    } catch (error: any) {
      assert.ok(error);
      assert.equal(error.response.status, 404);
    }
  });

  it('2.0 => Get dragon version file', async () => {
    let returnValue: VersionData = new VersionData();
    returnValue.version = await RequestService.downloadExternalFile<string[]>(EnvVars.dragon.url.version);

    assert.ok(returnValue);
    assert.isArray(returnValue.version);
  });

  it('2.1 => Get text file - 404', async () => {
    try {
      await RequestService.downloadExternalFile<string>('https://www.dwsamplefiles.com/?dl_id=696');
    } catch (error: any) {
      assert.ok(error);
      assert.equal(error.response.status, 404);
    }
  });

  it('2.2 => Get text file', async () => {
    let returnValue: string = await RequestService.downloadExternalFile<string>('https://www.dwsamplefiles.com/?dl_id=176');

    assert.ok(returnValue);
    assert.isNotNull(returnValue);
  });

  it('3.0 => Downlaod and write error', async () => {
    try {
      let invalidFileUrl: string = EnvVars.dragon.url.championIcon;
      let returnValue: string = await RequestService.downloadAndWriteFile<string>(invalidFileUrl, test_TextFilePath);
    } catch (error: any) {
      assert.ok(error);
      assert.equal(error.response.status, 403);
    }
  });

}); // END : 'Test RequestService'