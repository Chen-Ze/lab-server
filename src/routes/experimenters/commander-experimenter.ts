import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { CommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { RawDataRow } from "../experiment";
import { experimentExecuter } from "./experiment-executer";

export const commanderExperimenter = async (recipe: CommanderRecipe, subsequence: WrappedRecipe[], onData: (data: RawDataRow) => void) => {
    for (const subrecipe of subsequence) {
        await experimentExecuter(subrecipe, onData);
    }
}
