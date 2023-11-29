/*
Copyright 2023 Verji Tech AS

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
    SetupEncryptionKind,
    ExperimentalExtensionsBase,
} from "../../src/lifecycles/CryptoSetupExtensions";

import { ProxiedExtensions } from "../../src/ProxiedExtensions";

describe("Single module CryptoSetupExtensions", () => {

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);

                this.extensions = {
                    cryptoSetup: new (class extends CryptoSetupExtensionsBase {
                        PersistCredentials(credentials: IExtendedMatrixClientCreds): void {
                        }
                        CatchAccessSecretStorageError(e: Error): void {                            
                        }
                        SetupEncryptionNeeded(kind: SetupEncryptionKind): boolean {
                            return true;
                        }
                        async GetDehydrationKey(): Promise<Uint8Array> {
                            return new Uint8Array([0x0, 0x1, 0x2, 0x3]);
                        }
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

    it("should return correct value for GetSecretStorageKey for single module", () => {
        let result = module.extensions!.cryptoSetup!.GetSecretStorageKey();
        expect(result).toEqual("my secret storage key");
    });

    it("should return correct value for GetDehyrationKey for single module", async () => {
        let result = await module.extensions!.cryptoSetup!.GetDehydrationKey();
        expect(result).toEqual(new Uint8Array([0x0, 0x1, 0x2, 0x3]));
    });

    it("should allow adding secure backup key to login response for single module", () => {
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

        module.extensions!.cryptoSetup!.ExamineLoginResponse({sub: "my-sub"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my secure backup key");
    });
});


describe("Proxied modules CryptoSetupExtensions", () => {

    let proxiedExtensions: ProxiedExtensions;

    beforeAll(() => {

        var modules = [

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
                    // construct a module with no extensions exposed    
                }
            })(),

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
                    // construct a module with ExperimentalExtensions exposed    
                    this.extensions = {
                        experimental: new (class extends ExperimentalExtensionsBase {
                            ExperimentalMethod(arg: any): string {
                                return arg;
                            }
                        })()
                    }
                }
            })(),

            new (class extends RuntimeModule {
                public constructor() {
                    super(undefined as any);
    
                    // construct a module with CryptoSetupExtensions exposed    
                    this.extensions = {
                        cryptoSetup: new (class extends CryptoSetupExtensionsBase {

                            PersistCredentials(credentials: IExtendedMatrixClientCreds): void {
                            }

                            CatchAccessSecretStorageError(e: Error): void {                            
                            }
                            SetupEncryptionNeeded(kind: SetupEncryptionKind): boolean {
                                return true;
                            }

                            async GetDehydrationKey(): Promise<Uint8Array> {
                                return new Uint8Array([0x4, 0x3, 0x2, 0x1]);
                            }

                            GetSecretStorageKey() {
                                return "my proxied secret storage key"
                            }
            
                            ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                                credentials.secureBackupKey = "my proxied secure backup key";          
                            }
                        })()
                    }
                }
            })()            
        ];
        proxiedExtensions = new ProxiedExtensions(modules);
    });

    it("should not throw calling ExperimentalMethod without arguments for proxied modules", () => {

        let t = () => proxiedExtensions!.extensions!.experimental!.ExperimentalMethod();    
        expect(t).not.toThrow();    
    });

    it("should return correct value for ExperimentalMethod for proxied modules", () => {
        let result = proxiedExtensions!.extensions!.experimental!.ExperimentalMethod("test 123");
        expect(result).toEqual("test 123");
    });

    it("should return correct value for GetSecretStorageKey for proxied modules", () => {
        let result = proxiedExtensions!.extensions!.cryptoSetup!.GetSecretStorageKey();
        expect(result).toEqual("my proxied secret storage key");
    });

    it("should return correct value for GetDehyrationKey for proxied modules", async () => {
        let result = await proxiedExtensions.extensions!.cryptoSetup!.GetDehydrationKey();
        expect(result).toEqual(new Uint8Array([0x4, 0x3, 0x2, 0x1]));
    });

    it("should allow adding secure backup key to login response for proxied modules", () => {
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

        proxiedExtensions.extensions.cryptoSetup!.ExamineLoginResponse({secureBackupKey: "my key"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my proxied secure backup key");
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
    
    it("proxy must throw when we have no modules", () => {

        var modules = new Array<RuntimeModule>();
        var proxiedExtensions = new ProxiedExtensions(modules);

        let t = () => proxiedExtensions.extensions.cryptoSetup!.GetSecretStorageKey();    
        expect(t).toThrow(Error);    
    });
});
