"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.zipArray = exports.arrayDirectProduct = exports.linspace = void 0;
/**
 * If any of the parameter is NaN, the generated array will be [stop].
 * @param start The starting value.
 * @param stop The stop value, always included.
 * @param step The step, the sign of which will be inverted if it does not match the sign of (stop - step).
 * @returns The array.
 */
var linspace = function (start, stop, step) {
    if ((stop - start) * step <= 0)
        step = -step; // correct the sign of step
    var steps = Math.ceil((stop - start) / step);
    return __spreadArray(__spreadArray([], Array.from({ length: steps }, function (_, i) { return i; }).map(function (i) { return start + step * i; }), true), [stop], false);
};
exports.linspace = linspace;
var arrayDirectProduct = function (array1, array2) {
    return [
        Array(array2.length).fill(array1).reduce(function (x, y) { return x.concat(y); }),
        Array(array1.length).fill(array2).reduce(function (x, y) { return x.concat(y); })
    ];
};
exports.arrayDirectProduct = arrayDirectProduct;
var zipArray = function (array1, array2) {
    return array1.map(function (x1, i) { return [x1, array2[i]]; });
};
exports.zipArray = zipArray;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
//# sourceMappingURL=util.js.map