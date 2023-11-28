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
    GetSecretStorageKeyMethod,
    GetSecretStorageKeyArg,
    GetSecretStorageKeyResult,
    SecurityExtensionMethodName,
    SetupCryptoArg,
    SetupCryptoResult
} from "../../src/lifecycles/SecurityLifecycle";

describe("SecurityLifecycle", () => {

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);
            }
        })();
    });

    it("should return correct value from method", () => {


        var m: GetSecretStorageKeyMethod = () => "return this"        
        module.methods.set(SecurityExtensionMethodName.GetSecretStorageKey, m);

        var method = module.methods.get(SecurityExtensionMethodName.GetSecretStorageKey)!;
        let result = method();
        expect(result).toEqual("return this");
    });

    it("should not allow registering method with wrong argument types", () => {
        module.methods.set(SecurityExtensionMethodName.SetupCryptoMethod, (a: SetupCryptoArg): SetupCryptoResult => a.key);
        var method = module.methods.get(SecurityExtensionMethodName.GetSecretStorageKey)!;
        let result = method({key: "echo my prop"})
        expect(result).toEqual("echo my prop");
    });
});
