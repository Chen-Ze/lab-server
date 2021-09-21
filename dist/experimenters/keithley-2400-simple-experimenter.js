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
exports.keithley2400SimpleExperimenter = void 0;
var smu_recipe_1 = require("material-science-experiment-recipes/lib/keithley-simple/smu-recipe");
var experiment_executer_1 = require("./experiment-executer");
var keithley_smu_1 = require("./keithley-smu");
var util_1 = require("./util");
var keithley2400SimpleExperimenter = function (recipe, subsequence, onData, onHalt, controller, events) { return __awaiter(void 0, void 0, void 0, function () {
    var haltFlag, unsubscribe, publicRows, smuArray, measureVoltage, measureCurrent, _i, smuArray_1, smuSubArray, _loop_1, _a, smuSubArray_1, smuValue, state_1, _b, subsequence_1, subrecipe;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                haltFlag = false;
                unsubscribe = onHalt.subscribe(function () { return haltFlag = true; });
                publicRows = [];
                if ((0, smu_recipe_1.isSweepChannelRecipe)(recipe.smuRecipe) && !Number(recipe.smuRecipe.step)) {
                    recipe.smuRecipe.step = recipe.smuRecipe.interval;
                }
                smuArray = (0, keithley_smu_1.smuRecipeToArray)(recipe.smuRecipe);
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                        task: "set-integration-time",
                        value: recipe.integrationTime
                    })];
            case 1:
                _c.sent();
                if (!(0, smu_recipe_1.isOffChannelRecipe)(recipe.smuRecipe)) return [3 /*break*/, 3];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                        task: "set-smu-off",
                        value: recipe.integrationTime
                    })];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                if (!Number(recipe.smuRecipe.compliance)) return [3 /*break*/, 7];
                if (!(recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 5];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                        task: "set-smu-current-compliance",
                        value: recipe.smuRecipe.compliance
                    })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                if (!(recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 7];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                        task: "set-smu-voltage-compliance",
                        value: recipe.smuRecipe.compliance
                    })];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                measureVoltage = (0, keithley_smu_1.measurementFlag)(recipe, "Voltage");
                measureCurrent = (0, keithley_smu_1.measurementFlag)(recipe, "Current");
                _i = 0, smuArray_1 = smuArray;
                _c.label = 8;
            case 8:
                if (!(_i < smuArray_1.length)) return [3 /*break*/, 17];
                smuSubArray = smuArray_1[_i];
                if (haltFlag)
                    return [3 /*break*/, 17];
                _loop_1 = function (smuValue) {
                    var measurement, _d, _e, _f, _g, _h, _j, publicMeasurement;
                    var _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                if (haltFlag)
                                    return [2 /*return*/, "break"];
                                if (!(recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.FixedVoltage || recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.SweepVoltage)) return [3 /*break*/, 2];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                                        task: "set-smu-voltage",
                                        value: String(smuValue)
                                    })];
                            case 1:
                                _l.sent();
                                _l.label = 2;
                            case 2:
                                if (!(recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.FixedCurrent || recipe.smuRecipe.smuMode === smu_recipe_1.SMUMode.SweepCurrent)) return [3 /*break*/, 4];
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                                        task: "set-smu-current",
                                        value: String(smuValue)
                                    })];
                            case 3:
                                _l.sent();
                                _l.label = 4;
                            case 4: return [4 /*yield*/, (0, util_1.sleep)(Number(recipe.wait))];
                            case 5:
                                _l.sent();
                                _k = {};
                                _d = "Voltage";
                                if (!measureVoltage) return [3 /*break*/, 7];
                                _f = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                                        task: "measure-smu-voltage",
                                    })];
                            case 6:
                                _e = (_f.apply(void 0, [(_l.sent()).read]));
                                return [3 /*break*/, 8];
                            case 7:
                                _e = NaN;
                                _l.label = 8;
                            case 8:
                                _k[_d] = _e;
                                _g = "Current";
                                if (!measureCurrent) return [3 /*break*/, 10];
                                _j = Number;
                                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2400", {
                                        task: "measure-smu-current",
                                    })];
                            case 9:
                                _h = (_j.apply(void 0, [(_l.sent()).read]));
                                return [3 /*break*/, 11];
                            case 10:
                                _h = NaN;
                                _l.label = 11;
                            case 11:
                                measurement = (_k[_g] = _h,
                                    _k);
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
                _a = 0, smuSubArray_1 = smuSubArray;
                _c.label = 9;
            case 9:
                if (!(_a < smuSubArray_1.length)) return [3 /*break*/, 12];
                smuValue = smuSubArray_1[_a];
                return [5 /*yield**/, _loop_1(smuValue)];
            case 10:
                state_1 = _c.sent();
                if (state_1 === "break")
                    return [3 /*break*/, 12];
                _c.label = 11;
            case 11:
                _a++;
                return [3 /*break*/, 9];
            case 12:
                _b = 0, subsequence_1 = subsequence;
                _c.label = 13;
            case 13:
                if (!(_b < subsequence_1.length)) return [3 /*break*/, 16];
                subrecipe = subsequence_1[_b];
                if (haltFlag)
                    return [3 /*break*/, 16];
                return [4 /*yield*/, (0, experiment_executer_1.experimentExecuter)(subrecipe, onData, onHalt, controller, events)];
            case 14:
                _c.sent();
                _c.label = 15;
            case 15:
                _b++;
                return [3 /*break*/, 13];
            case 16:
                _i++;
                return [3 /*break*/, 8];
            case 17:
                if (!!haltFlag) return [3 /*break*/, 19];
                if (!recipe.smuRecipe.turnOffAfterDone) return [3 /*break*/, 19];
                return [4 /*yield*/, controller.queryModel(recipe.name, "Model2600", {
                        task: "set-smu-off",
                        value: recipe.integrationTime
                    })];
            case 18:
                _c.sent();
                _c.label = 19;
            case 19:
                publicRows.forEach(function (row) { return onData(row); });
                unsubscribe();
                return [2 /*return*/];
        }
    });
}); };
exports.keithley2400SimpleExperimenter = keithley2400SimpleExperimenter;
//# sourceMappingURL=keithley-2400-simple-experimenter.js.map