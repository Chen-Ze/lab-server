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
exports.lightFieldExperimenter = void 0;
var lightfield_recipe_1 = require("material-science-experiment-recipes/lib/lightfield-recipe");
var spectrumIndex = {};
var lightFieldExperimenter = function (recipe, subsequence, onData, onHalt, controller, events, id) { return __awaiter(void 0, void 0, void 0, function () {
    var publicRows, _a, response, spectrum, wavelengths_1, zippedData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                publicRows = [];
                _a = recipe.task;
                switch (_a) {
                    case lightfield_recipe_1.LightFieldTask.ActivateWindow: return [3 /*break*/, 1];
                    case lightfield_recipe_1.LightFieldTask.SaveSpectrum: return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, controller.queryModel("LIGHT_FIElD", "LightField", {
                    task: "activate",
                })];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!spectrumIndex[id]) {
                    spectrumIndex[id] = 0;
                }
                return [4 /*yield*/, controller.queryModel("LIGHT_FIElD", "LightField", {
                        task: "save-spectrum",
                        dir: recipe.payload.directory || __dirname,
                        filename: "" + (recipe.payload.prefix || '') + spectrumIndex[id]++
                    })];
            case 4:
                response = _b.sent();
                spectrum = response.spectrum;
                wavelengths_1 = response.wavelengths;
                zippedData = spectrum.map(function (value, i) { return ({
                    "Spectrum[]": value,
                    "Wavelength[]": wavelengths_1[i]
                }); });
                zippedData.forEach(function (row) {
                    if (recipe.publicExports.length)
                        publicRows.push(Object.fromEntries(recipe.publicExports.map(function (_a) {
                            var name = _a.name, column = _a.column;
                            return [
                                column, row[name]
                            ];
                        })));
                });
                return [3 /*break*/, 5];
            case 5:
                onData(publicRows);
                return [2 /*return*/];
        }
    });
}); };
exports.lightFieldExperimenter = lightFieldExperimenter;
//# sourceMappingURL=light-field-experimenter.js.map