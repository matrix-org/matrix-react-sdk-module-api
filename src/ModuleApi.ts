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

import React from "react";

import { PlainSubstitution, TranslationStringsObject } from "./types/translations";
import { DialogProps } from "./components/DialogContent";
import { AccountAuthInfo } from "./types/AccountAuthInfo";

/**
 * A module API surface for the react-sdk. Provides a stable API for modules to
 * interact with the internals of the react-sdk without having to update themselves
 * for refactorings or code changes within the react-sdk.
 *
 * An instance of a ModuleApi is provided to all modules at runtime.
 */
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
    translateString(s: string, variables?: Record<string, PlainSubstitution>): string;

    /**
     * Opens a dialog in the client.
     * @param title The title of the dialog
     * @param body The function which creates a body component for the dialog.
     * @param props Optional props to provide to the dialog.
     * @returns Whether the user submitted the dialog or closed it, and the model returned by the
     * dialog component if submitted.
     */
    openDialog<M extends object, P extends DialogProps = DialogProps, C extends React.Component = React.Component>(
        title: string,
        body: (props: P, ref: React.RefObject<C>) => React.ReactNode,
        props?: Omit<P, keyof DialogProps>,
    ): Promise<{ didOkOrSubmit: boolean, model: M }>;

    /**
     * Registers for an account on the currently connected homeserver. This requires that the homeserver
     * offer a password-only flow without other flows. This means it is not traditionally compatible with
     * homeservers like matrix.org which also generally require a combination of reCAPTCHA, email address,
     * terms of service acceptance, etc.
     * @param username The username to register.
     * @param password The password to register.
     * @param displayName Optional display name to set.
     * @returns Resolves to the authentication info for the created account.
     */
    registerSimpleAccount(username: string, password: string, displayName?: string): Promise<AccountAuthInfo>;

    /**
     * Switches the user's currently logged-in account to the one specified. The user will not
     * be warned.
     * @param accountAuthInfo The authentication info to log in with.
     * @returns Resolves when complete.
     */
    overwriteAccountAuth(accountAuthInfo: AccountAuthInfo): Promise<void>;

    /**
     * Switches the user's current view to look at the given permalink. If the permalink is
     * a room, it can optionally be joined automatically if required.
     *
     * Permalink must be a matrix.to permalink at this time.
     * @param uri The URI to navigate to.
     * @param andJoin True to also join the room if needed. Does nothing if the link isn't to
     * a room.
     * @returns Resolves when complete.
     */
    navigatePermalink(uri: string, andJoin?: boolean): Promise<void>;
}
