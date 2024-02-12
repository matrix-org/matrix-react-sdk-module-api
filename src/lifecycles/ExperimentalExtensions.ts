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

/**
 * Mostly for test. To ensure we handle more than one module having extensions
 * Can possibly also be useful for PoC development
 */
export interface ProvideExperimentalExtensions {
    experimentalMethod(args?: any): any;
}

export abstract class ExperimentalExtensionsBase implements ProvideExperimentalExtensions {
    public abstract experimentalMethod(args?: any): any;
}

export class DefaultExperimentalExtensions extends ExperimentalExtensionsBase {
    public experimentalMethod(args?: any): any {
        return null;
    }
}
