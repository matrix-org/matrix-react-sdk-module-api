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

import { EventEmitter } from "events";

import { ModuleApi } from "./ModuleApi";
import { PlainSubstitution } from "./types/translations";
import { AllExtensions } from "./types/extensions";

// TODO: Type the event emitter with AnyLifecycle (extract TypedEventEmitter from js-sdk somehow?)
// See https://github.com/matrix-org/matrix-react-sdk-module-api/issues/4

/**
 * Represents a module which is loaded at runtime. Modules which implement this class
 * will be provided information about the application state and can react to it.
 */
export abstract class RuntimeModule extends EventEmitter {
    public extensions?: AllExtensions;
    public moduleName: string = RuntimeModule.name;

    protected constructor(protected readonly moduleApi: ModuleApi) {
        super();
    }

    /**
     * Run a string through the translation engine. Shortcut to ModuleApi#translateString().
     * @param s The string.
     * @param variables The variables, if any.
     * @returns The translated string.
     * @protected
     */
    protected t(s: string, variables?: Record<string, PlainSubstitution>): string {
        return this.moduleApi.translateString(s, variables);
    }
}
