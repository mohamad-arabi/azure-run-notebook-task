import { JobRunOutput } from './interfaces';
export declare class ApiClient {
    host: string;
    token: string;
    actionVerson: string;
    constructor(host: string, token: string);
    request(path: string, method: string, body: object): Promise<object>;
    triggerNotebookJob(path: string, clusterSpec: object, librariesSpec?: object, paramsSpec?: object, aclListSpec?: object, timeoutSpec?: object, runNameSpec?: object, gitSourceSpec?: object): Promise<number>;
    awaitJobAndGetOutput(runId: number): Promise<JobRunOutput>;
    deleteDirectory(path: string): Promise<void>;
    workspaceMkdirs(path: string): Promise<void>;
    readNotebookContents(path: string): string;
    importNotebook(srcPath: string, dstPath: string): Promise<void>;
}
//# sourceMappingURL=api-client.d.ts.map