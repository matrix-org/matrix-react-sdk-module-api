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

import { RuntimeModule } from "../RuntimeModule";
import { AllExtensions } from "./types";

export interface IExamineLoginResponseCreds {
    homeserverUrl: string;
    identityServerUrl?: string;
    userId: string;
    deviceId?: string;
    accessToken: string;
    refreshToken?: string;
    guest?: boolean;
    pickleKey?: string;
    freshLogin?: boolean;
}

export interface IExtendedMatrixClientCreds extends IExamineLoginResponseCreds {
    secureBackupKey?: string;
}

export interface IProvideCryptoSetupExtensions {
    ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
    GetSecretStorageKey() : string;
}
export interface IProvideOtherExtensions {
    OtherMethod(): string
}

export abstract class CryptoSetupExtensionsBase implements IProvideCryptoSetupExtensions {
    ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {
        throw new Error("Method not implemented.");
    }
    GetSecretStorageKey(): string {
        throw new Error("Method not implemented.");
    }
    // abstract GetSecretStorageKey(): string
    // abstract ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
}

export abstract class OtherExtensionsBase implements IProvideOtherExtensions {
    OtherMethod(): string {
        throw new Error("Method not implemented.");
    }
}
