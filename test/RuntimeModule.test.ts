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
import {Capability, Widget, MatrixWidgetType} from "matrix-widget-api";

import {DefaultWidgetPermissions} from "../src/RuntimeModule";

describe("RuntimeModule", () => {
    describe("WidgetPermissions", () => {
        const mockWidget = new Widget({
            id: "widget-id",
            creatorUserId: "@user-id",
            type: MatrixWidgetType.Custom,
            url: "https://example.com",
        });

        const defaultWidgetPermissions = new DefaultWidgetPermissions();

        const customWidgetPermissions = new class extends DefaultWidgetPermissions {
            isEmbeddingPreapproved(widget: Widget): boolean {
                return true;
            }

            isIdentityRequestPreapproved(widget: Widget): Promise<boolean> {
                return Promise.resolve(true);
            }

            preapproveCapabilities(widget: Widget, requestedCapabilities: Set<Capability>): Promise<Set<Capability>> {
                return Promise.resolve(requestedCapabilities);
            }
        }();

        it("default permissions", async () => {
            expect(defaultWidgetPermissions.isEmbeddingPreapproved(mockWidget)).toBe(false);
            await expect(defaultWidgetPermissions.isIdentityRequestPreapproved(mockWidget)).resolves.toBe(false);
            await expect(
                defaultWidgetPermissions.preapproveCapabilities(mockWidget, new Set(["org.matrix.msc2931.navigate"])),
            ).resolves.toEqual(new Set());
        });

        it("custom permissions", async () => {
            expect(customWidgetPermissions.isEmbeddingPreapproved(mockWidget)).toBe(true);
            await expect(customWidgetPermissions.isIdentityRequestPreapproved(mockWidget)).resolves.toBe(true);
            await expect(
                customWidgetPermissions.preapproveCapabilities(mockWidget, new Set(["org.matrix.msc2931.navigate"])),
            ).resolves.toEqual(new Set(["org.matrix.msc2931.navigate"]));
        });
    });
});
