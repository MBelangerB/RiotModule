// **** Variables **** //

// Errors
export const CacheLocalization = {
    unauth: 'Unauthorized',
} as const;

// **** Class  **** //
export abstract class CacheService {

}

// **** Functions **** //

// **** Export default **** //

export default {
    CacheLocalization,
    CacheService,
} as const;
