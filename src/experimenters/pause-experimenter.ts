import { PauseRecipe } from "material-science-experiment-recipes/lib/pause-recipe";
import { Experimenter } from "./experimenter";

export const pauseExperimenter: Experimenter<PauseRecipe> = async (props) => {
    const { recipe, subsequence, onData, onHalt, controller, events } = props;

    let unsubscribeHalt: () => void;
    let unsubscribeResume: () => void;

    await new Promise((resolve, reject) => {
        unsubscribeHalt = onHalt.subscribe(() => resolve(0));
        unsubscribeResume = events.onResume.subscribe(() => resolve(0));
    });

    if (unsubscribeHalt) unsubscribeHalt();
    if (unsubscribeResume) unsubscribeResume();
}
