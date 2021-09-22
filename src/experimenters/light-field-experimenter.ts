import { LightFieldRecipe, LightFieldTask } from "material-science-experiment-recipes/lib/lightfield-recipe";
import { WrappedRecipe } from "material-science-experiment-recipes/lib/recipe";
import { Controller } from "../controller/controller";
import { ISignal } from "ste-signals";
import { ExperimentEvents, RawDataRow } from "../routes/experiment";


const spectrumIndex: {
    [key: string]: number
} = {};

export const lightFieldExperimenter = async (
    recipe: LightFieldRecipe,
    subsequence: WrappedRecipe[],
    onData: (data: RawDataRow) => void,
    onHalt: ISignal,
    controller: Controller,
    events: ExperimentEvents,
    id: string
) => {
    const publicRows: RawDataRow[] = [];

    switch (recipe.task) {
        case LightFieldTask.ActivateWindow:
            await controller.queryModel("LIGHT_FIElD", "LightField", {
                task: "activate",
            });
            break;
        case LightFieldTask.SaveSpectrum:
            if (!spectrumIndex[id]) {
                spectrumIndex[id] = 0;
            }
            const response = await controller.queryModel("LIGHT_FIElD", "LightField", {
                task: "save-spectrum",
                dir: recipe.payload.directory || __dirname,
                filename: `${recipe.payload.prefix || ''}${spectrumIndex[id]++}`
            });
            const spectrum: number[] = response.spectrum;
            const wavelengths: number[] = response.wavelengths;
            const zippedData = spectrum.map((value, i) => ({
                "Spectrum[]": value,
                "Wavelength[]": wavelengths[i]
            }));
            zippedData.forEach((row) => {
                if (recipe.publicExports.length) publicRows.push(Object.fromEntries(recipe.publicExports.map(({ name, column }) => [
                    column, row[name as keyof typeof row]
                ])));
            });
            break;
    }

    publicRows.forEach(row => onData(row));
}