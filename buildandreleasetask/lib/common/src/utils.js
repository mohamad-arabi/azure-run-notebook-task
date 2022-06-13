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
exports.logJobRunUrl = exports.runStepAndHandleFailure = exports.isGitRefSpecified = exports.getGitSourceSpec = exports.getRunNameSpec = exports.getTimeoutSpec = exports.getAclSpec = exports.getNotebookParamsSpec = exports.getLibrariesSpec = exports.getClusterSpec = exports.getNotebookPath = exports.getDatabricksToken = exports.getWorkspaceTempDir = exports.getDatabricksHost = exports.getInputValue = void 0;
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const path_1 = require("path");
const getInputValue = (inputKey) => {
    return (0, exports.getInputValue)(inputKey) || '';
};
exports.getInputValue = getInputValue;
const getDatabricksHost = () => {
    const hostFromInput = (0, exports.getInputValue)('databricks-host');
    const hostFromEnv = process.env['DATABRICKS_HOST'] || '';
    if (!hostFromInput && !hostFromEnv) {
        throw new Error('Either databricks-host action input or DATABRICKS_HOST env variable must be set.');
    }
    else {
        // Host passed as an action input takes president.
        return hostFromInput ? hostFromInput : hostFromEnv;
    }
};
exports.getDatabricksHost = getDatabricksHost;
const getWorkspaceTempDir = () => {
    const res = (0, exports.getInputValue)('workspace-temp-dir');
    if (!res.startsWith('/')) {
        throw new Error(`workspace-temp-dir input must be an absolute Databricks workspace path. Got invalid path ${res}`);
    }
    return res;
};
exports.getWorkspaceTempDir = getWorkspaceTempDir;
const getDatabricksToken = () => {
    const tokenFromInput = (0, exports.getInputValue)('databricks-token');
    const tokenFromEnv = process.env['DATABRICKS_TOKEN'] || '';
    if (!tokenFromInput && !tokenFromEnv) {
        throw new Error('Either databricks-token action input or DATABRICKS_TOKEN env variable must be set.');
    }
    else {
        // Token passed as an action input takes president.
        return tokenFromInput ? tokenFromInput : tokenFromEnv;
    }
};
exports.getDatabricksToken = getDatabricksToken;
const getNotebookPath = () => {
    const localNotebookPath = (0, exports.getInputValue)('local-notebook-path');
    const workspaceNotebookPath = (0, exports.getInputValue)('workspace-notebook-path');
    if (!localNotebookPath && !workspaceNotebookPath) {
        throw new Error('Either `local-notebook-path` or `workspace-notebook-path` inputs must be set.');
    }
    else if (localNotebookPath && workspaceNotebookPath) {
        throw new Error('Only one of `local-notebook-path` and `workspace-notebook-path` must be set, not both.');
    }
    else if (localNotebookPath) {
        if ((0, path_1.isAbsolute)(localNotebookPath)) {
            throw new Error(`'local-notebook-path' input must be a relative path, instead recieved: ${localNotebookPath}`);
        }
        if ((0, exports.isGitRefSpecified)()) {
            // Strip the file extension from the notebook path.
            return localNotebookPath.split('.').slice(0, -1).join('.');
        }
        else {
            return localNotebookPath;
        }
    }
    else {
        if (!(0, path_1.isAbsolute)(workspaceNotebookPath)) {
            throw new Error(`'workspace-notebook-path' input must be an absolute path, instead recieved: ${workspaceNotebookPath}`);
        }
        return workspaceNotebookPath;
    }
};
exports.getNotebookPath = getNotebookPath;
const getClusterSpec = () => {
    const existingClusterId = (0, exports.getInputValue)('existing-cluster-id');
    const newClusterJsonString = (0, exports.getInputValue)('new-cluster-json');
    if (!newClusterJsonString && !existingClusterId) {
        throw new Error('Either `existing-cluster-id` or `new-cluster-json` inputs must be set.');
    }
    else if (newClusterJsonString && existingClusterId) {
        throw new Error('Only one of `existing-cluster-id` and `new-cluster-json` must be set, not both.');
    }
    else if (newClusterJsonString) {
        const newClusterSpec = JSON.parse(newClusterJsonString);
        return { new_cluster: newClusterSpec };
    }
    else {
        return { existing_cluster_id: existingClusterId };
    }
};
exports.getClusterSpec = getClusterSpec;
const getLibrariesSpec = () => {
    const librariesJsonString = (0, exports.getInputValue)('libraries-json');
    return librariesJsonString
        ? {
            libraries: JSON.parse(librariesJsonString)
        }
        : {};
};
exports.getLibrariesSpec = getLibrariesSpec;
const getNotebookParamsSpec = () => {
    const paramsJsonString = (0, exports.getInputValue)('notebook-params-json');
    return paramsJsonString
        ? {
            base_parameters: JSON.parse(paramsJsonString)
        }
        : {};
};
exports.getNotebookParamsSpec = getNotebookParamsSpec;
const getAclSpec = () => {
    const aclJsonString = (0, exports.getInputValue)('access-control-list-json');
    return aclJsonString
        ? {
            access_control_list: JSON.parse(aclJsonString)
        }
        : {};
};
exports.getAclSpec = getAclSpec;
const getTimeoutSpec = () => {
    const timeoutInSeconds = (0, exports.getInputValue)('timeout-seconds');
    return timeoutInSeconds
        ? {
            timeout_seconds: Number(timeoutInSeconds)
        }
        : {};
};
exports.getTimeoutSpec = getTimeoutSpec;
const getRunNameSpec = () => {
    const runName = (0, exports.getInputValue)('run-name');
    return runName
        ? {
            run_name: runName
        }
        : {};
};
exports.getRunNameSpec = getRunNameSpec;
const getGitSourceSpec = () => {
    const gitBranch = (0, exports.getInputValue)('git-branch');
    const gitTag = (0, exports.getInputValue)('git-tag');
    const gitCommit = (0, exports.getInputValue)('git-commit');
    const gitRepoUrl = (0, exports.getInputValue)('git-repo-url');
    const baseGitSourceSpec = {
        git_url: gitRepoUrl,
        git_provider: 'github'
    };
    if (!(0, exports.isGitRefSpecified)()) {
        return {};
    }
    else if (gitBranch && !gitTag && !gitCommit) {
        return {
            git_source: Object.assign(Object.assign({}, baseGitSourceSpec), { git_branch: gitBranch })
        };
    }
    else if (gitTag && !gitBranch && !gitCommit) {
        return {
            git_source: Object.assign(Object.assign({}, baseGitSourceSpec), { git_tag: gitTag })
        };
    }
    else if (gitCommit && !gitBranch && !gitTag) {
        return {
            git_source: Object.assign(Object.assign({}, baseGitSourceSpec), { git_commit: gitCommit })
        };
    }
    else {
        throw new Error('Only one of `git-branch`, `git-tag`, or `git-commit` must be set, not more.');
    }
};
exports.getGitSourceSpec = getGitSourceSpec;
const isGitRefSpecified = () => {
    const gitBranch = (0, exports.getInputValue)('git-branch');
    const gitTag = (0, exports.getInputValue)('git-tag');
    const gitCommit = (0, exports.getInputValue)('git-commit');
    return gitBranch !== '' || gitTag !== '' || gitCommit !== '';
};
exports.isGitRefSpecified = isGitRefSpecified;
const runStepAndHandleFailure = (runStep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield runStep();
    }
    catch (error) {
        if (error instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, error.message);
        }
        throw error;
    }
});
exports.runStepAndHandleFailure = runStepAndHandleFailure;
const logJobRunUrl = (jobRunUrl, jobRunStatus) => {
    // Note: For Azure custom pipeline, console.log() is used to log info.
    console.log(`Notebook run has status ${jobRunStatus}. URL: ${jobRunUrl}`);
};
exports.logJobRunUrl = logJobRunUrl;
