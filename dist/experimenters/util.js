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
exports.sleep = exports.zipArray = exports.arrayDirectProduct = exports.LINSPACE_EPS_SCALE = exports.linspace = void 0;
/**
 * If any of the parameter is NaN, the generated array will be [] or [stop].
 * @param start The starting value.
 * @param stop The stop value, always included.
 * @param step The step, the sign of which will be inverted if it does not match the sign of (stop - step).
 * @param includeStop If the stopping point should be included.
 * @param inclueStart If the starting point should be included.
 * @returns The array.
 */
var linspace = function (start, stop, step, includeStop, includeStart, eps) {
    if (includeStop === void 0) { includeStop = true; }
    if (includeStart === void 0) { includeStart = true; }
    if ((stop - start) * step <= 0)
        step = -step; // correct the sign of step
    var steps = Math.ceil((stop - start) / step);
    var arrayWithoutStop = includeStart ? (Array.from({ length: steps }, function (_, i) { return i; }).map(function (i) { return start + step * i; })) : (Array.from({ length: steps - 1 }, function (_, i) { return i + 1; }).map(function (i) { return start + step * i; }));
    if (!eps || !arrayWithoutStop.length)
        return includeStop ? __spreadArray(__spreadArray([], arrayWithoutStop, true), [stop], false) : arrayWithoutStop;
    else {
        if (Math.abs(arrayWithoutStop[arrayWithoutStop.length - 1] - stop) < eps) {
            return arrayWithoutStop;
        }
        else {
            return __spreadArray(__spreadArray([], arrayWithoutStop, true), [stop], false);
        }
    }
};
exports.linspace = linspace;
exports.LINSPACE_EPS_SCALE = 1e-6;
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