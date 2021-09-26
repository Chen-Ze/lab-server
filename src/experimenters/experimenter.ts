import { ISignal } from "strongly-typed-events";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { RawDataRow, ExperimentEvents } from "../routes/experiment";
import { Recipe } from "material-science-experiment-recipes/lib/recipe";


export interface ExperimenterProps<T extends Recipe> {
    recipe: T;
    subsequence: WrappedRecipe[];
    onData: (data: RawDataRow | RawDataRow[]) => void;
    onError: (message: any) => void;
    onHalt: ISignal;
    controller: Controller;
    events: ExperimentEvents;
    id: string;
}

export type Experimenter<T extends Recipe> = (props: ExperimenterProps<T>) => Promise<void>;

export type ErrorReporter = (message: any) => void

export interface ExperimentExecuterProps {
    recipe: WrappedRecipe,
    onData: (data: RawDataRow | RawDataRow[]) => void,
    onError: ErrorReporter,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
}

export type ExperimentExecuter = (props: ExperimentExecuterProps) => Promise<void>

export const experimentExecuterProps: (recipe: WrappedRecipe, props: ExperimenterProps<Recipe>) => ExperimentExecuterProps = (recipe, props) => ({
    ...props,
    recipe
});
