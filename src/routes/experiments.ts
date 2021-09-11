import { SimpleEventDispatcher } from "strongly-typed-events";
import { Experiment, ExperimentStatus } from "./experiment";

type ExperimentChangedEventData = {
    id: string,
    status: ExperimentStatus
}

export class Experiments {
    private experiments: { [id: string]: Experiment; } = {};

    private _onExperimentsChanged = new SimpleEventDispatcher<ExperimentChangedEventData[]>();

    public get onExperimentsChanged() {
        return this._onExperimentsChanged.asEvent();
    }

    public addExperiment(id: string, experiment: Experiment) {
        this.experiments[id] = experiment;
        experiment.onStarted.subscribe(() => this.triggerExperimentsChanged());
        experiment.onTerminated.subscribe(() => this.triggerExperimentsChanged());
        this.triggerExperimentsChanged();
    }

    public triggerExperimentsChanged() {
        this._onExperimentsChanged.dispatch(Object.keys(this.experiments).map(id => ({
            id,
            status: this.experiments[id].getStatus()
        })));
    }

    public getExperimentIdList() {
        return Object.keys(this.experiments);
    }

    public hasId(id: string) {
        return Object.keys(this.experiments).indexOf(id) >= 0;
    }

    public getExperimentById(id: string) {
        return this.experiments[id];
    }
}
