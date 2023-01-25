"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = exports.ValidationLocalization = void 0;
exports.ValidationLocalization = {
    unauth: 'Unauthorized',
    errParamsIsInvalid: (paramsName, region) => `The parameters '${paramsName}' with value '${region}' is invalid.`,
    errParamsIsMissing: (params) => `The parameter '${params}' is mandatory.`,
    errInFunction: (functionName) => `An error occured in "RiotService.${functionName}"`,
    errChampionNotExist: (list, championId) => `Cannot add ${championId} in ${list}. Champion doesn't exists, please try to update dragon file.`,
};
class ValidationService {
    static autorizedRegion = ['BR1', 'EUN1', 'EUW1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU'];
    static regionDataMapping = {
        // BR1
        'BR': 'BR1',
        'BR1': 'BR1',
        // EUN1
        'EUN': 'EUN1',
        'EUN1': 'EUN1',
        'EUNE': 'EUN1',
        // EUW1
        'EUW': 'EUW1',
        'EUW1': 'EUW1',
        // JP1
        'JP': 'JP1',
        'JP1': 'JP1',
        // KR
        'KR': 'KR',
        // LA1
        'LA1': 'LA1',
        'LA2': 'LA2',
        // NA1
        'NA': 'NA1',
        'NA1': 'NA1',
        // OC1
        'OC': 'OC1',
        'OC1': 'OC1',
        // TR1
        'TR': 'TR1',
        'TR1': 'TR1',
        // RU
        'RU': 'RU',
    };
    /**
     * Convert region parameters to riot region
     * @param region
     * @returns
     */
    static convertToRealRegion(region) {
        const realRegion = this.regionDataMapping[region.toUpperCase()];
        if (typeof region === 'undefined' || region.trim().length === 0) {
            throw new Error(exports.ValidationLocalization.errParamsIsMissing('region'));
        }
        else if (!this.autorizedRegion.includes(realRegion)) {
            throw new Error(exports.ValidationLocalization.errParamsIsInvalid('region', region));
        }
        else {
            return realRegion;
        }
    }
}
exports.ValidationService = ValidationService;
// **** Export default **** //
exports.default = {
    ValidationLocalization: exports.ValidationLocalization,
    ValidationService,
};
