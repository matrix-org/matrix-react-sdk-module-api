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

import * as React from "react";
import { ModuleApi } from "../ModuleApi";
import { PlainSubstitution } from "../types/translations";

export interface DialogProps {
    moduleApi: ModuleApi;

    /**
     * Sets submit button as enabled or disabled on the dialog popup.
     * @param canSubmit
     */
    setCanSubmit(canSubmit: boolean): void;
}

export interface DialogState {
    busy: boolean;
    error?: string;
}

export abstract class DialogContent<P extends DialogProps = DialogProps, S extends DialogState = DialogState, M extends object = {}>
    extends React.PureComponent<P, S> {

    protected constructor(props: P, state?: S) {
        super(props);

        this.state = {
            busy: false,
            ...state,
        } as S;
    }

    /**
     * Run a string through the translation engine. Shortcut to ModuleApi#translateString().
     * @param s The string.
     * @param variables The variables, if any.
     * @returns The translated string.
     * @protected
     */
    protected t(s: string, variables?: Record<string, PlainSubstitution>): string {
        return this.props.moduleApi.translateString(s, variables);
    }

    /**
     * Called when the dialog is submitted. Note that calling this will not submit the
     * dialog by default - this component will be wrapped in a form which handles keyboard
     * submission and buttons on its own.
     *
     * If the returned promise resolves then the dialog will be closed, otherwise the dialog
     * will stay open.
     */
    public abstract trySubmit(): Promise<M>;
}
