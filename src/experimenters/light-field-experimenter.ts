import { LightFieldRecipe, LightFieldTask } from "material-science-experiment-recipes/lib/lightfield-recipe";
import { RawDataRow } from "../routes/experiment";
import { Experimenter } from "./experimenter";


const spectrumIndex: {
    [key: string]: number
} = {};

export const lightFieldExperimenter: Experimenter<LightFieldRecipe> = async (props) => {
    const { recipe, subsequence, onData, onError, onHalt, controller, events, id } = props;

    const publicRows: RawDataRow[] = [];

    switch (recipe.task) {
        case LightFieldTask.ActivateWindow:
            await controller.queryModel("LIGHT_FIElD", "LightField", {
                task: "activate",
            }, onError);
            break;
        case LightFieldTask.SaveSpectrum:
            if (!spectrumIndex[id]) {
                spectrumIndex[id] = 0;
            }
            const response = await controller.queryModel("LIGHT_FIElD", "LightField", {
                task: "save-spectrum",
                dir: recipe.payload.directory || __dirname,
                filename: `${recipe.payload.prefix || ''}${spectrumIndex[id]++}`
            }, onError);
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

    onData(publicRows);
}