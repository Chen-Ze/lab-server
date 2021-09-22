import { LightFieldRecipe, LightFieldTask } from "material-science-experiment-recipes/lib/lightfield-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { spawn } from "child_process";


const spectrumIndex: {
    [key: string]: number
} = {};

export const lightFieldExperimenter = async (
    recipe: LightFieldRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents,
    id: string
) => {
    switch (recipe.task) {
        case LightFieldTask.ActivateWindow:
            await controller.queryModel("", "LightField", {
                task: "activate",
            });
            break;
        case LightFieldTask.SaveSpectrum:
            if (!spectrumIndex[id]) {
                spectrumIndex[id] = 0;
            }
            await controller.queryModel("", "LightField", {
                task: "save-spectrum",
                dir: recipe.payload.dir,
                filename: `${spectrumIndex[id]++}`
            });
            break;
    }
}