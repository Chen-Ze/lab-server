import { PauseRecipe } from "material-science-experiment-recipes/lib/pause-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { ISignal } from "ste-signals";
import { Controller } from "../controller/controller";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";

export const pauseExperimenter = async (
    recipe: PauseRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    let unsubscribeHalt: () => void;
    let unsubscribeResume: () => void;

    await new Promise((resolve, reject) => {
        unsubscribeHalt = onHalt.subscribe(() => resolve(0));
        unsubscribeResume = events.onResume.subscribe(() => resolve(0));
    });

    if (unsubscribeHalt) unsubscribeHalt();
    if (unsubscribeResume) unsubscribeResume();
}
