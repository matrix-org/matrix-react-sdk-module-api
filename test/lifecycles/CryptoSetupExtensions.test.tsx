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
    SecretStorageKeyDescription,
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
                        persistCredentials(credentials: IExtendedMatrixClientCreds): void {
                        }
                        catchAccessSecretStorageError(e: Error): void {                            
                        }
                        setupEncryptionNeeded(kind: SetupEncryptionKind): boolean {
                            return true;
                        }
                        getSecretStorageKey(): Uint8Array | null {
                            return new Uint8Array([0xaa, 0xbb, 0xbb, 0xaa])
                        }
                        createSecretStorageKey(): Uint8Array | null {
                            return new Uint8Array([0xaa, 0xbb, 0xbb, 0xaa, 0xaa, 0xbb, 0xbb, 0xaa]);
                        }                    
                        getDehydrationKeyCallback(): ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>) | null {
                            return (_,__) => Promise.resolve(new Uint8Array([0x0, 0x1, 0x2, 0x3]) );
                        }
                        examineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                            credentials.secureBackupKey = "my secure backup key";          
                        }
                    })()
                }
            }
        })();
    });

    it("should return correct value for getSecretStorageKey for single module", () => {
        let result = module.extensions!.cryptoSetup!.getSecretStorageKey();
        expect(result).toEqual(Uint8Array.from([0xaa,0xbb,0xbb,0xaa]));
    });

    it("getDehydrationKeyCallback should return callback which resolves to correct value for single module", async () => {
        let callback = module.extensions!.cryptoSetup!.getDehydrationKeyCallback() as any;
        const result = await callback( {} as SecretStorageKeyDescription, ()=>{});
        const expected = Uint8Array.from([0x0, 0x1, 0x2, 0x3]);
        expect(result).toEqual(expected);
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

        module.extensions!.cryptoSetup!.examineLoginResponse({sub: "my-sub"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my secure backup key");
    });
});

describe("Module proxy with no modules", () => {

    let proxiedExtensions: ProxiedExtensions;

    beforeAll(() => {
        proxiedExtensions = new ProxiedExtensions([]);
    });

    it("should return correct value for getSecretStorageKey for single module", () => {
        // let result = module.extensions!.cryptoSetup!.getSecretStorageKey();
        // expect(result).toEqual(Uint8Array.from([0xaa,0xbb,0xbb,0xaa]));
    });
});

describe("Proxied CryptoSetupExtensions and Experimental modules", () => {

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
                            experimentalMethod(arg: any): string {
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
                            persistCredentials(credentials: IExtendedMatrixClientCreds): void {
                            }
                            catchAccessSecretStorageError(e: Error): void {                            
                            }
                            setupEncryptionNeeded(kind: SetupEncryptionKind): boolean {
                                return true;
                            }
                            getSecretStorageKey(): Uint8Array | null {
                                return new Uint8Array([0xbb, 0xaa, 0xaa, 0xbb])
                            }
                            createSecretStorageKey(): Uint8Array | null {                               
                                return null;
                            }                        
                            getDehydrationKeyCallback(): ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>) | null {
                                return (_,__) => Promise.resolve(new Uint8Array([0x0, 0x1, 0x2, 0x3]) );
                            }
                            examineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {      
                                credentials.secureBackupKey = "my proxied secure backup key";          
                            }
                            SHOW_ENCRYPTION_SETUP_UI = false;
                        })()
                    }
                }
            })()            
        ];
        proxiedExtensions = new ProxiedExtensions(modules);
    });

    it("should not throw calling experimentalMethod without arguments for proxied modules", () => {

        let t = () => proxiedExtensions!.extensions!.experimental!.experimentalMethod();    
        expect(t).not.toThrow();    
    });

    it("should return correct value for experimentalMethod for proxied modules", () => {
        let result = proxiedExtensions!.extensions!.experimental!.experimentalMethod("test 123");
        expect(result).toEqual("test 123");
    });

    it("should override SHOW_ENCRYPTION_SETUP_UI setting from base class for proxied modules", () => {
        let result = proxiedExtensions!.extensions!.cryptoSetup!.SHOW_ENCRYPTION_SETUP_UI;
        expect(result).toBeFalsy();
    });

    it("should return correct value when calling getSecretStorageKey for proxied modules", () => {
        let result = proxiedExtensions!.extensions!.cryptoSetup!.getSecretStorageKey();
        expect(result).toEqual(Uint8Array.from([0xbb, 0xaa, 0xaa, 0xbb]));
    });

    it("should return callback which resolves to correct value when calling getDehydrationKeyCallback for proxied modules", async () => {
        let callback = proxiedExtensions.extensions!.cryptoSetup!.getDehydrationKeyCallback() as any;
        const result = await callback( {} as SecretStorageKeyDescription, ()=>{});
        const expected = Uint8Array.from([0x0, 0x1, 0x2, 0x3]);
        expect(result).toEqual(expected);
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

        proxiedExtensions.extensions.cryptoSetup!.examineLoginResponse({secureBackupKey: "my key"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my proxied secure backup key");
    });

    // it("proxy must throw when no implementation in modules", () => {

    //     var modules = [

    //         new (class extends RuntimeModule {
    //             public constructor() {
    //                 super(undefined as any);
    
    //                 this.extensions = {
    //                     cryptoSetup: undefined
    //                 }    
    //             }
    //         })(),

    //         new (class extends RuntimeModule {
    //             public constructor() {
    //                 super(undefined as any);
    
    //                 this.extensions = {
    //                     cryptoSetup: undefined
    //                 }
    //             }
    //         })()
    //     ];

    //     var proxiedExtensions = new ProxiedExtensions(modules);

    //     let t = () => proxiedExtensions.extensions.cryptoSetup!.getSecretStorageKey();    
    //     expect(t).toThrow(Error);
    
    // });
    
    // it("proxy must throw when we have no modules", () => {

    //     var modules = new Array<RuntimeModule>();
    //     var proxiedExtensions = new ProxiedExtensions(modules);

    //     let t = () => proxiedExtensions.extensions.cryptoSetup!.GetSecretStorageKey();    
    //     expect(t).toThrow(Error);    
    // });
});
