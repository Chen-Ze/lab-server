import express from 'express';
import axios from 'axios';
import { getRandomId } from '../util';
import { Experiment } from './experiment';
import { Experiments } from './experiments';
import { Controller } from '../controller/controller';
import dotenv from 'dotenv';
import fs from "fs";
import winston from 'winston';
import { list as listdrives } from 'drivelist';


winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
});

const rootLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
    defaultMeta: { service: 'root' },
    transports: [
        new winston.transports.Console()
    ],
});

const experimentLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
    defaultMeta: { service: 'experiment' },
    transports: [
        new winston.transports.Console()
    ],
});

dotenv.config();

const DEFAULT_CONTROLLER_URL = process.env.CONTROLLER_ADDRESS;
const PYTHON_SCRIPT_LOCATION = process.env.PYTHON_SCRIPT_LOCATION;

const controller = new Controller(DEFAULT_CONTROLLER_URL);

const rootErrorLogger = (e: any) => {
    rootLogger.error(e);
};

export const router = express.Router();

router.get('/server/available-addresses', async (req, res, next) => {
    const list = await controller.communicate({ function: "list" }, rootErrorLogger);

    res.json({
        availableAddresses: list
    });
});

const MIN_EXPERIMENT_ID_LENGTH = 2;

const experiments = new Experiments();

router.post('/server/new-experiment', (req, res) => {
    const experimentId = getRandomId(MIN_EXPERIMENT_ID_LENGTH, experiments.getExperimentIdList());
    experimentLogger.info(`Adding experiment: ${experimentId}`);
    experiments.addExperiment(experimentId, new Experiment(experimentId, req.body, controller));
    res.json({
        id: experimentId
    });
});

router.get('/server/halt-experiment', (req, res) => {
    const id = req.query.id as string;
    experimentLogger.info(`Halting experiment: ${id}`);
    experiments.halt(id);
    res.send("End.");
});

router.get('/server/resume-experiment', (req, res) => {
    const id = req.query.id as string;
    experimentLogger.info(`Resuming experiment: ${id}`);
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
        experimentLogger.info(`Request closed on available-experiments.`);
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

    const unsubscribeError = experiment.onError.subscribe(async (message) => {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify(message)}\n\n`);
        res.flush();
    });

    const unsubscribeDataJot = experiment.onDataJot.subscribe(async (response) => {
        res.write(`event: update\n`);
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.flush();
        if (await experiment.isTerminated()) {
            experimentLogger.info(`Experiment ${experimentId} terminated.`);
            unsubscribeDataJot();
            unsubscribeError();
            res.end();
        }
    });

    req.on('close', () => {
        experimentLogger.info(`Request closed on available-experiments.`);
        unsubscribeDataJot();
        unsubscribeError();
        res.end();
    });

    experiment.signal();
});

router.get('/server/open', async (req, res, next) => {
    const { name, address }: { name: string, address: string }
        = req.query as { name: string, address: string };

    res.json(await controller.open(name, address, rootErrorLogger));
});

router.get('/server/open-model', async (req, res, next) => {
    const { name, address, model }: { name: string, address: string, model: string }
        = req.query as { name: string, address: string, model: string };

    res.json(await controller.openModel(name, address, model, rootErrorLogger));
});

router.get('/server/query', async (req, res, next) => {
    const { name, command }: { name: string, command: string }
        = req.query as { name: string, command: string };

    res.json(await controller.query(name, command, rootErrorLogger));
});

router.get('/server/query-model', async (req, res, next) => {
    const { name, model, ...query }: { name: string, model: string, [key: string]: string }
        = req.query as { name: string, model: string, [key: string]: string };

    res.json(await controller.queryModel(name, model, query, rootErrorLogger));
});

router.get('/server/communicate', async (req, res, next) => {
    const query = req.query as { [key: string]: string };
    res.json(await controller.communicate(query, rootErrorLogger));
});

router.get('/server/python-scripts', (req, res, next) => {
    fs.readdir(PYTHON_SCRIPT_LOCATION, (err, files) => {
        res.json(files);
    });
});

router.get('/server/list-directory', async (req, res, next) => {
    const path: string = req.query.path as string;
    if (!path) {
        try {
            const drives = await listdrives();
            res.json(drives.map(drive => drive.mountpoints.map(mountpoint => mountpoint.path)).flat());
        } catch (e) {
            rootLogger.error((e as Error).message);
        }
    } else {
        fs.readdir(path, (err, files) => {
            if (err) rootLogger.error((err as Error).message);
            res.json(files);
        });
    }
});
