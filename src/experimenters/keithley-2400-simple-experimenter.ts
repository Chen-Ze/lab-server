import { Keithley2400SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2400-simple-recipe";
import { isFixedChannelRecipe, isOffChannelRecipe, isSweepChannelRecipe, SMUMode } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";
import { smuRecipeToArray } from "./keithley-smu";
import { sleep } from "./util";


export const keithley2400SimpleExperimenter = async (recipe: Keithley2400SimpleRecipe, subsequence: WrappedRecipe[], onData: (data: RawDataRow) => void, onHalt: ISignal, controller: Controller) => {
    let haltFlag = false;
    const unsubscribe = onHalt.subscribe(() => haltFlag = true);

    const publicRows: RawDataRow[] = [];

    if (isSweepChannelRecipe(recipe.smuRecipe) && !Number(recipe.smuRecipe.step)) {
        recipe.smuRecipe.step = recipe.smuRecipe.interval;
    }

    const smuArray = smuRecipeToArray(recipe.smuRecipe);

    await controller.queryModel(recipe.name, "Model2400", {
        task: "set-integration-time",
        value: recipe.integrationTime
    });

    if (isOffChannelRecipe(recipe.smuRecipe)) {
        await controller.queryModel(recipe.name, "Model2400", {
            task: "set-smu-off",
            value: recipe.integrationTime
        });
    }

    if (Number(recipe.smuRecipe.compliance)) {
        if (recipe.smuRecipe.smuMode === SMUMode.FixedVoltage || recipe.smuRecipe.smuMode === SMUMode.SweepVoltage) {
            await controller.queryModel(recipe.name, "Model2400", {
                task: "set-smu-current-compliance",
                value: recipe.smuRecipe.compliance
            });
        }
        if (recipe.smuRecipe.smuMode === SMUMode.FixedCurrent || recipe.smuRecipe.smuMode === SMUMode.SweepCurrent) {
            await controller.queryModel(recipe.name, "Model2400", {
                task: "set-smu-voltage-compliance",
                value: recipe.smuRecipe.compliance
            });
        }
    }

    for (const smuSubArray of smuArray) {
        if (haltFlag) break;
        for (const smuValue of smuSubArray) {
            if (haltFlag) break;
            if (recipe.smuRecipe.smuMode === SMUMode.FixedVoltage || recipe.smuRecipe.smuMode === SMUMode.SweepVoltage) {
                await controller.queryModel(recipe.name, "Model2400", {
                    task: "set-smu-voltage",
                    value: String(smuValue)
                });
            }
            if (recipe.smuRecipe.smuMode === SMUMode.FixedCurrent || recipe.smuRecipe.smuMode === SMUMode.SweepCurrent) {
                await controller.queryModel(recipe.name, "Model2400", {
                    task: "set-smu-current",
                    value: String(smuValue)
                });
            }
            await sleep(Number(recipe.wait));

            const measurement = {
                "Voltage": Number((await controller.queryModel(recipe.name, "Model2400", {
                    task: "measure-smu-voltage",
                })).read),
                "Current": Number((await controller.queryModel(recipe.name, "Model2400", {
                    task: "measure-smu-current",
                })).read),
            };

            if (recipe.privateExports.length) onData(Object.fromEntries(recipe.privateExports.map(({name, column}) => [
                column, measurement[name as keyof typeof measurement]
            ])));

            const publicMeasurement = Object.fromEntries(Object.entries(measurement).map(([key, value]) => [key + "[]", value]));

            if (recipe.publicExports.length) publicRows.push(Object.fromEntries(recipe.publicExports.map(({name, column}) => [
                column, publicMeasurement[name]
            ])));
        }

        for (const subrecipe of subsequence) {
            if (haltFlag) break;
            await experimentExecuter(subrecipe, onData, onHalt, controller);
        }
    }

    if (!haltFlag) {
        // don't turn off the smu if experiment is halted by the user
        // otherwise the voltage may jump
        if (recipe.smuRecipe.turnOffAfterDone) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smu-off",
                value: recipe.integrationTime
            });
        }
    }

    publicRows.forEach(row => onData(row));
    unsubscribe();
}