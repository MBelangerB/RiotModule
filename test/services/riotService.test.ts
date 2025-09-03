//During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';

import { describe, expect, test } from '@jest/globals';
import * as sinon from "sinon";
import { IAccountDTO } from "@bedy90/riotentity";

// import EnvVars from "../../src/declaration/major/EnvVars.js";
import { DragonCulture, RiotService, Rotation, ValidationService } from "../../src/riotmodule.js";
import { MockRiotRequest } from "../mock/MockRiotRequest.js";
import { FileService } from '../../src/service/FileService.js';
import { DragonPath } from '../../src/service/DragonService.js';

// import * from "sinon";
// export { RiotService, ChampionV3, ChampionMasteryV4, LeagueV4, SummonerV4 } from '../../src/service/RiotService';


describe('===> Test RiotService', () => {

    // Variables
    const puuid: string = "CSclTcHvrAgLq5VStnEUCTCiVDY1hhJpcmlCS6gWt3nxwKSwNOSH-tdlSDzDuboeN4-p_RJWp2sGgQ";
    const region: string = "NA1";
    const gameName: string = "Bedy Tester";
    const tagLine: string = "Test"

    // Each call
    beforeEach(() => {
        // runs once before the first test in this block
        FileService.removeFile(DragonPath.dragonFolder);
    });

    afterEach(() => {
        // runs once before the first test in this block
        FileService.removeFile(DragonPath.dragonFolder);
    });

    // Scenario
    it('1.0.1 => (MOCK Riot call) Get AccountInfo by PUUID', async () => {
        try {
            let riotService: RiotService = new RiotService();
            let expectedResult: Promise<IAccountDTO> = MockRiotRequest.getAsyncRiotAccount();

            // Stub result
            const getByPuuidStub: any = await sinon.stub(riotService.AccountV1, "getByPuuid").returns(expectedResult);
            let result: IAccountDTO = await expectedResult;

            // Run test
            riotService.AccountV1.getByPuuid(puuid, region).then((accountInfo: IAccountDTO) => {
                // console.log(accountInfo);

                expect(getByPuuidStub.calledOnce).toBe(true);

                // Vérifie que accountInfo est défini et truthy
                expect(accountInfo).toBeTruthy();
                expect(accountInfo).toBeDefined();

                // Vérifie l'égalité des propriétés
                expect(accountInfo.puuid).toBe(result.puuid);
                expect(accountInfo.gameName).toBe(result.gameName);
                expect(accountInfo.tagLine).toBe(result.tagLine);
            });

            getByPuuidStub.restore();

        } catch (error: any) {
            throw new Error(error);

        }

    }, 3000);

    it('1.0.2 => (MOCK Riot call) Get AccountInfo by GameName and TagLine', async () => {
        try {
            let riotService: RiotService = new RiotService();
            let expectedResult: Promise<IAccountDTO> = MockRiotRequest.getAsyncRiotAccount();

            // Stub result
            const getByPuuidStub: any = await sinon.stub(riotService.AccountV1, "getByGameNameTagLine").returns(expectedResult);
            let result: IAccountDTO = await expectedResult;

            // Run test
            riotService.AccountV1.getByGameNameTagLine(gameName, tagLine, region).then((accountInfo: IAccountDTO) => {
                // console.log(accountInfo);

                // Vérifie que la fonction getByPuuidStub a été appelée une fois (utilisation sinon ou jest.fn())
                expect(getByPuuidStub.calledOnce).toBe(true);

                // Vérifie que accountInfo est défini et truthy
                expect(accountInfo).toBeTruthy();
                expect(accountInfo).toBeDefined();

                // Vérifie l'égalité des propriétés
                expect(accountInfo.puuid).toBe(result.puuid);
                expect(accountInfo.gameName).toBe(result.gameName);
                expect(accountInfo.tagLine).toBe(result.tagLine);
            });

            getByPuuidStub.restore();

        } catch (error: any) {
            throw new Error(error);
        }

    }, 3000);

    it('1.1.1 => Get current rotation', async () => {
        // Call Riot API
        const realRegion: string = ValidationService.convertToRealRegion('NA');
        let riotService: RiotService = new RiotService();

        try {
            // Run test
            await riotService.ChampionV3.getChampionRotations(realRegion, {
                culture: DragonCulture.fr_fr,
                showChampionName: true,
                showSquare: true,
                showLoadingScreen: true,
                getSkins: true,
            }).then((rotateInfo: Rotation) => {
                // console.log(rotateInfo);

                expect(rotateInfo).toBeTruthy();
                expect(rotateInfo).toBeDefined();
                expect(rotateInfo).not.toBeNull();
                expect(Array.isArray(rotateInfo.freeChampionIds)).toBe(true);
                expect(Array.isArray(rotateInfo.freeChampionIdsForNewPlayers)).toBe(true);
                expect(rotateInfo.freeChampionIds[0].skins).toBeDefined();
                
                expect(rotateInfo).toBeTruthy();
            });
        } catch (error: any) {
            // Use case success
            // assert.ok(error, 'In error use case');
            expect(error).toBeTruthy();
        }


    }, 20000);


}); // End describe RiotService
