"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experiments = void 0;
var strongly_typed_events_1 = require("strongly-typed-events");
var Experiments = /** @class */ (function () {
    function Experiments() {
        this.experiments = {};
        this._onExperimentsChanged = new strongly_typed_events_1.SimpleEventDispatcher();
    }
    Object.defineProperty(Experiments.prototype, "onExperimentsChanged", {
        get: function () {
            return this._onExperimentsChanged.asEvent();
        },
        enumerable: false,
        configurable: true
    });
    Experiments.prototype.addExperiment = function (id, experiment) {
        var _this = this;
        this.experiments[id] = experiment;
        experiment.onStarted.subscribe(function () { return _this.triggerExperimentsChanged(); });
        experiment.onTerminated.subscribe(function () { return _this.triggerExperimentsChanged(); });
        this.triggerExperimentsChanged();
    };
    Experiments.prototype.triggerExperimentsChanged = function () {
        var _this = this;
        this._onExperimentsChanged.dispatch(Object.keys(this.experiments).map(function (id) { return ({
            id: id,
            status: _this.experiments[id].getStatus()
        }); }));
    };
    Experiments.prototype.getExperimentIdList = function () {
        return Object.keys(this.experiments);
    };
    Experiments.prototype.hasId = function (id) {
        return Object.keys(this.experiments).indexOf(id) >= 0;
    };
    Experiments.prototype.getExperimentById = function (id) {
        return this.experiments[id];
    };
    Experiments.prototype.halt = function (id) {
        var _a;
        (_a = this.experiments[id]) === null || _a === void 0 ? void 0 : _a.halt();
    };
    return Experiments;
}());
exports.Experiments = Experiments;
//# sourceMappingURL=experiments.js.map