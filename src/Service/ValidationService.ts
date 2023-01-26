import { RegionData } from '../declaration/types';

// **** Variables **** //

// Errors
export const ValidationLocalization = {
    unauth: 'Unauthorized',
    errParamsIsInvalid: (paramsName: string, region: string) => `The parameters '${paramsName}' with value '${region}' is invalid.`,
    errParamsIsMissing: (params: string) => `The parameter '${params}' is mandatory.`,
} as const;

// **** Class  **** //
export abstract class ValidationService {
    static autorizedRegion: string[] = ['BR1', 'EUN1', 'EUW1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU'];

    static regionDataMapping: RegionData = {
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
    static convertToRealRegion(region: string) {
        const realRegion = this.regionDataMapping[region.toUpperCase()];
        if (typeof region === 'undefined' || region.trim().length === 0) {
            throw new Error(ValidationLocalization.errParamsIsMissing('region'));
        }
        else if (!this.autorizedRegion.includes(realRegion)) {
            throw new Error(ValidationLocalization.errParamsIsInvalid('region', region));
        }
        else {
            return realRegion;
        }
    }
}

// **** Functions **** //

// **** Export default **** //

export default {
    ValidationLocalization,
    ValidationService,
} as const;
