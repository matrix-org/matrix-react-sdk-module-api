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

export interface TextInputFieldProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
}

export class TextInputField extends React.PureComponent<TextInputFieldProps> {
    /**
     * The factory this component uses to render itself. Set to a different value to override.
     * @param props The component properties
     * @returns The component, rendered.
     */
    public static renderFactory = (props: TextInputFieldProps): React.ReactNode => (
        <label>
            {props.label}
            <input type="text" onChange={e => props.onChange(e.target.value)} value={props.value} />
        </label>
    );

    public render() {
        return TextInputField.renderFactory(this.props);
    }
}
