import { RandomNumberRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";


const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const randomNumberExperimenter = async (
    recipe: RandomNumberRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    let haltFlag = false;
    const unsubscribe = onHalt.subscribe(() => haltFlag = true);

    const publicRows: RawDataRow[] = [];

    for (let i = 0; i < Number(recipe.count); i++) {
        if (haltFlag) break;

        const rawRow = Object.fromEntries([
            ...recipe.generators.map(generator =>
                [generator.name, getRandomArbitrary(Number(generator.min), Number(generator.max))]
            ),
            ...recipe.generators.map(generator =>
                [generator.name + '[]', getRandomArbitrary(Number(generator.min), Number(generator.max))]
            ),
        ]);
        if (recipe.privateExports.length) onData(Object.fromEntries(
            recipe.privateExports.map(({ name, column }) => [column, rawRow[name]])
        ));
        if (recipe.publicExports.length) publicRows.push(Object.fromEntries(
            recipe.publicExports.map(({ name, column }) => [column, rawRow[name]])
        ));

        for (const subrecipe of subsequence) {
            if (haltFlag) break;
            await experimentExecuter(subrecipe, onData, onHalt, controller, events);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    publicRows.forEach(row => onData(row));
    unsubscribe();
}