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

import {
    ApprovalListener,
    ApprovalOpts,
    CapabilitiesListener,
    CapabilitiesOpts,
    WidgetInfo,
    WidgetLifecycle,
} from "../../src/lifecycles/WidgetLifecycle";
import { RuntimeModule } from "../../src/RuntimeModule";

describe("WidgetLifecycle", () => {
    const mockWidget: WidgetInfo = {
        creatorUserId: "@user-id",
        type: "m.custom",
        id: "widget-id",
        name: null,
        title: null,
        templateUrl: "https://example.com/some_path",
        origin: "https://example.com",
    };

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            constructor() {
                super(undefined as any);

                this.on(WidgetLifecycle.CapabilitiesRequest, this.capabilitiesListener);
                this.on(WidgetLifecycle.PreLoadRequest, this.preloadListener);
                this.on(WidgetLifecycle.IdentityRequest, this.identityListener);
            }

            protected capabilitiesListener: CapabilitiesListener = (
                capabilitiesOpts: CapabilitiesOpts,
                widgetInfo: WidgetInfo,
                requestedCapabilities: Set<string>,
            ) => {
                capabilitiesOpts.approvedCapabilities = requestedCapabilities;
            };

            protected preloadListener: ApprovalListener = (approvalOpts: ApprovalOpts, widgetInfo: WidgetInfo) => {
                approvalOpts.approved = true;
            };

            protected identityListener: ApprovalListener = (approvalOpts: ApprovalOpts, widgetInfo: WidgetInfo) => {
                approvalOpts.approved = false;
            };
        })();
    });

    it("should handle widget permissions requests", () => {
        const capabilitiesOpts: CapabilitiesOpts = { approvedCapabilities: new Set() };
        module.emit(
            WidgetLifecycle.CapabilitiesRequest,
            capabilitiesOpts,
            mockWidget,
            new Set(["org.matrix.msc2931.navigate"]),
        );
        expect(capabilitiesOpts.approvedCapabilities).toEqual(new Set(["org.matrix.msc2931.navigate"]));

        const preloadOpts: ApprovalOpts = { approved: undefined };
        module.emit(WidgetLifecycle.PreLoadRequest, preloadOpts, mockWidget);
        expect(preloadOpts.approved).toBe(true);

        const identityOpts: ApprovalOpts = { approved: undefined };
        module.emit(WidgetLifecycle.IdentityRequest, identityOpts, mockWidget);
        expect(identityOpts.approved).toBe(false);
    });
});
