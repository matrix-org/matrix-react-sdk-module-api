/*
Copyright 2023 Verji Tech AS
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
* Types copied (and renamed) from matrix-react-sdk
* (MatrixClientCreds and Kind)
*/

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

export enum SetupEncryptionKind {
    SET_UP_ENCRYPTION = "set_up_encryption",
    UPGRADE_ENCRYPTION = "upgrade_encryption",
    VERIFY_THIS_SESSION = "verify_this_session",
}

export interface IExtendedMatrixClientCreds extends IExamineLoginResponseCreds {
    secureBackupKey?: string;
}

export interface IProvideCryptoSetupExtensions {
    ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
    PersistCredentials(credentials: IExtendedMatrixClientCreds): void
    GetSecretStorageKey() : string;
    CatchAccessSecretStorageError(e: Error): void
    SetupEncryptionNeeded(kind: SetupEncryptionKind): boolean
    GetDehydrationKey(): Promise<Uint8Array>;
}


export abstract class CryptoSetupExtensionsBase implements IProvideCryptoSetupExtensions {
    abstract ExamineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
    abstract PersistCredentials(credentials: IExtendedMatrixClientCreds): void 
    abstract GetSecretStorageKey(): string
    abstract CatchAccessSecretStorageError(e: Error): void 
    abstract SetupEncryptionNeeded(kind: SetupEncryptionKind): boolean
    abstract GetDehydrationKey(): Promise<Uint8Array>
}

//
// Mostly for test. To ensure we handle more than one module having extensions 
// 
export interface IProvideExperimentalExtensions {
    ExperimentalMethod(args?: any): any
}
export abstract class ExperimentalExtensionsBase implements IProvideExperimentalExtensions {
    abstract ExperimentalMethod(args?: any): any
}
