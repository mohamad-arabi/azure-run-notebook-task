"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const buffer_1 = require("buffer");
const path_1 = require("path");
const request_1 = require("./request");
const fs_1 = require("fs");
// Copying from https://github.com/databricks/databricks-cli/blob/1e39ccfdbab47ee2ca7f320b81146e2bcabb2f97/databricks_cli/sdk/api_client.py
class ApiClient {
    constructor(host, token) {
        this.host = host;
        this.token = token;
        this.actionVerson = require('../../../package.json').version;
    }
    request(path, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${this.token}`,
                'User-Agent': `databricks-github-action-run-notebook/${this.actionVerson}`,
                'Content-Type': 'text/json'
            };
            return (0, request_1.httpRequest)(this.host, path, method, headers, body);
        });
    }
    // Trigger notebook job and return its ID
    triggerNotebookJob(path, clusterSpec, librariesSpec, paramsSpec, aclListSpec, timeoutSpec, runNameSpec, gitSourceSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = Object.assign(Object.assign(Object.assign(Object.assign({ tasks: [
                    Object.assign(Object.assign({ task_key: constants_1.JOB_RUN_TASK_KEY, notebook_task: Object.assign({ notebook_path: path }, paramsSpec) }, clusterSpec), librariesSpec)
                ] }, aclListSpec), timeoutSpec), runNameSpec), gitSourceSpec);
            const response = (yield this.request('/api/2.1/jobs/runs/submit', 'POST', requestBody));
            return response.run_id;
        });
    }
    awaitJobAndGetOutput(runId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = { run_id: runId };
            const response = (yield this.request('/api/2.1/jobs/runs/get', 'GET', requestBody));
            (0, utils_1.logJobRunUrl)(response.run_page_url, response.state.life_cycle_state);
            const taskRunId = response.tasks[0].run_id;
            const terminalStates = new Set(['TERMINATED', 'SKIPPED', 'INTERNAL_ERROR']);
            if (terminalStates.has(response.state.life_cycle_state)) {
                if (response.state.result_state === 'SUCCESS') {
                    const outputResponse = (yield this.request('/api/2.1/jobs/runs/get-output', 'GET', { run_id: taskRunId }));
                    return {
                        runId,
                        runUrl: outputResponse.metadata.run_page_url,
                        notebookOutput: {
                            result: outputResponse.notebook_output.result,
                            truncated: outputResponse.notebook_output.truncated
                        }
                    };
                }
                else {
                    throw new Error(`Job run did not succeed: ${response.state.state_message}`);
                }
            }
            else {
                yield new Promise(f => setTimeout(f, constants_1.GET_JOB_STATUS_POLL_INTERVAL_SECS * 1000));
                return yield this.awaitJobAndGetOutput(runId);
            }
        });
    }
    deleteDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request('/api/2.0/workspace/delete', 'POST', {
                path,
                recursive: true
            });
        });
    }
    workspaceMkdirs(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = {
                path
            };
            yield this.request('/api/2.0/workspace/mkdirs', 'POST', requestBody);
        });
    }
    readNotebookContents(path) {
        try {
            return (0, fs_1.readFileSync)(path, 'utf8');
        }
        catch (error) {
            throw new Error(`Failed to read contents of notebook at local filesystem path ${path}. Original error:\n${error}`);
        }
    }
    importNotebook(srcPath, dstPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = this.readNotebookContents(srcPath);
            const base64FileContents = new buffer_1.Buffer(fileContents).toString('base64');
            const fileSuffix = (0, path_1.extname)(srcPath).toLowerCase();
            let format = 'SOURCE';
            let language;
            switch (fileSuffix) {
                case '.py':
                    language = 'PYTHON';
                    break;
                case '.ipynb':
                    format = 'JUPYTER';
                    language = 'PYTHON';
                    break;
                case '.scala':
                    language = 'SCALA';
                    break;
                case '.r':
                    language = 'R';
                    break;
                case '.sql':
                    language = 'SQL';
                    break;
                default:
                    throw new Error(`Cannot run notebook ${srcPath} with unsupported file extension ${fileSuffix}. Supported file extensions are .py, .ipynb, .scala, .R, and .sql`);
            }
            const requestBody = {
                path: dstPath,
                content: base64FileContents,
                format,
                language
            };
            yield this.request('/api/2.0/workspace/import', 'POST', requestBody);
        });
    }
}
exports.ApiClient = ApiClient;
