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
Object.defineProperty(exports, "__esModule", { value: true });
exports.keithley2600SimpleExperimenter = void 0;
var smu_recipe_1 = require("material-science-experiment-recipes/lib/keithley-simple/smu-recipe");
var experiment_executer_1 = require("./experiment-executer");
var keithley_smu_1 = require("./keithley-smu");
var util_1 = require("./util");
var keithley2600SimpleExperimenter = function (recipe, subsequence, onData, onHalt, controller) { return __awaiter(void 0, void 0, void 0, function () {
    var haltFlag, unsubscribe, publicRows, smuAArray, smuBArray, _a, smuAArrayProducted, smuBArrayProducted, smuArrayZipped, _i, smuArrayZipped_1, smuSubArray, _loop_1, _b, smuSubArray_1, smuPair, state_1, _c, subsequence_1, subrecipe;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                haltFlag = false;
                unsubscribe = onHalt.subscribe(function () { return haltFlag = true; });
                publicRows = [];
                if ((0, smu_recipe_1.isSweepChannelRecipe)(recipe.smuARecipe) && !Number(recipe.smuARecipe.step)) {
                    recipe.smuARecipe.step = recipe.smuARecipe.interval;
                }
                if ((0, smu_recipe_1.isSweepChannelRecipe)(recipe.smuBRecipe) && !Number(recipe.smuBRecipe.step)) {
                    recipe.smuBRecipe.step = recipe.smuBRecipe.interval;
                }
                smuAArray = (0, keithley_smu_1.smuRecipeToArray)(recipe.smuARecipe);
                smuBArray = (0, keithley_smu_1.smuRecipeToArray)(recipe.smuBRecipe);
                _a = (0, util_1.arrayDirectProduct)(smuAArray, smuBArray), smuAArrayProducted = _a[0], smuBArrayProducted = _a[1];
                smuArrayZipped = (0, util_1.zipArray)(smuAArrayProducted, smuBArrayProducted).map(function (_a) {
                    var subarray1 = _a[0], subarray2 = _a[1];
                    return util_1.zipArray.apply(void 0, (0, util_1.arrayDirectProduct)(subarray1, subarray2));
                });
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-integration-time",
                        value: recipe.integrationTime
                    })];
            case 1:
                _d.sent();
                if (!(0, smu_recipe_1.isOffChannelRecipe)(recipe.smuARecipe)) return [3 /*break*/, 3];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smua-off",
                        value: recipe.integrationTime
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                if (!(0, smu_recipe_1.isOffChannelRecipe)(recipe.smuBRecipe)) return [3 /*break*/, 5];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smub-off",
                        value: recipe.integrationTime
                    })];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                if (!Number(recipe.smuARecipe.compliance)) return [3 /*break*/, 9];
                if (!(recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 7];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smua-current-compliance",
                        value: recipe.smuARecipe.compliance
                    })];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                if (!(recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 9];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smua-voltage-compliance",
                        value: recipe.smuARecipe.compliance
                    })];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9:
                if (!Number(recipe.smuBRecipe.compliance)) return [3 /*break*/, 13];
                if (!(recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 11];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smub-current-compliance",
                        value: recipe.smuBRecipe.compliance
                    })];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                if (!(recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 13];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smub-voltage-compliance",
                        value: recipe.smuBRecipe.compliance
                    })];
            case 12:
                _d.sent();
                _d.label = 13;
            case 13:
                _i = 0, smuArrayZipped_1 = smuArrayZipped;
                _d.label = 14;
            case 14:
                if (!(_i < smuArrayZipped_1.length)) return [3 /*break*/, 23];
                smuSubArray = smuArrayZipped_1[_i];
                if (haltFlag)
                    return [3 /*break*/, 23];
                _loop_1 = function (smuPair) {
                    var measurement, _e, _f, _g, _h, _j, _k, _l, _m, publicMeasurement;
                    var _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                if (haltFlag)
                                    return [2 /*return*/, "break"];
                                if (!(recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 2];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "set-smua-voltage",
                                        value: String(smuPair[0])
                                    })];
                            case 1:
                                _p.sent();
                                _p.label = 2;
                            case 2:
                                if (!(recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuARecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 4];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "set-smua-current",
                                        value: String(smuPair[0])
                                    })];
                            case 3:
                                _p.sent();
                                _p.label = 4;
                            case 4:
                                if (!(recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 6];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "set-smub-voltage",
                                        value: String(smuPair[1])
                                    })];
                            case 5:
                                _p.sent();
                                _p.label = 6;
                            case 6:
                                if (!(recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuBRecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 8];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "set-smub-current",
                                        value: String(smuPair[1])
                                    })];
                            case 7:
                                _p.sent();
                                _p.label = 8;
                            case 8: return [4 /*yield*/, (0, util_1.sleep)(Number(recipe.wait))];
                            case 9:
                                _p.sent();
                                _o = {};
                                _e = "SMU A Voltage";
                                _f = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "measure-smua-voltage",
                                    })];
                            case 10:
                                _o[_e] = _f.apply(void 0, [(_p.sent()).read]);
                                _g = "SMU A Current";
                                _h = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "measure-smua-current",
                                    })];
                            case 11:
                                _o[_g] = _h.apply(void 0, [(_p.sent()).read]);
                                _j = "SMU B Voltage";
                                _k = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "measure-smub-voltage",
                                    })];
                            case 12:
                                _o[_j] = _k.apply(void 0, [(_p.sent()).read]);
                                _l = "SMU B Current";
                                _m = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                                        task: "measure-smub-current",
                                    })];
                            case 13:
                                measurement = (_o[_l] = _m.apply(void 0, [(_p.sent()).read]),
                                    _o);
                                if (recipe.privateExports.length)
                                    onData(Object.fromEntries(recipe.privateExports.map(function (_a) {
                                        var name = _a.name, column = _a.column;
                                        return [
                                            column, measurement[name]
                                        ];
                                    })));
                                publicMeasurement = Object.fromEntries(Object.entries(measurement).map(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return [key + "[]", value];
                                }));
                                if (recipe.publicExports.length)
                                    publicRows.push(Object.fromEntries(recipe.publicExports.map(function (_a) {
                                        var name = _a.name, column = _a.column;
                                        return [
                                            column, publicMeasurement[name]
                                        ];
                                    })));
                                return [2 /*return*/];
                        }
                    });
                };
                _b = 0, smuSubArray_1 = smuSubArray;
                _d.label = 15;
            case 15:
                if (!(_b < smuSubArray_1.length)) return [3 /*break*/, 18];
                smuPair = smuSubArray_1[_b];
                return [5 /*yield**/, _loop_1(smuPair)];
            case 16:
                state_1 = _d.sent();
                if (state_1 === "break")
                    return [3 /*break*/, 18];
                _d.label = 17;
            case 17:
                _b++;
                return [3 /*break*/, 15];
            case 18:
                _c = 0, subsequence_1 = subsequence;
                _d.label = 19;
            case 19:
                if (!(_c < subsequence_1.length)) return [3 /*break*/, 22];
                subrecipe = subsequence_1[_c];
                if (haltFlag)
                    return [3 /*break*/, 22];
                return [4 /*yield*/, (0, experiment_executer_1.experimentExecuter)(subrecipe, onData, onHalt, controller)];
            case 20:
                _d.sent();
                _d.label = 21;
            case 21:
                _c++;
                return [3 /*break*/, 19];
            case 22:
                _i++;
                return [3 /*break*/, 14];
            case 23:
                if (!!haltFlag) return [3 /*break*/, 27];
                if (!recipe.smuARecipe.turnOffAfterDone) return [3 /*break*/, 25];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smua-off",
                        value: recipe.integrationTime
                    })];
            case 24:
                _d.sent();
                _d.label = 25;
            case 25:
                if (!recipe.smuBRecipe.turnOffAfterDone) return [3 /*break*/, 27];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smub-off",
                        value: recipe.integrationTime
                    })];
            case 26:
                _d.sent();
                _d.label = 27;
            case 27:
                publicRows.forEach(function (row) { return onData(row); });
                unsubscribe();
                return [2 /*return*/];
        }
    });
}); };
exports.keithley2600SimpleExperimenter = keithley2600SimpleExperimenter;
//# sourceMappingURL=keithley-2600-simple-experimenter.js.map