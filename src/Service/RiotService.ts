
import { AxiosError } from "axios";
import EnvVars from "../declaration/major/EnvVars";
import { RiotGameType } from "../declaration/enum";
import { ValidationService } from "./ValidationService";
import { RequestService } from "./RequestService";
import { ISummonerDTO } from "../entity/Summoner-v4/SummonerDTO";

// **** Variables **** //

// Errors
export const RiotLocalization = {
    unauth: 'Unauthorized',
    errInFunction: (functionName : string) => `An error occured in 'RiotService.${functionName}'.`,
} as const;

// **** Class  **** //
export abstract class RiotService {

    /**
     * Return a @type {ISummonerDTO}
     * @param summonerName SummonerName
     * @param region Region
     * @returns
     * @throws Error params is invalid
     */
    static async getRiotSummonerByName(summonerName: string, region: string) : Promise<ISummonerDTO> {
        const realRegion = ValidationService.convertToRealRegion(region);
        const summonerUrl = EnvVars.routes.summoner.v4.getBySummonerName.replace('{summonerName}', summonerName).replace('{region}', realRegion);

        let returnValue!: ISummonerDTO;

        await RequestService.callRiotAPI<ISummonerDTO>(summonerUrl, RiotGameType.LeagueOfLegend).then((result) => {
            returnValue = result;
        }).catch((err) => {
            console.error(exports.RiotServiceLocalization.errInFunction('getRiotSummonerByName'));
            if (err instanceof AxiosError) {
                console.error(err.message);
            }
            else if (err.response && err.response.data) {
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
            throw err;
        });

        return returnValue;
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    RiotLocalization,
    RiotService,
} as const;
