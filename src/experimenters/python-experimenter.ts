import { PythonSimpleRecipe } from "material-science-experiment-recipes/lib/python-simple-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";
import { spawn } from "child_process";


export const pythonExperimenter = async (
    recipe: PythonSimpleRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents
) => {
    let haltFlag = false;
    const unsubscribe = onHalt.subscribe(() => haltFlag = true);

    const publicRows: RawDataRow[] = [];

    await new Promise((resolve, reject) => {
        const pythonProcess = spawn(recipe.command.split(" ")[0], recipe.command.split(" ").slice(1));

        pythonProcess.stdout.on('data', (data) => {
            // tslint:disable-next-line:no-console
            console.log(`Python stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            // tslint:disable-next-line:no-console
            console.error(`Python stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            // tslint:disable-next-line:no-console
            console.log(`Python child process exited with code ${code}`);
            resolve(code);
        });
    });

    publicRows.forEach(row => onData(row));
    unsubscribe();
}