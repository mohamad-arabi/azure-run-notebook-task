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
exports.importNotebookIfNeeded = void 0;
const path = __importStar(require("path"));
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const constants_1 = require("../../common/src/constants");
const api_client_1 = require("../../common/src/api-client");
const crypto_1 = require("crypto");
const path_1 = require("path");
const utils_1 = require("../../common/src/utils");
const getNotebookUploadDirectory = (workspaceTempDir) => {
    const baseDir = workspaceTempDir.endsWith('/')
        ? workspaceTempDir
        : `${workspaceTempDir}/`;
    return `${baseDir}${(0, crypto_1.randomUUID)()}`;
};
const importTmpNotebook0 = (databricksHost, databricksToken, localNotebookPath, workspaceTempDir) => __awaiter(void 0, void 0, void 0, function* () {
    const tmpNotebookDirectory = getNotebookUploadDirectory(workspaceTempDir);
    const apiClient = new api_client_1.ApiClient(databricksHost, databricksToken);
    yield apiClient.workspaceMkdirs(tmpNotebookDirectory);
    tl.setTaskVariable(constants_1.DATABRICKS_TMP_NOTEBOOK_UPLOAD_DIR_STATE_KEY, tmpNotebookDirectory);
    const notebookFilename = path.basename(localNotebookPath);
    const tmpNotebookPath = path.join(tmpNotebookDirectory, notebookFilename);
    yield apiClient.importNotebook(localNotebookPath, tmpNotebookPath);
    return { tmpNotebookPath, tmpNotebookDirectory };
});
const importTmpNotebook = (databricksHost, databricksToken, localNotebookPath, workspaceTempDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield importTmpNotebook0(databricksHost, databricksToken, localNotebookPath, workspaceTempDir);
    }
    catch (error) {
        if (error instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, error.message);
        }
        throw error;
    }
});
const importNotebookIfNeeded = (databricksHost, databricksToken, notebookPath, workspaceTmpDir) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, path_1.isAbsolute)(notebookPath) || (0, utils_1.isGitRefSpecified)()) {
        return { notebookPath };
    }
    const { tmpNotebookPath, tmpNotebookDirectory } = yield importTmpNotebook(databricksHost, databricksToken, notebookPath, workspaceTmpDir);
    return { notebookPath: tmpNotebookPath, tmpNotebookDirectory };
});
exports.importNotebookIfNeeded = importNotebookIfNeeded;
