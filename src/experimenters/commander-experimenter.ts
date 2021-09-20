import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { CommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";
import { ISignal } from "ste-signals";
import { Controller } from "../controller/controller";

export const commanderExperimenter = async (
    recipe: CommanderRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    let haltFlag = false;
    const unsubscribe = onHalt.subscribe(() => haltFlag = true);
    for (const instrument of recipe.instruments) {
        switch (instrument.model) {
            case "Keithley 2400":
                await controller.openModel(instrument.name, instrument.address, "Model2400");
                break;
            case "Keithley 2600":
                await controller.openModel(instrument.name, instrument.address, "Model2600");
                break;
            case "GPIB":
                await controller.open(instrument.name, instrument.address);
                break;
            default:
                throw Error(`Unsupported instrument model type: ${instrument.model}.`);
        }
    }
    for (const subrecipe of subsequence) {
        if (haltFlag) break;
        await experimentExecuter(subrecipe, onData, onHalt, controller, events);
    }
    unsubscribe();
}
