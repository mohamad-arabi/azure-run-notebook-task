export declare const getInputValue: (inputKey: string) => string;
export declare const getDatabricksHost: () => string;
export declare const getWorkspaceTempDir: () => string;
export declare const getDatabricksToken: () => string;
export declare const getNotebookPath: () => string;
export declare const getClusterSpec: () => object;
export declare const getLibrariesSpec: () => object;
export declare const getNotebookParamsSpec: () => object;
export declare const getAclSpec: () => object;
export declare const getTimeoutSpec: () => object;
export declare const getRunNameSpec: () => object;
export declare const getGitSourceSpec: () => object;
export declare const isGitRefSpecified: () => boolean;
export declare const runStepAndHandleFailure: (runStep: () => Promise<void>) => Promise<void>;
export declare const logJobRunUrl: (jobRunUrl: string, jobRunStatus: string) => void;
//# sourceMappingURL=utils.d.ts.map