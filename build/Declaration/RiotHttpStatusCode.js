"use strict";
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/**
 * This file was copied from here: https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiotHttpStatusCode = void 0;
/**
 * Hypertext Transfer Protocol (HTTP) response status codes.
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 */
var RiotHttpStatusCode;
(function (RiotHttpStatusCode) {
    /**
     * Standard response for successful HTTP requests.
     * The actual response will depend on the request method used.
     * In a GET request, the response will contain an entity corresponding to the requested resource.
     * In a POST request, the response will contain an entity describing or containing the result of the action.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["OK"] = 200] = "OK";
    /**
     * The server cannot or will not process the request due to an apparent client error
     * (e.g., malformed request syntax, too large size, invalid request message framing, or deceptive request routing).
     */
    RiotHttpStatusCode[RiotHttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet
     * been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the
     * requested resource. See Basic access authentication and Digest access authentication. 401 semantically means
     * "unauthenticated",i.e. the user does not have the necessary credentials.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    /**
     * The request was valid, but the server is refusing action.
     * The user might not have the necessary permissions for a resource.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * The requested resource could not be found but may be available in the future.
     * Subsequent requests by the client are permissible.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * A request method is not supported for the requested resource;
     * for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    /**
     * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    /**
     * The server timed out waiting for the request.
     * According to HTTP specifications:
     * "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."
     */
    RiotHttpStatusCode[RiotHttpStatusCode["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    /**
     * The request entity has a media type which the server or resource does not support.
     * For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    /**
     * The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    /**
     * A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * The server either does not recognize the request method, or it lacks the ability to fulfill the request.
     * Usually this implies future availability (e.g., a new feature of a web-service API).
     */
    RiotHttpStatusCode[RiotHttpStatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    /**
     * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * The server is currently unavailable (because it is overloaded or down for maintenance).
     * Generally, this is a temporary state.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
     */
    RiotHttpStatusCode[RiotHttpStatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(RiotHttpStatusCode = exports.RiotHttpStatusCode || (exports.RiotHttpStatusCode = {}));
exports.default = RiotHttpStatusCode;
