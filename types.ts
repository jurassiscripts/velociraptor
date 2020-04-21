export interface EnvironmentVariables {
    [key: string]: any;
}

export type Permission = 'all' | 'env' | 'hrtime' | 'net' | 'plugin' | 'read' | 'run' | 'write';

export interface Permissions {
    all?: boolean;
    env?: boolean;
    hrtime?: boolean;
    net?: boolean | string;
    plugin?: boolean;
    read?: boolean | string;
    run?: boolean;
    write?: boolean | string;
}

export interface V8Flags {
    [key: string]: any;
}

export interface ScriptObject extends ScriptParameters {
    cmd: string;
}

export type Script = string | ScriptObject;

export interface ParallelScripts {
    pll: Script[];
}

export type CompositeScript = Array<Script | ParallelScripts>;

export type ScriptDefinition = Script | CompositeScript;

export interface Scripts {
    [key: string]: ScriptDefinition;
}

export interface ScriptParameters {
    env?: EnvironmentVariables;
    allow?: Permissions | Permission[];
    v8flags?: V8Flags | string;
}

export interface ScriptsConfiguration extends ScriptParameters {
    scripts: Scripts;
    imap?: string;
    lock?: boolean | string;
}
