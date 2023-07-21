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
    UIComponentLifecycle, ShouldShowUIComponentOps, ShouldShowUIComponentListener, UIComponent,
} from "../../src/lifecycles/UIComponentLifecycle";
import { RuntimeModule } from "../../src/RuntimeModule";

describe("UiComponentLifecycle", () => {
    let module: RuntimeModule;

    beforeAll(() => {
        module = new class extends RuntimeModule {
            constructor() {
                super(undefined as any);

                this.on(UIComponentLifecycle.ShouldShowComponent, this.shouldShowComponent);
            }

            protected shouldShowComponent: ShouldShowUIComponentListener = (
                shouldShowUiComponentOps: ShouldShowUIComponentOps,
                component: UIComponent,
            ) => {
                shouldShowUiComponentOps.shouldShowComponent = component !== UIComponent.CreateRooms;
            };
        };
    });

    it("should handle should_show_component request", () => {
        const opts: ShouldShowUIComponentOps = {shouldShowComponent: undefined};

        module.emit(UIComponentLifecycle.ShouldShowComponent, opts, UIComponent.CreateRooms, "@user-id");
        expect(opts.shouldShowComponent).toBe(false);

        module.emit(UIComponentLifecycle.ShouldShowComponent, opts, UIComponent.ExploreRooms, "@user-id");
        expect(opts.shouldShowComponent).toBe(true);
    });
});
