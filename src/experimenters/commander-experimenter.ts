import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { CommanderRecipe } from "material-science-experiment-recipes/lib/commander-recipe";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { experimentExecuter } from "./experiment-executer";
import { ISignal } from "ste-signals";
import { Controller } from "../controller/controller";
import AwaitLock from 'await-lock';
import stringify from 'csv-stringify';
import { promises as fsPromises } from 'fs';


export const commanderExperimenter = async (
    recipe: CommanderRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow | RawDataRow[]) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    let haltFlag = false;
    const unsubscribeHalt = onHalt.subscribe(() => haltFlag = true);

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

    if (recipe.dataFile) {
        const columnsCsvString = await new Promise<string>((resolve, reject) => {
            stringify([recipe.columns], (err, output) => {
                resolve(output);
            });
        });
        await fsPromises.appendFile(recipe.dataFile, columnsCsvString);
    }

    const lock = new AwaitLock();

    const onDataWrapped = async (data: RawDataRow | RawDataRow[]) => {
        if (!recipe.dataFile) {
            onData(data);
            return;
        }
        const rows = Array.isArray(data) ? data : [data];
        const lines = rows.map(row => recipe.columns.map(column => row[column]));
        await lock.acquireAsync();
        try {
            const csvString = await new Promise<string>((resolve, reject) => {
                stringify(lines, (err, output) => {
                    resolve(output);
                });
            });
            await fsPromises.appendFile(recipe.dataFile, csvString);
        } finally {
            lock.release();
        }
        onData(data);
    };

    for (const subrecipe of subsequence) {
        if (haltFlag) break;
        await experimentExecuter(subrecipe, onDataWrapped, onHalt, controller, events);
    }

    unsubscribeHalt();
}
