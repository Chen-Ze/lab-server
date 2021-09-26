import axios from 'axios';
import AwaitLock from 'await-lock';
import { ErrorReporter } from '../experimenters/experimenter';


export class Controller {
    controllerUrl: string;
    lock = new AwaitLock();

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl;
    }

    async communicate(params: { [key: string]: string }, onError: ErrorReporter) {
        await this.lock.acquireAsync();
        try {
            const response = await axios.get(this.controllerUrl, { params });
            if (response.data.error !== undefined) {
                onError(response.data);
            }
            return response.data;
        } catch (e) {
            onError(e);
        }finally {
            this.lock.release();
        }
    }

    async open(name: string, address: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "open",
            name,
            address
        }, onError);
    }

    async openModel(name: string, address: string, model: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "openModel",
            name,
            address,
            model
        }, onError);
    }

    async query(name: string, command: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "query",
            name,
            command
        }, onError);
    }

    async queryModel(name: string, model: string, query: { [key: string]: string }, onError: ErrorReporter) {
        return await this.communicate({
            function: "queryModel",
            name,
            model,
            ...query
        }, onError);
    }

    async write(name: string, command: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "write",
            name,
            command
        }, onError);
    }

    async read(name: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "read",
            name,
        }, onError);
    }

    async dataReady(name: string, onError: ErrorReporter) {
        return await this.communicate({
            function: "dataReady",
            name,
        }, onError);
    }
}

