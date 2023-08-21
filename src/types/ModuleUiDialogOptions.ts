/*
Copyright 2023 Mikhail Aheichyk
Copyright 2023 Nordeck IT + Consulting GmbH.

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
 * Options for {@link ModuleApi#openDialog}.
 */
export interface ModuleUiDialogOptions {
    /**
     * The title of the dialog.
     */
    title: string;

    /**
     * The label of the action button. If unset, a default label will be used.
     */
    actionLabel?: string;

    /**
     * The label of the cancel button. If unset, a default label will be used.
     */
    cancelLabel?: string;

    /**
     * Enable or disable the action button when the dialog is created.
     * @defaultValue The default is `true`
     */
    canSubmit?: boolean;
}
