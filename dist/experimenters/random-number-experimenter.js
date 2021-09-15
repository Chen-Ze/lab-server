"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.randomNumberExperimenter = void 0;
var experiment_executer_1 = require("./experiment-executer");
var getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};
var randomNumberExperimenter = function (recipe, subsequence, onData, onHalt, controller) { return __awaiter(void 0, void 0, void 0, function () {
    var haltFlag, unsubscribe, publicRows, _loop_1, i, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                haltFlag = false;
                unsubscribe = onHalt.subscribe(function () { return haltFlag = true; });
                publicRows = [];
                _loop_1 = function (i) {
                    var rawRow, _i, subsequence_1, subrecipe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (haltFlag)
                                    return [2 /*return*/, "break"];
                                rawRow = Object.fromEntries(__spreadArray(__spreadArray([], recipe.generators.map(function (generator) {
                                    return [generator.name, getRandomArbitrary(Number(generator.min), Number(generator.max))];
                                }), true), recipe.generators.map(function (generator) {
                                    return [generator.name + '[]', getRandomArbitrary(Number(generator.min), Number(generator.max))];
                                }), true));
                                if (recipe.privateExports.length)
                                    onData(Object.fromEntries(recipe.privateExports.map(function (_a) {
                                        var name = _a.name, column = _a.column;
                                        return [column, rawRow[name]];
                                    })));
                                if (recipe.publicExports.length)
                                    publicRows.push(Object.fromEntries(recipe.publicExports.map(function (_a) {
                                        var name = _a.name, column = _a.column;
                                        return [column, rawRow[name]];
                                    })));
                                _i = 0, subsequence_1 = subsequence;
                                _b.label = 1;
                            case 1:
                                if (!(_i < subsequence_1.length)) return [3 /*break*/, 4];
                                subrecipe = subsequence_1[_i];
                                if (haltFlag)
                                    return [3 /*break*/, 4];
                                return [4 /*yield*/, (0, experiment_executer_1.experimentExecuter)(subrecipe, onData, onHalt, controller)];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                            case 5:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < Number(recipe.count))) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                state_1 = _a.sent();
                if (state_1 === "break")
                    return [3 /*break*/, 4];
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                publicRows.forEach(function (row) { return onData(row); });
                unsubscribe();
                return [2 /*return*/];
        }
    });
}); };
exports.randomNumberExperimenter = randomNumberExperimenter;
//# sourceMappingURL=random-number-experimenter.js.map