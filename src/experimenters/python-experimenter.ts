import { spawn } from "child_process";
import { PythonSimpleRecipe } from "material-science-experiment-recipes/lib/python-simple-recipe";
import { RawDataRow } from "../routes/experiment";
import { Experimenter } from "./experimenter";


export const pythonExperimenter: Experimenter<PythonSimpleRecipe> = async (props) => {
    const { recipe, subsequence, onData, onHalt, controller, events } = props;

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