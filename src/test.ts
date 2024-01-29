import { IAccountDTO, AccountChecker, ISummonerDTO, SummonerChecker } from '@bedy90/riotentity';

// Create IAccount DTO
let myObj: IAccountDTO = {
    gameName : "test",
    puuid: "test",
    tagLine: "#NA"
}

// AccountChecker
let isAccount: boolean = false;
isAccount = AccountChecker.isAccountDTO(myObj);

// Create ISummonerDTO DTO
let myObj2: ISummonerDTO = {
    accountId: "test",
    profileIconId: 1,
    revisionDate: 1,
    name: "test",
    id: "test",
    puuid: "test",
    summonerLevel: 10
}

// AccountChecker
let isSummoner: boolean = false;
isSummoner = SummonerChecker.isSummonerDTO(myObj2);
