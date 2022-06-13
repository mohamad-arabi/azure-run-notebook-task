"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.runMain = void 0;
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const run_notebook_1 = require("./run-notebook");
const constants_1 = require("../../common/src/constants");
const utils = __importStar(require("../../common/src/utils"));
const import_tmp_notebook_1 = require("./import-tmp-notebook");
function runHelper() {
    return __awaiter(this, void 0, void 0, function* () {
        const databricksHost = utils.getDatabricksHost();
        const databricksToken = utils.getDatabricksToken();
        const clusterSpec = utils.getClusterSpec();
        const librariesSpec = utils.getLibrariesSpec();
        const notebookParamsSpec = utils.getNotebookParamsSpec();
        const aclSpec = utils.getAclSpec();
        const timeoutSpec = utils.getTimeoutSpec();
        const runNameSpec = utils.getRunNameSpec();
        const gitSourceSpec = utils.getGitSourceSpec();
        const nbPath = utils.getNotebookPath();
        const workspaceTempDir = utils.getWorkspaceTempDir();
        const { notebookPath, tmpNotebookDirectory } = yield (0, import_tmp_notebook_1.importNotebookIfNeeded)(databricksHost, databricksToken, nbPath, workspaceTempDir);
        if (tmpNotebookDirectory) {
            tl.setTaskVariable(constants_1.DATABRICKS_TMP_NOTEBOOK_UPLOAD_DIR_STATE_KEY, tmpNotebookDirectory);
        }
        const runOutput = yield (0, run_notebook_1.runAndAwaitNotebook)(databricksHost, databricksToken, notebookPath, clusterSpec, librariesSpec, notebookParamsSpec, aclSpec, timeoutSpec, runNameSpec, gitSourceSpec);
        tl.setVariable(constants_1.DATABRICKS_RUN_NOTEBOOK_OUTPUT_KEY, runOutput.notebookOutput.result, false, true);
        tl.setVariable(constants_1.DATABRICKS_OUTPUT_TRUNCATED_KEY, String(runOutput.notebookOutput.truncated), false, true);
        tl.setVariable(constants_1.DATABRICKS_RUN_ID_KEY, String(runOutput.runId), false, true);
        tl.setVariable(constants_1.DATABRICKS_RUN_URL_KEY, runOutput.runUrl, false, true);
    });
}
function runMain() {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils.runStepAndHandleFailure(runHelper);
    });
}
exports.runMain = runMain;
