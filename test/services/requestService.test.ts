// During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';
process.env.showTraceStack = 'false';

import { describe, expect } from '@jest/globals';
import { join } from 'path';
import { IAccountDTO, ISummonerDTO } from '@bedy90/riotentity';

import { EnvVars, RiotGameType } from '../../src/riotmodule.js';
import { RequestService } from '../../src/service/RequestService.js';
import { ValidationService } from '../../src/service/ValidationService.js';

import { VersionData } from '../../src/model/DragonModel.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('===> Test RequestService', () => {
    const test_Folder: string = './_result/static/test';
    const test_FileName: string = '/test.txt';
    const test_TextFilePath: string = join(test_Folder, test_FileName);

    const summonerName: string = 'Bedy90';

    // const puuid: string = 'CSclTcHvrAgLq5VStnEUCTCiVDY1hhJpcmlCS6gWt3nxwKSwNOSH-tdlSDzDuboeN4-p_RJWp2sGgQ';
    const gameName: string = 'Bedy90';
    const tagLine: string = 'NA1';

    beforeEach(() => {
        // runs once before the first test in this block
    });

    afterEach(() => {
        // runs once before the first test in this block
    });

    it('1.0 => (Riot call) Get Summoner info', async () => {
        // Call Riot API
        const realRegion: string = ValidationService.convertToRealRegion('NA');
        const summonerUrl: string = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

        try {
            const returnValue: ISummonerDTO = await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend);

            expect(returnValue).toBeTruthy();
            expect(returnValue).toBeDefined();

        } catch (error: any) {
            // Use case success
            //   assert.ok(error, 'In error use case');
            expect(error).toBeTruthy();
        }

    });

    it('1.2 => (Riot call) Get riot account info', async () => {
        // Call Riot API
        const realRegion: string = ValidationService.convertToRealRegion('NA');
        const globalRegion: string = ValidationService.convertToGlobalRegion(realRegion);
        const accountUrl = EnvVars.routes.account.v1.getRiotIdByGameNameAndTagLine.replace('{gameName}', gameName)
            .replace('{tagLine}', tagLine).replace('{globalRegion}', globalRegion);
        try {
            const returnValue: IAccountDTO = await RequestService.callRiotAPI<IAccountDTO>(accountUrl, RiotGameType.LeagueOfLegend);
            console.log(returnValue.puuid);

            expect(returnValue).toBeTruthy();
            expect(returnValue).toBeDefined();
            expect(returnValue.gameName).toBe(gameName);
            expect(returnValue.tagLine).toBe(tagLine);

        } catch (error: any) {
            // Use case success
            //   assert.ok(error, 'In error use case');
            expect(error).toBeTruthy();
        }

    });

    it('1.3 => (Riot call) Get TFT Summoner info without Token', async () => {
        // Call Riot API
        const realRegion: string = ValidationService.convertToRealRegion('NA'); // ToT0L@pin
        const summonerUrl: string = EnvVars.routes.tft_summoner.v1.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);
        const token: string = EnvVars.getToken(RiotGameType.TeamFightTactic);

        try {
            await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.TeamFightTactic);
        } catch (error: any) {
            expect(error).toBeTruthy();

            if (error.response.statusText === 'Forbidden') {
                expect(error.response.status).toBe(403);
            } else if (token === '') {
                expect(error.response.status).toBe(401);
            } else {
                expect(error.response.status).toBe(404);
            }
        }
    });

    // Return NULL
    // it('1.10 => (Riot call) Get text file', async () => {
    //   let returnValue: string = await RequestService.callRiotAPI<string>('https://www.dwsamplefiles.com/?dl_id=176', RiotGameType.Valorant);
    //
    //   expect(returnValue).toBeTruthy()
    //   expect(returnValue).not.toBeNull();
    // });

    // Get a HTML page. RiotCall try to casting in JSON.
    it('1.11 => (Riot call) Get text file - 404', async () => {
        try {
            await RequestService.callRiotAPI<string>('https://en.wikipedia.org/bedyapi', RiotGameType.Valorant);
        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error.response.status).toBe(404);
        }
    });

    it('2.0 => Get dragon version file', async () => {
        const returnValue: VersionData = new VersionData();
        returnValue.version = await RequestService.downloadExternalFile<string[]>(EnvVars.dragon.url.version);

        expect(returnValue).toBeTruthy();
        expect(returnValue).toBeDefined();
        expect(Array.isArray(returnValue.version)).toBe(true);
    });

    it('2.1 => Get text file - 404', async () => {
        try {
            await RequestService.downloadExternalFile<string>('https://www.dwsamplefiles.com/?dl_id=696');
        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error.response.status).toBe(404);
        }
    });

    // it('2.2 => Download the contents of a file via a remote URL.', async () => {
    //   let returnValue: string = await RequestService.downloadExternalFile<string>('https://www.samplefiles.org/?dl_id=176', "text", 'application/download');

    //   expect(returnValue).toBeTruthy()
    //   expect(returnValue).not.toBeNull();
    //  expect(returnValue).toBeDefined();
    // });

    it('3.0 => Try downlaod and write a file with a invalid URL. - 403', async () => {
        try {
            const invalidFileUrl: string = EnvVars.dragon.url.championIcon;
            const returnValue: string = await RequestService.downloadAndWriteFile<string>(invalidFileUrl, test_TextFilePath);

            throw new Error(returnValue);

        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error.response.status).toBe(403);
        }
    });

}); // END : 'Test RequestService'