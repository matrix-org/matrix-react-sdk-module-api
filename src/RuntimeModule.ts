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
import { Capability, Widget } from "matrix-widget-api";

import { ModuleApi } from "./ModuleApi";
import { PlainSubstitution } from "./types/translations";

// TODO: Type the event emitter with AnyLifecycle (extract TypedEventEmitter from js-sdk somehow?)
// See https://github.com/matrix-org/matrix-react-sdk-module-api/issues/4

/**
 * Represents a module which is loaded at runtime. Modules which implement this class
 * will be provided information about the application state and can react to it.
 */
export abstract class RuntimeModule extends EventEmitter {
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

    /**
     * Gets widget permissions behaviour to preapprove permissions.
     * @returns instance of IWidgetPermissions with custom behaviour or undefined for default
     */
    public getWidgetPermissions(): WidgetPermissions | undefined {
        return undefined;
    }
}

/**
 * Represents widget permissions behaviour to preapprove permissions that can be customized by module.
 */
export interface WidgetPermissions {
    /**
     * Approves the widget embedding.
     * This will be used to embed certain widgets without prompting the user.
     * @param {Widget} widget The widget to approve embedding for.
     * @returns {boolean} true if embedding is preapproved, false otherwise
     */
    isEmbeddingPreapproved(widget: Widget): boolean;

    /**
     * Approves the widget for identity token.
     * This will be used to give certain widgets an identity token without having to
     * prompt the user to approve it.
     * @param {Widget} widget The widget to approve identity request for.
     * @returns {boolean} Resolves to true if identity request is preapproved, false otherwise
     */
    isIdentityRequestPreapproved(widget: Widget): Promise<boolean>;

    /**
     * Approves the widget for capabilities that it requested, if any can be
     * approved. Typically this will be used to give certain widgets capabilities
     * without having to prompt the user to approve them. This cannot reject
     * capabilities that Element will be automatically granting, such as the
     * ability for Jitsi widgets to stay on screen - those will be approved
     * regardless.
     * @param {Widget} widget The widget to approve capabilities for.
     * @param {Set<Capability>} requestedCapabilities The capabilities the widget requested.
     * @returns {Set<Capability>} Resolves to the capabilities that are approved for use
     * by the widget. If none are approved, this should return an empty Set.
     */
    preapproveCapabilities(widget: Widget, requestedCapabilities: Set<Capability>): Promise<Set<Capability>>;
}

/**
 * Defines a default widget permissions behaviour. Can be extended to customize.
 */
export class DefaultWidgetPermissions implements WidgetPermissions {
    isEmbeddingPreapproved(widget: Widget): boolean {
        return false;
    }

    async isIdentityRequestPreapproved(widget: Widget): Promise<boolean> {
        return false;
    }

    async preapproveCapabilities(widget: Widget, requestedCapabilities: Set<Capability>): Promise<Set<Capability>> {
        return new Set();
    }
}
