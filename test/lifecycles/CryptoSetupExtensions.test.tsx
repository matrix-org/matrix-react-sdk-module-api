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
    SecretStorageKeyDescription,
    SetupArgs,
    IProvideCryptoSetupExtensions,
    DefaultCryptoSetupExtensions,
} from "../../src/lifecycles/CryptoSetupExtensions";
import { DefaultExperimentalExtensions, ExperimentalExtensionsBase, IProvideExperimentalExtensions } from "../../src/lifecycles/ExperimentalExtensions";

describe("Defaults", () => {

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);

                this.extensions = {
                    cryptoSetup: new DefaultCryptoSetupExtensions(),
                    experimental: new DefaultExperimentalExtensions()
                }
            }
        })();
    });

    it("should have default value for SHOW_ENCRYPTION_SETUP_UI", () => {
        let result = module.extensions!.cryptoSetup.SHOW_ENCRYPTION_SETUP_UI;
        expect(result).toBeTruthy();
    });

    it("should return default value for getSecretStorageKey()", () => {
        let result = module.extensions!.cryptoSetup!.getSecretStorageKey();
        expect(result).toEqual(null);
    });

    it("should return null when calling getDehydrationKeyCallback", async () => {
        let callback = module.extensions!.cryptoSetup!.getDehydrationKeyCallback() as any;
        expect(callback).toBeNull();
    });

    it("should not throw when calling default examineLoginResponse()", () => {
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

        let t = () => module.extensions!.cryptoSetup?.examineLoginResponse({secureBackupKey: "my key"}, credentials );
        expect(t).not.toThrow();
    });
});


describe("Custom CryptoSetupExtensions", () => {

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
                        setupEncryptionNeeded(args: SetupArgs): boolean {
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
                        SHOW_ENCRYPTION_SETUP_UI: boolean = false
                    })(),
                    experimental: {} as IProvideExperimentalExtensions
                }
            }
        })();
    });

    it("should override SHOW_ENCRYPTION_SETUP_UI custom setting from base class", () => {
        let result = module.extensions!.cryptoSetup.SHOW_ENCRYPTION_SETUP_UI;
        expect(result).toBeFalsy();
    });

    it("should return custom value when calling getSecretStorageKey", () => {
        let result = module.extensions!.cryptoSetup!.getSecretStorageKey();
        expect(result).toEqual(Uint8Array.from([0xaa, 0xbb, 0xbb, 0xaa]));
    });

    it("should return callback which resolves to custom value when calling getDehydrationKeyCallback", async () => {
        let callback = module.extensions!.cryptoSetup!.getDehydrationKeyCallback() as any;
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

        module.extensions!.cryptoSetup?.examineLoginResponse({secureBackupKey: "my key"}, credentials );
        expect(credentials.secureBackupKey).toEqual("my secure backup key");
    });
});


describe("Custom ExperimentalExtensions", () => {

    let module: RuntimeModule;

    beforeAll(() => {

        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);

                this.extensions = {
                    cryptoSetup: {} as IProvideCryptoSetupExtensions, 
                    experimental: new (class extends ExperimentalExtensionsBase {
                        experimentalMethod(args?: any) {
                            return "test 123"
                        }
                    })()
                }
            }
        })();
    });

    it("should not throw calling experimentalMethod without arguments", () => {

        let t = () => module.extensions!.experimental.experimentalMethod();    
        expect(t).not.toThrow();    
    });

    it("should return correct custom value for experimentalMethod", () => {
        let result = module.extensions!.experimental!.experimentalMethod("test 123");
        expect(result).toEqual("test 123");
    });
});