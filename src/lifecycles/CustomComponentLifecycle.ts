/*
Copyright 2024 Verji Tech AS

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

/* 
    CustomComponentLifecycle is heavily inspired by the WrapperLifecycle.ts, but is intended for a different usecase.
    Instead of appending something within the wrapper, this lifecycle should swap the contents of the wrapper with a custom component provided by a module implementation.
*/

import { ComponentType, PropsWithChildren } from "react";

/**
 * UserMenu lifecycle events
 */
export enum CustomComponentLifecycle {
    /**
     * An event to request the component module. `ModuleRunner` should invoke an event matching the wrapped component.
     * so any custom module can get the component provided by the module if any.
     */
    AppsDrawer = "apps_drawer",
    EntityTile = "entity_tile",
    ErrorBoundary = "error_boundary",
    Experimental = "experimental",
    HelpUserSettingsTab = "help_user_settings_tab",
    LegacyRoomHeader = "legacy_room_header",
    LeftPanel = "left_panel",
    LoggedInView = "logged_in_view",
    MatrixChat = "matrix_chat",
    MemberTile = "member_tile",
    MessageContextMenu = "message_context_menu",
    ReactionsRow = "reactions_row",
    ReactionsRowButtonTooltip = "reactions_row_button_tooltip",
    RolesRoomSettingsTab = "roles_room_settings_tab",
    RoomHeader = "room_header",
    RoomView = "room_view",
    SessionManagerTab = "session_manage_tab",
    SpacePanel = "space_panel",
    UserMenu = "user_menu"
}

/**
 * Opts object that is populated with a Wrapper.
 */
export type CustomComponentOpts = {
    /**
     * A Wrapper React Component to be rendered around a component to swap. i.e the component to override.
     */
    CustomComponent: ComponentType<PropsWithChildren<{}>>;
};

/**
 * Helper type that documents how to implement a UserMenu listener.
 */
export type CustomComponentListener = (opts: CustomComponentOpts) => void;
