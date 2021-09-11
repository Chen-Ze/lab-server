import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import AwaitLock from 'await-lock';
import { v4 as uuidv4 } from 'uuid';
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { experimentExecuter } from "./experimenters/experiment-executer";

export enum ExperimentStatus {
    Created = 'Created',
    Started = 'Started',
    Terminated = 'Terminated'
}

export type RawDataRow = {
    [key: string]: any
}

type DataRow = {
    id: string,
    [key: string]: any
};

type Data = DataRow[];

interface Response {
    data: Data,
    status: ExperimentStatus
}

export class Experiment {
    private id: string;
    private status: ExperimentStatus;
    private statusLock = new AwaitLock();
    private data: Data;
    private recipe: WrappedRecipe;

    private _onDataJot = new SimpleEventDispatcher<Response>();
    private _onStarted = new SignalDispatcher();
    private _onTerminated = new SignalDispatcher();

    constructor(id: string, recipe: WrappedRecipe) {
        this.id = id;
        this.status = ExperimentStatus.Created;
        this.data = [];
        this.recipe = recipe;
    }

    public async signal() {
        await this.statusLock.acquireAsync();
        try {
            switch (this.status) {
                case ExperimentStatus.Created:
                    this.status = ExperimentStatus.Started;
                    this.execute();
                    return;
                case ExperimentStatus.Started:
                    return;
                case ExperimentStatus.Terminated:
                    this._onDataJot.dispatch({
                        data: this.data,
                        status: this.status
                    });
                    return;
            }
        } finally {
            this.statusLock.release();
        }
    }

    private async execute() {
        this._onStarted.dispatch();

        await experimentExecuter(this.recipe, (row) => {
            this.data.push({ id: uuidv4(), ...row });
            this._onDataJot.dispatch({
                data: this.data,
                status: this.status
            });
        })

        await this.statusLock.acquireAsync();
        try {
            this.status = ExperimentStatus.Terminated;
        } finally {
            this.statusLock.release();
        }
        this._onTerminated.dispatch();
        this._onDataJot.dispatch({
            data: this.data,
            status: this.status
        });
    }

    public get onDataJot() {
        return this._onDataJot.asEvent();
    }

    public async isTerminated() {
        await this.statusLock.acquireAsync();
        try {
            return this.status === ExperimentStatus.Terminated;
        } finally {
            this.statusLock.release();
        }
    }

    public getStatus() {
        return this.status;
    }

    public get onStarted() {
        return this._onStarted.asEvent();
    }

    public get onTerminated() {
        return this._onTerminated.asEvent();
    }
}
