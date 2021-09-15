import { SMUMode, SMURecipe } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { linspace } from "./util";

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
            return [[Number(smuRecipe.start)], ...intervals.map(({ start, end }) => linspace(start, end, Number(smuRecipe.step)))];
    }
};
