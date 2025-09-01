// import { IAccountDTO, ISummonerDTO, ITFT_SummonerDTO } from '@bedy90/riotentity';
// import { Validators } from '@bedy90/riotentity';

// // Create IAccount DTO
// const invalidAccount: IAccountDTO = {
//     gameName : 'test',
//     puuid: 'test',
//     tagLine: '#NA',
// };

// const validAccount: IAccountDTO = {
//     gameName: 'gameName',
//     puuid: 'pDxMtQ0DTUZAxSu3WZz9itOTPphTc-9b9uTIrQXsQGFXxhgnaIIhyfY9NEaoZZGdKD-qgYbMPK42jg',
//     tagLine: 'tag',
// };

// // AccountChecker
// let isAccount: boolean = false;
// isAccount = Validators.AccountValidator.validate(invalidAccount).success;
// console.log(isAccount);

// isAccount = Validators.AccountValidator.validate(validAccount).success;
// console.log(isAccount);

// // Create ISummonerDTO DTO
// const myObj2: ISummonerDTO = {
//     // accountId: 'test',
//     profileIconId: 1,
//     revisionDate: 1n,
//     // name: "test",
//     // id: 'test',
//     puuid: 'test',
//     summonerLevel: 10n,
// };

// // SummonerChecker
// let isSummoner: boolean = false;
// isSummoner = Validators.SummonerValidator.validate(myObj2).success;
// console.log(isSummoner);
