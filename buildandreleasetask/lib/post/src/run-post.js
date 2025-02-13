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
exports.runPost = void 0;
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const delete_tmp_notebook_1 = require("./delete-tmp-notebook");
const constants_1 = require("../../common/src/constants");
const utils_1 = require("../../common/src/utils");
function runPostHelper() {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpNotebookDirectory = tl.getTaskVariable(constants_1.DATABRICKS_TMP_NOTEBOOK_UPLOAD_DIR_STATE_KEY);
        if (tmpNotebookDirectory) {
            yield (0, delete_tmp_notebook_1.deleteTmpNotebooks)((0, utils_1.getDatabricksHost)(), (0, utils_1.getDatabricksToken)(), tmpNotebookDirectory);
        }
    });
}
function runPost() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.runStepAndHandleFailure)(runPostHelper);
    });
}
exports.runPost = runPost;
