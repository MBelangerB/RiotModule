export interface IAccountDTO {
    puuid: string;
    /**
     * MinLength : 3
     * MaxLength : 16
     */
    gameName: string;
    /**
     * MinLength : 3
     * MaxLength : 5
     */
    tagLine: string;
}

// export class AccountDTO implements IAccountDTO {
//     puuid!: string;
//     gameName!: string;
//     tagLine!: string;
// }