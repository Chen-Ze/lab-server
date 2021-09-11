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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var util_1 = require("../util");
var experiment_1 = require("./experiment");
var experiments_1 = require("./experiments");
exports.router = express_1.default.Router();
exports.router.get('/server/available-addresses', function (req, res, next) {
    res.json({
        availableAddresses: [
            "GPIB0::26::INSTR",
            "GPIB0::27::INSTR",
            "GPIB0::28::INSTR",
        ]
    });
});
var MIN_EXPERIMENT_ID_LENGTH = 2;
var experiments = new experiments_1.Experiments();
exports.router.post('/server/new-experiment', function (req, res) {
    var experimentId = (0, util_1.getRandomId)(MIN_EXPERIMENT_ID_LENGTH, experiments.getExperimentIdList());
    experiments.addExperiment(experimentId, new experiment_1.Experiment(experimentId, req.body));
    res.json({
        id: experimentId
    });
});
exports.router.get('/server/available-experiments', function (req, res) {
    var headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
    };
    res.writeHead(200, headers);
    var unsubscribe = experiments.onExperimentsChanged.subscribe(function (response) {
        res.write("event: update\n");
        res.write("data: " + JSON.stringify(response) + "\n\n");
        res.flush();
    });
    experiments.triggerExperimentsChanged();
    req.on('close', function () {
        // tslint:disable-next-line:no-console
        console.log('available-experiments: req closed');
        unsubscribe();
        res.end();
    });
});
// the client may miss the first update event
// since the listener may be registered later than the first event
// the client should trigger this api manually
exports.router.get('/server/trigger-available-experiments', function (req, res) {
    experiments.triggerExperimentsChanged();
    res.end();
});
exports.router.get('/server/watch-experiment', function (req, res) {
    var experimentId = req.query.id;
    if (!experiments.hasId(experimentId)) {
        return res.status(500).send({
            message: "Invalid experiment id: " + experimentId + "."
        });
    }
    var experiment = experiments.getExperimentById(experimentId);
    var headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
    };
    res.writeHead(200, headers);
    var unsubscribe = experiment.onDataJot.subscribe(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res.write("event: update\n");
                    res.write("data: " + JSON.stringify(response) + "\n\n");
                    res.flush();
                    return [4 /*yield*/, experiment.isTerminated()];
                case 1:
                    if (_a.sent()) {
                        // tslint:disable-next-line:no-console
                        console.log('watch-experiment: exp terminated');
                        unsubscribe();
                        res.end();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    req.on('close', function () {
        // tslint:disable-next-line:no-console
        console.log('watch-experiment: req closed');
        unsubscribe();
        res.end();
    });
    experiment.signal();
});
exports.router.get('/server/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, count, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // tslint:disable-next-line:no-console
                console.log('Got /events');
                req.on('close', function () {
                    // tslint:disable-next-line:no-console
                    console.log("res closed");
                });
                headers = {
                    'Content-Type': 'text/event-stream',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                    'X-Accel-Buffering': 'no'
                };
                res.writeHead(200, headers);
                // Tell the client to retry every 10 seconds if connectivity is lost
                res.write('retry: 10000\n\n');
                count = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                data = { ia: count, ib: count + 1 };
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 2:
                _a.sent();
                // tslint:disable-next-line:no-console
                console.log('Emit', ++count);
                // Emit an SSE that contains the current 'count' as a string
                res.write("event: update\n");
                res.write("data: " + JSON.stringify(data) + "\n\n");
                res.flush();
                if (count === 5)
                    return [3 /*break*/, 3];
                return [3 /*break*/, 1];
            case 3:
                res.write("event: terminate\n");
                res.write("data: \n\n");
                res.end();
                return [2 /*return*/];
        }
    });
}); });
exports.router.get('/server/query', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, command, url, params, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, name = _a.name, command = _a.command;
                url = process.env.CONTROLLER_ADDRESS;
                params = { name: name, command: command, function: "query" };
                return [4 /*yield*/, axios_1.default.get(url, { params: params })];
            case 1:
                response = _b.sent();
                res.send(response.data);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=server.js.map