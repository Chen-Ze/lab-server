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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
router.get('/server/available-addresses', (req, res, next) => {
    res.json({
        availableAddresses: [
            "GPIB0::26::INSTR",
            "GPIB0::27::INSTR",
            "GPIB0::28::INSTR",
        ]
    });
});
router.get('/server/query', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, command } = req.query;
    const url = new URL(process.env.CONTROLLER_ADDRESS);
    const params = { name, command, function: "query" };
    url.search = new URLSearchParams(params).toString();
    res.send(yield (yield (0, node_fetch_1.default)(url.toString())).text());
}));
module.exports = router;
//# sourceMappingURL=routes.js.map