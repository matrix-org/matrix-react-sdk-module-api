/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

import { RoomViewLifecycle } from "./RoomViewLifecycle";
import { WidgetLifecycle } from "./WidgetLifecycle";
import { WrapperLifecycle } from "./WrapperLifecycle";
export type AnyLifecycle = RoomViewLifecycle | WidgetLifecycle | WrapperLifecycle;


/* Extension methods */ 
import { 
    IProvideCryptoSetupExtensions, 
    IProvideOtherExtensions
} from "./SecurityLifecycle";
import { RuntimeModule } from "../RuntimeModule";


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

export type AllExtensions = {
        cryptoSetup?: IProvideCryptoSetupExtensions,
        other?: IProvideOtherExtensions     
}
