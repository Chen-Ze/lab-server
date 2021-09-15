"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var server_1 = require("./routes/server");
var compression_1 = __importDefault(require("compression"));
var fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, compression_1.default)());
var port = Number(process.env.PORT); // default port to listen
if (!process.env.BUILD_LOCATION || !fs_1.default.existsSync(path_1.default.join(process.env.BUILD_LOCATION, 'index.html'))) {
    throw new Error("Client build not found.");
}
app.use(express_1.default.static(path_1.default.resolve(process.env.BUILD_LOCATION)));
app.use(express_1.default.json());
// app.use(logger('dev'));
app.use('/', server_1.router);
app.use('/server/vs', express_1.default.static(path_1.default.join(__dirname, '..', '/node_modules/monaco-editor/min/vs')));
// start the Express server
app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost:" + port);
});
//# sourceMappingURL=index.js.map