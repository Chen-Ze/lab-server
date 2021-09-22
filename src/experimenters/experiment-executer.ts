import { isCommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { isRandomNumberRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { commanderExperimenter } from "./commander-experimenter";
import { randomNumberExperimenter } from "./random-number-experimenter";
import { isKeithley2636SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2636-simple-recipe";
import { keithley2600SimpleExperimenter } from "./keithley-2600-simple-experimenter";
import { keithley2400SimpleExperimenter } from "./keithley-2400-simple-experimenter";
import { isKeithley2400SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2400-simple-recipe";
import { isPythonRecipe } from "material-science-experiment-recipes/lib/python-simple-recipe";
import { pythonExperimenter } from "./python-experimenter";
import { isPauseRecipe } from "material-science-experiment-recipes/lib/pause-recipe";
import { pauseExperimenter } from "./pause-experimenter";
import { isLightFieldRecipe } from "material-science-experiment-recipes/lib/lightfield-recipe";
import { lightFieldExperimenter } from "./light-field-experimenter";

export const experimentExecuter = async (
    recipe: WrappedRecipe,
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    if (isRandomNumberRecipe(recipe.recipe)) {
        await randomNumberExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isCommanderRecipe(recipe.recipe)) {
        await commanderExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isKeithley2636SimpleRecipe(recipe.recipe)) {
        await keithley2600SimpleExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isKeithley2400SimpleRecipe(recipe.recipe)) {
        await keithley2400SimpleExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isPythonRecipe(recipe.recipe)) {
        await pythonExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isPauseRecipe(recipe.recipe)) {
        await pauseExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events);
        return;
    }
    if (isLightFieldRecipe(recipe.recipe)) {
        await lightFieldExperimenter(recipe.recipe, recipe.subsequence, onData, onHalt, controller, events, String(recipe.id));
        return;
    }
}