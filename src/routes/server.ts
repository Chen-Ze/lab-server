import express from 'express';
import axios from 'axios';
import { getRandomId } from '../util';
import { Experiment } from './experiment';
import { Experiments } from './experiments';

export const router = express.Router();

router.get('/server/available-addresses', (req, res, next) => {
    res.json({
        availableAddresses: [
            "GPIB0::26::INSTR",
            "GPIB0::27::INSTR",
            "GPIB0::28::INSTR",
        ]
    });
});

const MIN_EXPERIMENT_ID_LENGTH = 2;

const experiments = new Experiments();

router.post('/server/new-experiment', (req, res) => {
    const experimentId = getRandomId(MIN_EXPERIMENT_ID_LENGTH, experiments.getExperimentIdList());
    experiments.addExperiment(experimentId, new Experiment(experimentId, req.body));
    res.json({
        id: experimentId
    });
});

router.get('/server/available-experiments', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
    };
    res.writeHead(200, headers);

    const unsubscribe = experiments.onExperimentsChanged.subscribe((response) => {
        res.write(`event: update\n`);
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.flush();
    });

    experiments.triggerExperimentsChanged();

    req.on('close', () => {
        // tslint:disable-next-line:no-console
        console.log('available-experiments: req closed');
        unsubscribe();
        res.end();
    });
});

// the client may miss the first update event
// since the listener may be registered later than the first event
// the client should trigger this api manually
router.get('/server/trigger-available-experiments', (req, res) => {
    experiments.triggerExperimentsChanged();
    res.end();
});

router.get('/server/watch-experiment', (req, res) => {
    const experimentId = req.query.id as string;
    if (!experiments.hasId(experimentId)) {
        return res.status(500).send({
            message: `Invalid experiment id: ${experimentId}.`
        });
    }
    const experiment = experiments.getExperimentById(experimentId);

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
    };
    res.writeHead(200, headers);

    const unsubscribe = experiment.onDataJot.subscribe(async (response) => {
        res.write(`event: update\n`);
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.flush();
        if (await experiment.isTerminated()) {
            // tslint:disable-next-line:no-console
            console.log('watch-experiment: exp terminated');
            unsubscribe();
            res.end();
        }
    });

    req.on('close', () => {
        // tslint:disable-next-line:no-console
        console.log('watch-experiment: req closed');
        unsubscribe();
        res.end();
    });

    experiment.signal();
});

router.get('/server/events', async (req, res) => {
    // tslint:disable-next-line:no-console
    console.log('Got /events');
    req.on('close', () => {
        // tslint:disable-next-line:no-console
        console.log("res closed");
    });
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
    };
    res.writeHead(200, headers);

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');
    let count = 0;

    while (true) {
        const data = { ia: count, ib: count + 1 };
        await new Promise(resolve => setTimeout(resolve, 1000));
        // tslint:disable-next-line:no-console
        console.log('Emit', ++count);
        // Emit an SSE that contains the current 'count' as a string
        res.write(`event: update\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        res.flush();
        if (count === 5) break;
    }

    res.write(`event: terminate\n`);
    res.write(`data: \n\n`);

    res.end();
});

router.get('/server/query', async (req, res, next) => {
    const { name, command }: { name: string, command: string }
        = req.query as { name: string, command: string };

    const url = process.env.CONTROLLER_ADDRESS;
    const params = { name, command, function: "query" };
    const response = await axios.get(url, { params });
    res.send(response.data);
});
