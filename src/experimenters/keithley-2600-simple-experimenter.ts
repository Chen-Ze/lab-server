import { Keithley2636SimpleRecipe } from "material-science-experiment-recipes/lib/keithley-2636-simple-recipe";
import { isOffChannelRecipe, isSweepChannelRecipe, SMUMode } from "material-science-experiment-recipes/lib/keithley-simple/smu-recipe";
import { RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";
import { Experimenter, experimentExecuterProps } from "./experimenter";
import { measurementFlag, smuRecipeToArray } from "./keithley-smu";
import { arrayDirectProduct, sleep, zipArray } from "./util";


export const keithley2600SimpleExperimenter: Experimenter<Keithley2636SimpleRecipe> = async (props) => {
    const { recipe, subsequence, onData, onError, onHalt, controller, events } = props;

    let haltFlag = false;
    const unsubscribe = onHalt.subscribe(() => haltFlag = true);

    const publicRows: RawDataRow[] = [];

    if (isSweepChannelRecipe(recipe.smuARecipe) && !Number(recipe.smuARecipe.step)) {
        recipe.smuARecipe.step = recipe.smuARecipe.interval;
    }

    if (isSweepChannelRecipe(recipe.smuBRecipe) && !Number(recipe.smuBRecipe.step)) {
        recipe.smuBRecipe.step = recipe.smuBRecipe.interval;
    }

    const smuAArray = smuRecipeToArray(recipe.smuARecipe);
    const smuBArray = smuRecipeToArray(recipe.smuBRecipe);
    const [smuAArrayProducted, smuBArrayProducted] = arrayDirectProduct(
        smuAArray, smuBArray
    );
    const smuArrayZipped = zipArray(
        smuAArrayProducted, smuBArrayProducted
    ).map(
        ([subarray1, subarray2]) => zipArray(...arrayDirectProduct(subarray1, subarray2))
    );

    await controller.queryModel(recipe.name, "Model2600", {
        task: "set-integration-time",
        value: recipe.integrationTime
    }, onError);

    if (isOffChannelRecipe(recipe.smuARecipe)) {
        await controller.queryModel(recipe.name, "Model2600", {
            task: "set-smua-off",
            value: recipe.integrationTime
        }, onError);
    }
    if (isOffChannelRecipe(recipe.smuBRecipe)) {
        await controller.queryModel(recipe.name, "Model2600", {
            task: "set-smub-off",
            value: recipe.integrationTime
        }, onError);
    }

    if (Number(recipe.smuARecipe.compliance)) {
        if (recipe.smuARecipe.smuMode === SMUMode.FixedVoltage || recipe.smuARecipe.smuMode === SMUMode.SweepVoltage) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smua-current-compliance",
                value: recipe.smuARecipe.compliance
            }, onError);
        }
        if (recipe.smuARecipe.smuMode === SMUMode.FixedCurrent || recipe.smuARecipe.smuMode === SMUMode.SweepCurrent) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smua-voltage-compliance",
                value: recipe.smuARecipe.compliance
            }, onError);
        }
    }

    if (Number(recipe.smuBRecipe.compliance)) {
        if (recipe.smuBRecipe.smuMode === SMUMode.FixedVoltage || recipe.smuBRecipe.smuMode === SMUMode.SweepVoltage) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smub-current-compliance",
                value: recipe.smuBRecipe.compliance
            }, onError);
        }
        if (recipe.smuBRecipe.smuMode === SMUMode.FixedCurrent || recipe.smuBRecipe.smuMode === SMUMode.SweepCurrent) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smub-voltage-compliance",
                value: recipe.smuBRecipe.compliance
            }, onError);
        }
    }

    const measureSMUAVoltage = measurementFlag(recipe, "SMU A Voltage");
    const measureSMUACurrent = measurementFlag(recipe, "SMU A Current");
    const measureSMUBVoltage = measurementFlag(recipe, "SMU B Voltage");
    const measureSMUBCurrent = measurementFlag(recipe, "SMU B Current");

    for (const smuSubArray of smuArrayZipped) {
        if (haltFlag) break;
        for (const smuPair of smuSubArray) {
            if (haltFlag) break;
            if (recipe.smuARecipe.smuMode === SMUMode.FixedVoltage || recipe.smuARecipe.smuMode === SMUMode.SweepVoltage) {
                await controller.queryModel(recipe.name, "Model2600", {
                    task: "set-smua-voltage",
                    value: String(smuPair[0])
                }, onError);
            }
            if (recipe.smuARecipe.smuMode === SMUMode.FixedCurrent || recipe.smuARecipe.smuMode === SMUMode.SweepCurrent) {
                await controller.queryModel(recipe.name, "Model2600", {
                    task: "set-smua-current",
                    value: String(smuPair[0])
                }, onError);
            }
            if (recipe.smuBRecipe.smuMode === SMUMode.FixedVoltage || recipe.smuBRecipe.smuMode === SMUMode.SweepVoltage) {
                await controller.queryModel(recipe.name, "Model2600", {
                    task: "set-smub-voltage",
                    value: String(smuPair[1])
                }, onError);
            }
            if (recipe.smuBRecipe.smuMode === SMUMode.FixedCurrent || recipe.smuBRecipe.smuMode === SMUMode.SweepCurrent) {
                await controller.queryModel(recipe.name, "Model2600", {
                    task: "set-smub-current",
                    value: String(smuPair[1])
                }, onError);
            }
            await sleep(Number(recipe.wait));

            const measurement = {
                "SMU A Voltage": measureSMUAVoltage ? (
                    Number((await controller.queryModel(recipe.name, "Model2600", {
                        task: "measure-smua-voltage",
                    }, onError)).read)
                ) : NaN,
                "SMU A Current": measureSMUACurrent ? (
                    Number((await controller.queryModel(recipe.name, "Model2600", {
                        task: "measure-smua-current",
                    }, onError)).read)
                ) : NaN,
                "SMU B Voltage": measureSMUBVoltage ? (
                    Number((await controller.queryModel(recipe.name, "Model2600", {
                        task: "measure-smub-voltage",
                    }, onError)).read)
                ) : NaN,
                "SMU B Current": measureSMUBCurrent ? (
                    Number((await controller.queryModel(recipe.name, "Model2600", {
                        task: "measure-smub-current",
                    }, onError)).read)
                ) : NaN,
            };

            if (recipe.privateExports.length) onData(Object.fromEntries(recipe.privateExports.map(({ name, column }) => [
                column, measurement[name as keyof typeof measurement]
            ])));

            const publicMeasurement = Object.fromEntries(Object.entries(measurement).map(([key, value]) => [key + "[]", value]));

            if (recipe.publicExports.length) publicRows.push(Object.fromEntries(recipe.publicExports.map(({ name, column }) => [
                column, publicMeasurement[name]
            ])));
        }

        for (const subrecipe of subsequence) {
            if (haltFlag) break;
            await experimentExecuter(experimentExecuterProps(subrecipe, props));
        }
    }

    if (!haltFlag) {
        // don't turn off the smu if experiment is halted by the user
        // otherwise the voltage may jump
        if (recipe.smuARecipe.turnOffAfterDone) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smua-off",
                value: recipe.integrationTime
            }, onError);
        }
        if (recipe.smuBRecipe.turnOffAfterDone) {
            await controller.queryModel(recipe.name, "Model2600", {
                task: "set-smub-off",
                value: recipe.integrationTime
            }, onError);
        }
    }

    publicRows.forEach(row => onData(row));
    unsubscribe();
}