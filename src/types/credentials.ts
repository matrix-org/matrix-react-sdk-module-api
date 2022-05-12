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

/**
 * Matrix account credentials for a known user.
 */
export interface AccountCredentials {
    /**
     * The user ID.
     */
    userId: string;
    /**
     * The device ID.
     */
    deviceId: string;
    /**
     * The access token belonging to this device ID and user ID.
     */
    accessToken: string;
    /**
     * The homeserver URL where the credentials are valid.
     */
    homeserverUrl: string;
}
