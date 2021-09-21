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
exports.measurementFlag = exports.smuRecipeToArray = void 0;
var smu_recipe_1 = require("material-science-experiment-recipes/lib/keithley-simple/smu-recipe");
var util_1 = require("./util");
var smuRecipeToArray = function (smuRecipe) {
    switch (smuRecipe.smuMode) {
        case smu_recipe_1.SMUMode.Off:
        case smu_recipe_1.SMUMode.Free:
            return [[undefined]];
        case smu_recipe_1.SMUMode.FixedVoltage:
        case smu_recipe_1.SMUMode.FixedCurrent:
            return [[Number(smuRecipe.value)]];
        case smu_recipe_1.SMUMode.SweepVoltage:
        case smu_recipe_1.SMUMode.SweepCurrent:
            var intervalPoints = (0, util_1.linspace)(Number(smuRecipe.start), Number(smuRecipe.stop), Number(smuRecipe.interval));
            var intervalStarts = intervalPoints.slice(0, -1);
            var intervalEnds_1 = intervalPoints.slice(1);
            var intervals = intervalStarts.map(function (start, i) { return ({ start: start, end: intervalEnds_1[i] }); });
            return __spreadArray([[Number(smuRecipe.start)]], intervals.map(function (_a) {
                var start = _a.start, end = _a.end;
                return (0, util_1.linspace)(start, end, Number(smuRecipe.step), true, false, Number(smuRecipe.step) * util_1.LINSPACE_EPS_SCALE);
            }), true);
    }
};
exports.smuRecipeToArray = smuRecipeToArray;
var measurementFlag = function (recipe, privateName, publicName) {
    if (!publicName)
        publicName = privateName + "[]";
    return (recipe.privateExports.map(function (entry) { return entry.name; }).includes(privateName) ||
        recipe.publicExports.map(function (entry) { return entry.name; }).includes(publicName) ||
        recipe.privateVariables.map(function (entry) { return entry.name; }).includes(privateName) ||
        recipe.publicVariables.map(function (entry) { return entry.name; }).includes(publicName));
};
exports.measurementFlag = measurementFlag;
//# sourceMappingURL=keithley-smu.js.map