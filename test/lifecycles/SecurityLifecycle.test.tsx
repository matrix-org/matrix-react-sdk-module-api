/*
Copyright 2023 Nordeck IT + Consulting GmbH

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

import { RuntimeModule } from "../../src";
import {
    IExtendedMatrixClientCreds,
    CryptoSetupExtensionsBase,
    ProxiedExtensions
} from "../../src/lifecycles/SecurityLifecycle";

describe("SecurityLifecycle", () => {

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);

                this.extensions = {
                    cryptoSetup: new (class extends CryptoSetupExtensionsBase {
                        GetSecretStorageKey() {
                            return "my secret storage key"
                        }
        
                        ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                            credentials.secureBackupKey = "my secure backup key";          
                        }
                    })()
                }

            }
        })();
    });

    it("should return correct value from method", () => {
        let result = module.extensions!.cryptoSetup!.GetSecretStorageKey();
        expect(result).toEqual("my secret storage key");
    });

    it("should allow adding secure backup key to login response", () => {
        var credentials = new (class implements IExtendedMatrixClientCreds {
            identityServerUrl?: string | undefined;
            userId: string = ""
            deviceId?: string | undefined;
            accessToken: string = ""
            refreshToken?: string | undefined;
            guest?: boolean | undefined;
            pickleKey?: string | undefined;
            freshLogin?: boolean | undefined;
            homeserverUrl: string = ""
            secureBackupKey?: string | undefined = ""            
        });

        module.extensions!.cryptoSetup!.ExamineLoginResponse({secureBackupKey: "my key"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my secure backup key");
    });

    it("proxy must throw when no implementation in modules", () => {


        var modules = [

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
    
                    this.extensions = {
                        cryptoSetup: undefined
                    }    
                }
            })(),

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
    
                    this.extensions = {
                        cryptoSetup: undefined
                    }
                }
            })()
        ];

        var proxiedExtensions = new ProxiedExtensions(modules);

        let t = () => proxiedExtensions.extensions.cryptoSetup!.GetSecretStorageKey();    
        expect(t).toThrow(Error);
    
    });
    
    it("proxy must throw when no implementation in modules", () => {

        var modules = new Array<RuntimeModule>();
        var proxiedExtensions = new ProxiedExtensions(modules);

        let t = () => proxiedExtensions.extensions.cryptoSetup!.GetSecretStorageKey();    
        expect(t).toThrow(Error);    
    });


    it("proxy must select module with extension implementation", () => {


        var modules = [

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
    
                    this.extensions = {
                        cryptoSetup: new (class extends CryptoSetupExtensionsBase {
                            GetSecretStorageKey() {
                                return "my secret storage key"
                            }
            
                            ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                                credentials.secureBackupKey = "my secure backup key";          
                            }
                        })()
                    }
                }
            })(),

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
    
                    this.extensions = {
                        cryptoSetup: new (class extends CryptoSetupExtensionsBase {
                            GetSecretStorageKey() {
                                return "my secret storage key"
                            }
            
                            ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                                credentials.secureBackupKey = "my secure backup key";          
                            }
                        })()
                    }
                }
            })()
        ];

        var proxiedExtensions = new ProxiedExtensions(modules);
        let result = proxiedExtensions.extensions.cryptoSetup!.GetSecretStorageKey();
        expect(result).toEqual("my secret storage key");
    });
});
