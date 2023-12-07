/*
Copyright 2022 Verji Tech AS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


/* Extension method interfaces and their default implementations */ 
import { 
    DefaultCryptoSetupExtensions,
    DefaultExperimentalExtensions,
    IProvideCryptoSetupExtensions, 
    IProvideExperimentalExtensions
} from "./lifecycles/CryptoSetupExtensions";

import { RuntimeModule } from "./RuntimeModule";

/* The interfaces which will be exposed on modules and on ModuleRunner */ 
export type AllExtensions = {
    cryptoSetup?: IProvideCryptoSetupExtensions,
    experimental?: IProvideExperimentalExtensions     
}

export class ProxiedExtensions {

    /* TODO: Cache extension modules internally */
    public modules: RuntimeModule[] = new Array<RuntimeModule>()

    private extensionGetter =  (target: any, prop: string, receiver: any) => {
        console.log(`Checking if we have matrix-react-sdk-module-api extensions for '${prop}'`);
        if(prop == "cryptoSetup"){                
            const moduleWithImplementation = this.modules.find( m => {                   
                let ext = m.extensions![prop];
                return  ext != undefined
            });

            if(moduleWithImplementation){
                console.log(`Found module which provide ${prop} extensions`);
                return moduleWithImplementation?.extensions?.cryptoSetup;
            }
            else {
                console.log(`No modules with extensions for '${prop}' found. Returning default empty extension`);
                return new DefaultCryptoSetupExtensions();
            }            
        }
        if(prop == "experimental"){                
            const moduleWithImplementation = this.modules.find( m => {                   
                let ext = m.extensions![prop];
                return  ext != undefined
            });

            if(moduleWithImplementation){
                console.log(`Found module which provide ${prop} extensions`);
                return moduleWithImplementation?.extensions?.experimental;
            }
            else {
                console.log(`No modules with extensions for '${prop}' found. Returning default empty extension`);
                return new DefaultExperimentalExtensions();
            }            
        }
        console.log("Unknown extension!!")
    }

    private handler = {
        get: this.extensionGetter
    }
  
    public extensions: AllExtensions = new Proxy(
        {        
            cryptoSetup: undefined,
            other: undefined
        }, this.handler);

    constructor(modules: RuntimeModule[]){
        this.modules = modules;
    }
}
