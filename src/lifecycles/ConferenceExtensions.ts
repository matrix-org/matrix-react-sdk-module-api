/*
Copyright 2025 New Vector Ltd.

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

/**
 * Extensions that are useful when rebranding the app to be used
 * in a conference.
 */
export interface ProvideConferenceExtensions {
    filterServerList(servers: string[]): string[];
    serverLoginNotice(serverName: string): string | null;
    defaultAvatarUrlForString(s: string): string | null;
    getAvatarInitialLetter(s: string): string | null;
}

export abstract class ConferenceExtensionsBase implements ProvideConferenceExtensions {
    public abstract filterServerList(servers: string[]): string[];
    public abstract serverLoginNotice(serverName: string): string | null;
    public abstract defaultAvatarUrlForString(s: string): string | null;
    public abstract getAvatarInitialLetter(s: string): string | null;
}

export class DefaultConferenceExtensions extends ConferenceExtensionsBase {
    public filterServerList(servers: string[]): string[] {
        return servers;
    }
    public serverLoginNotice(): null {
        return null;
    }
    public defaultAvatarUrlForString(): null {
        return null;
    }
    public getAvatarInitialLetter(): null {
        return null;
    }
}
