"use strict";
// my-app.js, treated as an ES module because there is a package.json
// file in the same folder with "type": "module".
// import './startup/init.js';
// import MathCalc from './calc';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummonerDTO = exports.RiotGameType = exports.EnvVars = void 0;
const ValidationService_1 = __importDefault(require("./Service/ValidationService"));
const EnvVars_1 = __importDefault(require("./Declaration/major/EnvVars"));
exports.EnvVars = EnvVars_1.default;
const enum_1 = require("./Declaration/enum");
Object.defineProperty(exports, "RiotGameType", { enumerable: true, get: function () { return enum_1.RiotGameType; } });
const RiotService_1 = require("./Service/RiotService");
const SummonerDTO_1 = require("./Entity/Summoner-v4/SummonerDTO");
Object.defineProperty(exports, "SummonerDTO", { enumerable: true, get: function () { return SummonerDTO_1.SummonerDTO; } });
// abstract class BedyRiot {
//     SummonerDTO: ISummonerDTO;
// }
// export default BedyRiot;
exports.default = {
    ValidationService: ValidationService_1.default,
    RiotService: RiotService_1.RiotService,
};
module.exports = {
    ValidationService: ValidationService_1.default,
    RiotService: RiotService_1.RiotService,
    SummonerDTO: SummonerDTO_1.SummonerDTO
    // getRiotSummonerByName : (summonerName: string, region: string) => RiotService.getRiotSummonerByName(summonerName, region)
};
// export default {
//     ValidationService,
//     EnvVars,
//     RiotGameType,
//     RiotService,
// }
// const bedyAPI = {
//     RiotService,
//     Entity: {
//       summonerDTO: SummonerDTO,
//     },
//   };
// export.bedyAPI = bedyAPI;
// module.exports.RiotService = RiotService;
// module.exports.Entity = {
//     SummonerDTO: ISummonerDTO
// }
// console.log('Index')
// // Loaded as ES module since ./startup contains no package.json file,
// // and therefore inherits the "type" value from one level up.
// import 'commonjs-package';
// // Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// // lacks a "type" field or contains "type": "commonjs".
// import './node_modules/commonjs-package/index.js';
// // Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// // lacks a "type" field or contains "type": "commonjs".
