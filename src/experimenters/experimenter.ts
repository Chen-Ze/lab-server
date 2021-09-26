import { ISignal } from "strongly-typed-events";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { CommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { RawDataRow, ExperimentEvents } from "../routes/experiment";
import { Recipe } from "material-science-experiment-recipes/lib/recipe";


export interface ExperimenterProps<T extends Recipe> {
    recipe: T;
    subsequence: WrappedRecipe[];
    onData: (data: RawDataRow | RawDataRow[]) => void;
    onHalt: ISignal;
    controller: Controller;
    events: ExperimentEvents;
    id: string;
}

export type Experimenter<T extends Recipe> = (props: ExperimenterProps<T>) => Promise<void>;
