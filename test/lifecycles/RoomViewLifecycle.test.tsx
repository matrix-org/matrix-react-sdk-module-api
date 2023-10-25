/*
Copyright 2023 Nordeck IT + Consulting GmbH

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

import { RuntimeModule } from "../../src";
import { RoomHeaderListener, RoomHeaderOpts, RoomViewLifecycle } from "../../src/lifecycles/RoomViewLifecycle";

describe("RoomViewLifecycle", () => {
    const roomHeaderOpts: RoomHeaderOpts = {
        buttons: [
            {
                icon: "test-icon",
                id: "test-id",
                label: () => "test-label",
                onClick: () => {},
            },
        ],
    };

    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            public constructor() {
                super(undefined as any);

                this.on(RoomViewLifecycle.RenderRoomHeader, this.renderRoomHeaderListener);
            }

            protected renderRoomHeaderListener: RoomHeaderListener = (opts, roomId) => {
                opts.buttons = roomHeaderOpts.buttons;
            };
        })();
    });

    it("should handle additional buttons", () => {
        const opts: RoomHeaderOpts = { buttons: [] };
        module.emit(RoomViewLifecycle.RenderRoomHeader, opts);
        expect(opts).toEqual(roomHeaderOpts);
    });
});
