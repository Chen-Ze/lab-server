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
import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { Experimenter, ExperimentExecuter } from "./experimenter";


type RecipeTypeGuard<T extends Recipe> = (recipe: Recipe) => recipe is T

const dispatchers: {
    filter: RecipeTypeGuard<Recipe>,
    experimenter: Experimenter<Recipe>
}[] = [{
        filter: isRandomNumberRecipe,
        experimenter: randomNumberExperimenter
    }, {
        filter: isCommanderRecipe,
        experimenter: commanderExperimenter
    }, {
        filter: isKeithley2636SimpleRecipe,
        experimenter: keithley2600SimpleExperimenter
    }, {
        filter: isKeithley2400SimpleRecipe,
        experimenter: keithley2400SimpleExperimenter
    }, {
        filter: isPythonRecipe,
        experimenter: pythonExperimenter
    }, {
        filter: isPauseRecipe,
        experimenter: pauseExperimenter,
    },  {
        filter: isLightFieldRecipe,
        experimenter: lightFieldExperimenter,
    }
];

export const experimentExecuter: ExperimentExecuter = async (props) => {
    const { recipe, onData, onError, onHalt, controller, events } = props;

    for (const {filter, experimenter} of dispatchers) {
        if (filter(recipe.recipe)) {
            await experimenter({
                recipe: recipe.recipe,
                subsequence: recipe.subsequence,
                onData,
                onError,
                onHalt,
                controller,
                events,
                id: String(recipe.id)
            });
            break;
        }
    }
}