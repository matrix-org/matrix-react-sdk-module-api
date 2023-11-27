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
    SecurityLifecycle,
    SecurityExtensionMethods
} from "../../src/lifecycles/SecurityLifecycle";

describe("SecurityLifecycle", () => {

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);
                this.fetchers.set(SecurityExtensionMethods.GetSecretStorageKey,(a)=>a);
            }
        })();
    });

    it("should return correct value from method", () => {
        var method = module.fetchers.get(SecurityExtensionMethods.GetSecretStorageKey)!;
        let result = method("echo this")
        expect(result).toEqual("echo this");
    });
});
