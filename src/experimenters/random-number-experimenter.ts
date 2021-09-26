import { RandomNumberRecipe } from "material-science-experiment-recipes/lib/random-number-recipe";
import { RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";
import { Experimenter, experimentExecuterProps } from "./experimenter";


const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const randomNumberExperimenter: Experimenter<RandomNumberRecipe> = async (props) => {
    const { recipe, subsequence, onData, onHalt, controller, events } = props;

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
            await experimentExecuter(experimentExecuterProps(subrecipe, props));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    publicRows.forEach(row => onData(row));
    unsubscribe();
}