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

import { TranslationStringsObject } from "./types/translations";

export interface ModuleApi {
    /**
     * Register strings with the translation engine. This supports overriding strings which
     * the system is already aware of.
     * @param translations The translations to load.
     */
    registerTranslations(translations: TranslationStringsObject): void;

    /**
     * Runs a string through the translation engine. If variables are needed, use %(varName)s
     * as a placeholder for varName in the variables object.
     * @param s The string. Should already be known to the engine.
     * @param variables The variables to replace, if any.
     * @returns The translated string.
     */
    translateString(s: string, variables?: Record<string, unknown>): string;
}
