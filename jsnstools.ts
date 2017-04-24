/// <reference path="node_modules/jsns/jsns.ts" />
import * as io from './io';

const vm = require('vm');
const util = require('util');

interface IContextResult{
    jsns?: any; 
    console;
}

interface SaveModulesOptions{
    /**
     * Likely this will be rare to specify manually, however, if you have runners that define non default (undefined)
     * sources you can ignore those sources in the final output file if you wish.
     */
    ignoredSources?: any[];

    /**
     * Pass true to call jsns.debug() after loading the modules. Helpful for debugging to see what might not be loaded.
     */
    printJsnsDebug?: boolean;
}

const passedRunnerSource = "JsnsTools-PassedRunner!!$$##";

export async function streamLoadedModules(js: string, runners: string[], options?: SaveModulesOptions){
    if(options === undefined){
        options = {};
    }

    var ignoredSources = options.ignoredSources;
    if(ignoredSources === undefined){
        ignoredSources = [];
    }
    ignoredSources.push(passedRunnerSource);

    var script = new vm.Script(js);
    
    var sandbox: IContextResult = {
        console: console
    };
    var context = vm.createContext(sandbox);
    script.runInContext(context);

    var jsns = sandbox.jsns;

    for(let i = 0; i < runners.length; ++i){
        let runner = runners[i];
        jsns.run(runner, passedRunnerSource);
    }

    var modules = jsns.createFileFromLoaded(ignoredSources);
    
    if(options.printJsnsDebug === true){
        jsns.debug();
    }

    return modules;
}

export async function saveLoadedModules(src: string, runners: string[], dest: string, options?: SaveModulesOptions){
    if(options === undefined){
        options = {};
    }

    var js = 'var jsnsOptions = jsnsOptions || { simulateModuleLoading: true };\nvar Element = { prototype: {} };\nvar window = {Promise: "nofill"};\nvar document = { querySelectorAll: function () { return []; } };\n' 
        + await io.readFile(src);

    var modules = await streamLoadedModules(js, runners, options);

    await io.writeFile(dest, modules);

    return modules;
}