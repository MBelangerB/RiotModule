import { describe, expect, test } from '@jest/globals';
import { ValidationService } from '../../src/service/ValidationService.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('===> Test ValidationService', () => {

    test('1.0 => Convert REGION to official PLATFORM REGION', (done) => {
        const testRegion: string[] = ['NA', 'EUW', 'EUNE', 'JP', 'KR', 'LA1', 'LA2', 'OC', 'TR', 'RU'];

        testRegion.forEach(region => {
            const realRegion: string = ValidationService.convertToRealRegion(region);
            const mappingRegion: string = ValidationService.regionDataMapping[region.toUpperCase()];

            expect(realRegion).toBeTruthy();
            expect(mappingRegion).toBeTruthy();
            expect(realRegion).not.toBeNull();
            expect(mappingRegion).not.toBeNull();

            expect(realRegion).toEqual(mappingRegion);
        });

        done();
    }, 10000);

    test('1.1 => Convert REGION to official GLOBAL REGION', (done) => {
        const testRegion: string[] = ['NA', 'EUW', 'EUNE', 'JP', 'KR', 'LA1', 'LA2', 'OC', 'TR', 'RU'];

        testRegion.forEach(region => {
            const platformRegion: string = ValidationService.convertToRealRegion(region);
            const globalRegion: string = ValidationService.convertToGlobalRegion(platformRegion);

            const mappingRegion: string = ValidationService.globalRegionDataMapping[platformRegion.toUpperCase()];

            expect(platformRegion).toBeTruthy();
            expect(globalRegion).toBeTruthy();
            expect(mappingRegion).toBeTruthy();

            expect(platformRegion).not.toBeNull();
            expect(globalRegion).not.toBeNull();
            expect(mappingRegion).not.toBeNull();

            expect(globalRegion).toEqual(mappingRegion);
        });

        done();
    }, 10000);

    test('1.1.1 => Try convert REGION to official PLATFORM REGION with invalid input', (done) => {
        try {
            const returnData: string = ValidationService.convertToRealRegion('NA2');

            // assert.fail(returnData);
            throw new Error(returnData);

        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error).not.toBeNull();
            expect(error.message).not.toBeNull();
            expect(error.message).toContain('is invalid.');
        }

        done();
    });

    test('1.1.2 => Try convert REGION to official PLATFORM REGION with empty input', (done) => {
        try {
            ValidationService.convertToRealRegion('');

        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error).not.toBeNull();
            expect(error.message).toContain('is mandatory.');
        }

        done();
    });

    test('1.2.1 => Convert REGION to official GLOBAL REGION', (done) => {
        try {
            const globalRegion: string = ValidationService.convertToGlobalRegion('NA2');

            // assert.fail(globalRegion);
            throw new Error(globalRegion);

        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error).not.toBeNull();
            expect(error.message).not.toBeNull();
            expect(error.message).toContain('is invalid.');;
        }

        done();
    }, 10000);

    test('1.2.2 => Try convert REGION to official GLOBAL REGION with empty input', (done) => {
        try {
            ValidationService.convertToGlobalRegion('');

        } catch (error: any) {
            expect(error).toBeTruthy();
            expect(error).not.toBeNull();
            expect(error.message).toContain('is mandatory.');
        }

        done();
    });

}); // END : 'Test ValidationService'
