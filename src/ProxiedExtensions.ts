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


/* Extension methods */ 
import { 
    IProvideCryptoSetupExtensions, 
    IProvideExperimentalExtensions
} from "./lifecycles/CryptoSetupExtensions";

import { RuntimeModule } from "./RuntimeModule";

export type AllExtensions = {
    cryptoSetup?: IProvideCryptoSetupExtensions,
    experimental?: IProvideExperimentalExtensions     
}

export class ProxiedExtensions {

    public modules: RuntimeModule[] = new Array<RuntimeModule>()

    private extensionGetter =  (target: any, prop: string, receiver: any) => {
        if(prop == "cryptoSetup"){                
            let m = this.modules.find( m => {                   
                let ext = m.extensions![prop];
                return  ext != undefined
            });
            return m?.extensions?.cryptoSetup;
        }
        if(prop == "experimental"){                
            let m = this.modules.find( m => {                   
                let ext = m.extensions![prop];
                return  ext != undefined
            });
            return m?.extensions?.experimental;
        }
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
