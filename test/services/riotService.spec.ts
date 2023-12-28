//During the test the env variable is set to test
process.env.dragonBaseFolder = './_result/static/dragon';
process.env.CacheEnabled = 'false';

import { assert, expect } from "chai";
import * as sinon from "sinon";
import EnvVars from "../../src/declaration/major/EnvVars";
import { RiotService, ValidationService } from "../../src";
import { IAccountDTO } from "../../src/entity/Account-v1/AccountDTO";
import { MockRiotRequest } from "../mock/MockRiotRequest";

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
    });

    afterEach(() => {
        // runs once before the first test in this block
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
                console.log(accountInfo);

                expect(getByPuuidStub.calledOnce).to.be.true;
                assert.ok(accountInfo);
                assert.isDefined(accountInfo);
                assert.equal(accountInfo.puuid, result.puuid);
                assert.equal(accountInfo.gameName, result.gameName);
                assert.equal(accountInfo.tagLine, result.tagLine);
            });

            getByPuuidStub.restore();

        } catch (error: any) {
            assert.fail(error);
        }

    }).timeout(3000);

    it('1.0.2 => (MOCK Riot call) Get AccountInfo by GameName and TagLine', async () => {
        try {
            let riotService: RiotService = new RiotService();
            let expectedResult: Promise<IAccountDTO> = MockRiotRequest.getAsyncRiotAccount();

            // Stub result
            const getByPuuidStub: any = await sinon.stub(riotService.AccountV1, "getByGameNameTagLine").returns(expectedResult);
            let result: IAccountDTO = await expectedResult;

            // Run test
            riotService.AccountV1.getByGameNameTagLine(gameName, tagLine, region).then((accountInfo: IAccountDTO) => {
                console.log(accountInfo);

                expect(getByPuuidStub.calledOnce).to.be.true;
                assert.ok(accountInfo);
                assert.isDefined(accountInfo);
                assert.equal(accountInfo.puuid, result.puuid);
                assert.equal(accountInfo.gameName, result.gameName);
                assert.equal(accountInfo.tagLine, result.tagLine);
            });

            getByPuuidStub.restore();

        } catch (error: any) {
            assert.fail(error);
        }

    }).timeout(3000);



}); // End describe RiotService
