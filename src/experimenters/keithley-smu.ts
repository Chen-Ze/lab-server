import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import { SMUMode, SMURecipe } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { linspace, LINSPACE_EPS_SCALE } from "./util";

export const smuRecipeToArray = (smuRecipe: SMURecipe): (number | undefined)[][] => {
    switch (smuRecipe.smuMode) {
        case SMUMode.Off:
        case SMUMode.Free:
            return [[undefined]];
        case SMUMode.FixedVoltage:
        case SMUMode.FixedCurrent:
            return [[Number(smuRecipe.value)]];
        case SMUMode.SweepVoltage:
        case SMUMode.SweepCurrent:
            const intervalPoints = linspace(Number(smuRecipe.start), Number(smuRecipe.stop), Number(smuRecipe.interval));
            const intervalStarts = intervalPoints.slice(0, -1);
            const intervalEnds   = intervalPoints.slice(1);
            const intervals      = intervalStarts.map((start, i) => ({ start, end: intervalEnds[i] }));
            return [[Number(smuRecipe.start)], ...intervals.map(
                ({ start, end }) => linspace(start, end, Number(smuRecipe.step), true, false, Number(smuRecipe.step) * LINSPACE_EPS_SCALE)
            )];
    }
};

export const measurementFlag = (recipe: Recipe,
    privateName: string,
    publicName?: string,
) => {
    if (!publicName) publicName = privateName + "[]";
    return (
        recipe.privateExports.map(entry => entry.name).includes(privateName) ||
        recipe.publicExports.map(entry => entry.name).includes(publicName) ||
        recipe.privateVariables.map(entry => entry.name).includes(privateName) ||
        recipe.publicVariables.map(entry => entry.name).includes(publicName)
    );
}
