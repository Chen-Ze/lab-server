import axios from 'axios';
import AwaitLock from 'await-lock';


export class Controller {
    controllerUrl: string;
    lock = new AwaitLock();

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl;
    }

    async communicate(params: { [key: string]: string }) {
        await this.lock.acquireAsync();
        try {
            const response = await axios.get(this.controllerUrl, { params });
            return response.data;
        } finally {
            this.lock.release();
        }
    }

    async open(name: string, address: string) {
        return await this.communicate({
            function: "open",
            name,
            address
        });
    }

    async openModel(name: string, address: string, model: string) {
        return await this.communicate({
            function: "openModel",
            name,
            address,
            model
        });
    }

    async query(name: string, command: string) {
        return await this.communicate({
            function: "query",
            name,
            command
        });
    }

    async queryModel(name: string, model: string, query: { [key: string]: string }) {
        return await this.communicate({
            function: "queryModel",
            name,
            model,
            ...query
        });
    }

    async write(name: string, command: string) {
        return await this.communicate({
            function: "write",
            name,
            command
        });
    }

    async read(name: string) {
        return await this.communicate({
            function: "read",
            name,
        });
    }

    async dataReady(name: string) {
        return await this.communicate({
            function: "dataReady",
            name,
        });
    }
}

