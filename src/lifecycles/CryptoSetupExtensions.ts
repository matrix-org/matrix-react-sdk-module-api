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
* Types copied (and renamed) from matrix-js-sdk
* 
*/

export interface SecretStorageKeyDescriptionCommon {
    /** A human-readable name for this key. */
    // XXX: according to the spec, this is optional
    name: string;

    /** The encryption algorithm used with this key. */
    algorithm: string;

    /** Information for deriving this key from a passphrase. */
    // XXX: according to the spec, this is optional
    passphrase: PassphraseInfo;
}

export interface SecretStorageKeyDescriptionAesV1 extends SecretStorageKeyDescriptionCommon {
    // XXX: strictly speaking, we should be able to enforce the algorithm here. But
    //   this interface ends up being incorrectly used where other algorithms are in use (notably
    //   in device-dehydration support), and unpicking that is too much like hard work
    //   at the moment.
    // algorithm: "m.secret_storage.v1.aes-hmac-sha2";

    /** The 16-byte AES initialization vector, encoded as base64. */
    iv: string;

    /** The MAC of the result of encrypting 32 bytes of 0, encoded as base64. */
    mac: string;
}

export type SecretStorageKeyDescription = SecretStorageKeyDescriptionAesV1;

export interface PassphraseInfo {
    /** The algorithm to be used to derive the key. */
    algorithm: "m.pbkdf2";

    /** The number of PBKDF2 iterations to use. */
    iterations: number;

    /** The salt to be used for PBKDF2. */
    salt: string;

    /** The number of bits to generate. Defaults to 256. */
    bits?: number;
}

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
    examineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
    persistCredentials(credentials: IExtendedMatrixClientCreds): void
    getSecretStorageKey() : Uint8Array | null;
    createSecretStorageKey() : Uint8Array | null;
    catchAccessSecretStorageError(e: Error): void
    setupEncryptionNeeded(kind: SetupEncryptionKind): boolean
    getDehydrationKeyCallback(): ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>) | null

    /* settings */
    SHOW_ENCRYPTION_SETUP_UI: boolean
}


export abstract class CryptoSetupExtensionsBase implements IProvideCryptoSetupExtensions {
    abstract examineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void
    abstract persistCredentials(credentials: IExtendedMatrixClientCreds): void 
    abstract getSecretStorageKey(): Uint8Array | null
    abstract createSecretStorageKey(): Uint8Array | null
    abstract catchAccessSecretStorageError(e: Error): void 
    abstract setupEncryptionNeeded(kind: SetupEncryptionKind): boolean
    abstract getDehydrationKeyCallback(): ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>) | null
    SHOW_ENCRYPTION_SETUP_UI: boolean = true
}

// The default/empty crypto-extensions
// Will be called by the proxy if none of the modules has an implementaion of IProvideCryptoSetupExtensions
export class DefaultCryptoSetupExtensions extends CryptoSetupExtensionsBase{
    examineLoginResponse(response: any, credentials: IExtendedMatrixClientCreds): void {
        console.log("Default empty examineLoginResponse() => void")
    }
    persistCredentials(credentials: IExtendedMatrixClientCreds): void {
        console.log("Default empty persistCredentials() => void")
    }
    getSecretStorageKey(): Uint8Array | null {
        console.log("Default empty getSecretStorageKey() => null")
        return null;
    }
    createSecretStorageKey(): Uint8Array | null {
        console.log("Default empty createSecretStorageKey() => null")
        return null;
    }
    catchAccessSecretStorageError(e: Error): void {
        console.log("Default catchAccessSecretStorageError() => void")        
    }
    setupEncryptionNeeded(kind: SetupEncryptionKind): boolean {
        console.log("Default setupEncryptionNeeded() => false")        
        return false;
    }

    getDehydrationKeyCallback(): ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>) | null {
        console.log("Default empty getDehydrationKeyCallback() => null")        
        return null;
    }
}

//
// Mostly for test. To ensure we handle more than one module having extensions 
// 
export interface IProvideExperimentalExtensions {
    experimentalMethod(args?: any): any
}
export abstract class ExperimentalExtensionsBase implements IProvideExperimentalExtensions {
    abstract experimentalMethod(args?: any): any
}

export class DefaultExperimentalExtensions extends ExperimentalExtensionsBase {
    experimentalMethod(args?: any): void {        
    }
}
