import { isCommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { isRandomNumberRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { RawDataRow } from "../experiment";
import { commanderExperimenter } from "./commander-experimenter";
import { randomNumberExperimenter } from "./random-number-experimenter";

export const experimentExecuter = async (recipe: WrappedRecipe, onData: (data: RawDataRow) => void) => {
    if (isRandomNumberRecipe(recipe.recipe)) {
        await randomNumberExperimenter(recipe.recipe, recipe.subsequence, onData);
        return;
    }
    if (isCommanderRecipe(recipe.recipe)) {
        await commanderExperimenter(recipe.recipe, recipe.subsequence, onData);
        return;
    }
}