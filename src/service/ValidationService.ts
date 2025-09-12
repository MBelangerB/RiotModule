import { RegionData } from '../declaration/types.js';

// **** Variables **** //

// Errors
export const ValidationLocalization = {
    errParamsIsInvalid: (paramsName: string, value: string) => `The parameters '${paramsName}' with value '${value}' is invalid.`,
    errParamsIsMissing: (params: string) => `The parameter '${params}' is mandatory.`,
} as const;

// **** Class  **** //
export abstract class ValidationService {
    // https://developer.riotgames.com/docs/lol

    // PLATFORM REGION
    static autorizedRegion: string[] = ['BR1', 'EUN1', 'EUW1', 'JP1', 'KR', 'LA1', 'LA2', 'ME1', 'NA1', 'OC1', 'RU', 'SG2', 'TR1', 'TW2', 'VN2'];

    // Regional region
    static globalRegion: string[] = ['AMERICAS', 'ASIA', 'EUROPE', 'SEA'];

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
    } as const;

    static globalRegionDataMapping: RegionData = {
        // -----------
        // AMERICAS
        // -----------
        // BR1
        'BR': 'americas',
        'BR1': 'americas',
        // LA1
        'LA1': 'americas',
        'LA2': 'americas',
        // NA1
        'NA': 'americas',
        'NA1': 'americas',

        // -----------
        // EUROPE
        // -----------
        // EUN1
        'EUN': 'europe',
        'EUN1': 'europe',
        'EUNE': 'europe',
        // EUW1
        'EUW': 'europe',
        'EUW1': 'europe',
        // TR1
        'TR': 'europe',
        'TR1': 'europe',
        // RU
        'RU': 'europe',

        // -----------
        // ASIA
        // -----------
        // JP
        'JP': 'asia',
        'JP1': 'asia',
        // KR
        'KR': 'asia',

        // -----------
        // SEA
        // -----------
        'OC': 'sea',
        'OC1': 'sea',
        'PH2': 'sea',
        'SG2': 'sea',
        'TH2': 'sea',
        'TW2': 'sea',
        'VN2': 'sea',
    };

    /**
     * Convert region parameters to riot region
     * @param region
     * @returns
     */
    static convertToRealRegion(region: string): string {
        region = region.trim().toUpperCase();
        if (typeof region === 'undefined' || region.trim().length === 0) {
            throw new Error(ValidationLocalization.errParamsIsMissing('region'));

        } else if (region in this.regionDataMapping) {
            return this.regionDataMapping[region.toUpperCase()];

        } else {
            throw new Error(ValidationLocalization.errParamsIsInvalid('region', region));
        }
    }

    /**
     * Convert the region to global region
     * @param region Riot Region
     */
    static convertToGlobalRegion(region: string): string {
        // https://darkintaqt.com/blog/routing
        region = region.trim().toUpperCase();
        if (typeof region === 'undefined' || region.trim().length === 0) {
            throw new Error(ValidationLocalization.errParamsIsMissing('region'));

        } else if (region in this.globalRegionDataMapping) {
            return this.globalRegionDataMapping[region.toUpperCase()];

        } else {
            throw new Error(ValidationLocalization.errParamsIsInvalid('region', region));
        }
    }

}

// **** Functions **** //

// **** Export default **** //

export default {
    ValidationLocalization,
    ValidationService,
} as const;
