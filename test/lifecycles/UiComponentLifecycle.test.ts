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
    UiComponentLifecycle, ShouldShowUiComponentOps, ShouldShowUiComponentListener, UiComponent,
} from "../../src/lifecycles/UiComponentLifecycle";
import { RuntimeModule } from "../../src/RuntimeModule";

describe("UiComponentLifecycle", () => {
    let module: RuntimeModule;

    beforeAll(() => {
        module = new class extends RuntimeModule {
            constructor() {
                super(undefined);

                this.on(UiComponentLifecycle.ShouldShowComponent, this.shouldShowComponent);
            }

            protected shouldShowComponent: ShouldShowUiComponentListener = (
                shouldShowUiComponentOps: ShouldShowUiComponentOps,
                component: UiComponent,
                matrixUserId: string,
            ) => {
                shouldShowUiComponentOps.shouldShowComponent = component !== UiComponent.CreateRooms;
            };
        };
    });

    it("should handle should_show_component request", () => {
        const opts: ShouldShowUiComponentOps = {shouldShowComponent: undefined};

        module.emit(UiComponentLifecycle.ShouldShowComponent, opts, UiComponent.CreateRooms, "@user-id");
        expect(opts.shouldShowComponent).toBe(false);

        module.emit(UiComponentLifecycle.ShouldShowComponent, opts, UiComponent.ExploreRooms, "@user-id");
        expect(opts.shouldShowComponent).toBe(true);
    });
});
