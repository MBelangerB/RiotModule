"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracking = exports.State = void 0;
// https://howtodoinjava.com/typescript/maps/
var State;
(function (State) {
    /**
     * DISABLED - not visible and not calculated
     */
    State[State["DISABLED"] = 0] = "DISABLED";
    /**
     *  HIDDEN - not visible, but calculated,
     */
    State[State["HIDDEN"] = 1] = "HIDDEN";
    /**
     * ENABLED - visible and calculated,
     */
    State[State["ENABLED"] = 2] = "ENABLED";
    /**
     * ARCHIVED - visible, but not calculated
     */
    State[State["ARCHIVED"] = 3] = "ARCHIVED";
})(State = exports.State || (exports.State = {}));
var Tracking;
(function (Tracking) {
    /**
     * LIFETIME - stats are incremented without reset
     */
    Tracking[Tracking["LIFETIME"] = 0] = "LIFETIME";
    /**
     * SEASON - stats are accumulated by season and reset at the beginning of new season
     */
    Tracking[Tracking["SEASON"] = 1] = "SEASON";
})(Tracking = exports.Tracking || (exports.Tracking = {}));
