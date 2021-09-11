"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
var random_words_1 = __importDefault(require("random-words"));
var getRandomId = function (minLength, exclude) {
    if (minLength === void 0) { minLength = 1; }
    var generated = (0, random_words_1.default)({ exactly: minLength, join: '-' });
    if (!exclude)
        return generated;
    if (exclude.indexOf(generated) < 0)
        return generated;
    return (0, exports.getRandomId)(minLength + 1, exclude);
};
exports.getRandomId = getRandomId;
//# sourceMappingURL=util.js.map