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
exports.commanderExperimenter = void 0;
var experiment_executer_1 = require("./experiment-executer");
var commanderExperimenter = function (recipe, subsequence, onData, onHalt, controller, events) { return __awaiter(void 0, void 0, void 0, function () {
    var haltFlag, unsubscribe, _i, _a, instrument, _b, _c, subsequence_1, subrecipe;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                haltFlag = false;
                unsubscribe = onHalt.subscribe(function () { return haltFlag = true; });
                _i = 0, _a = recipe.instruments;
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                instrument = _a[_i];
                _b = instrument.model;
                switch (_b) {
                    case "Keithley 2400": return [3 /*break*/, 2];
                    case "Keithley 2600": return [3 /*break*/, 4];
                    case "GPIB": return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 2: return [4 /*yield*/, controller.openModel(instrument.name, instrument.address, "Model2400")];
            case 3:
                _d.sent();
                return [3 /*break*/, 9];
            case 4: return [4 /*yield*/, controller.openModel(instrument.name, instrument.address, "Model2600")];
            case 5:
                _d.sent();
                return [3 /*break*/, 9];
            case 6: return [4 /*yield*/, controller.open(instrument.name, instrument.address)];
            case 7:
                _d.sent();
                return [3 /*break*/, 9];
            case 8: throw Error("Unsupported instrument model type: " + instrument.model + ".");
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10:
                _c = 0, subsequence_1 = subsequence;
                _d.label = 11;
            case 11:
                if (!(_c < subsequence_1.length)) return [3 /*break*/, 14];
                subrecipe = subsequence_1[_c];
                if (haltFlag)
                    return [3 /*break*/, 14];
                return [4 /*yield*/, (0, experiment_executer_1.experimentExecuter)(subrecipe, onData, onHalt, controller, events)];
            case 12:
                _d.sent();
                _d.label = 13;
            case 13:
                _c++;
                return [3 /*break*/, 11];
            case 14:
                unsubscribe();
                return [2 /*return*/];
        }
    });
}); };
exports.commanderExperimenter = commanderExperimenter;
//# sourceMappingURL=commander-experimenter.js.map