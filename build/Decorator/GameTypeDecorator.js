"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
// https://www.typescriptlang.org/docs/handbook/decorators.html
const formatMetadataKey = Symbol("gameType");
function gameType(target, propertyKey, parameterIndex) {
    let existingRequiredParameters = Reflect.getOwnMetadata(formatMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(formatMetadataKey, existingRequiredParameters, target, propertyKey);
}
// export function GameType(value: RiotGameType) {
//     console.log("GameType(): factory evaluated");
//     // _riotGameType: RiotGameType;
//     function gameType(type: RiotGameType) {
//         return Reflect.metadata(formatMetadataKey, type);
//       }
//       function getGameType(target: any, propertyKey: RiotGameType) {
//         return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
//       }
//     // return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     //     _riotGameType = value;
//     //     descriptor.
//     //   console.log("GameType(): called");
//     // };
// }
