import express from 'express';
import axios from 'axios';
import { getRandomId } from '../util';
import { Experiment } from './experiment';
import { Experiments } from './experiments';
import { Controller } from '../controller/controller';
import dotenv from 'dotenv';
import fs from "fs";


dotenv.config();

const DEFAULT_CONTROLLER_URL = process.env.CONTROLLER_ADDRESS;
const PYTHON_SCRIPT_LOCATION = process.env.PYTHON_SCRIPT_LOCATION;

const controller = new Controller(DEFAULT_CONTROLLER_URL);

export const router = express.Router();

router.get('/server/available-addresses', async (req, res, next) => {
    const list = await controller.communicate({ function: "list" });

    res.json({
        availableAddresses: list
    });
});

const MIN_EXPERIMENT_ID_LENGTH = 2;

const experiments = new Experiments();

router.post('/server/new-experiment', (req, res) => {
    const experimentId = getRandomId(MIN_EXPERIMENT_ID_LENGTH, experiments.getExperimentIdList());
    experiments.addExperiment(experimentId, new Experiment(experimentId, req.body, controller));
    res.json({
        id: experimentId
    });
});

router.get('/server/halt-experiment', (req, res) => {
    const id = req.query.id as string;
    // tslint:disable-next-line:no-console
    console.log(`halt-experiment: ${id}`);
    experiments.halt(id);
    res.send("End.");
});

router.get('/server/resume-experiment', (req, res) => {
    const id = req.query.id as string;
    // tslint:disable-next-line:no-console
    console.log(`resume-experiment: ${id}`);
    experiments.resume(id);
    res.send("Resume.");
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

router.get('/server/open', async (req, res, next) => {
    const { name, address }: { name: string, address: string }
        = req.query as { name: string, address: string };

    res.json(await controller.open(name, address));
});

router.get('/server/open-model', async (req, res, next) => {
    const { name, address, model }: { name: string, address: string, model: string }
        = req.query as { name: string, address: string, model: string };

    res.json(await controller.openModel(name, address, model));
});

router.get('/server/query', async (req, res, next) => {
    const { name, command }: { name: string, command: string }
        = req.query as { name: string, command: string };

    res.json(await controller.query(name, command));
});

router.get('/server/query-model', async (req, res, next) => {
    const { name, model, ...query }: { name: string, model: string, [key: string]: string }
        = req.query as { name: string, model: string, [key: string]: string };

    res.json(await controller.queryModel(name, model, query));
});

router.get('/server/communicate', async (req, res, next) => {
    const query = req.query as { [key: string]: string };
    res.json(await controller.communicate(query));
});

router.get('/server/python-scripts', (req, res, next) => {
    fs.readdir(PYTHON_SCRIPT_LOCATION, (err, files) => {
        res.json(files);
    });
});
