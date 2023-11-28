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

export type ExamineLoginResponseListener = (response: any, credentials: IExamineLoginResponseCreds) => void;

export enum SecurityLifecycle {
    ExamineLoginResponse = "examine_login_response",
}

export enum SecurityExtensionMethodName {
    GetSecretStorageKey = "get_secret_storage_key",
    SetupCryptoMethod = "SetupCryptoMethod"
} 

//export type SecurityExtensionMethod = GetSecretStorageKeyMethod | SetupCryptoMethod | SetupCrypto2Method
export type SecurityExtensionResult = GetSecretStorageKeyResult | SetupCryptoResult | SetupCrypto2Result
export type SecurityExtensionArgs = GetSecretStorageKeyArg | SetupCryptoArg | SetupCrypto2Method


export type GetSecretStorageKeyArg = undefined;
export type GetSecretStorageKeyResult = string;
export type GetSecretStorageKeyMethod = () => GetSecretStorageKeyResult;

export type SetupCryptoArg = {key: string};
export type SetupCryptoResult  = string;
export type SetupCryptoMethod  = (x: SetupCryptoArg) => SetupCryptoResult;

export type SetupCrypto2Arg  = undefined;
export type SetupCrypto2Result  = string;
export type SetupCrypto2Method  = () => SetupCrypto2Result;

