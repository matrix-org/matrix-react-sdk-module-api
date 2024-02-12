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
 */

/**
 * Copied from https://github.com/matrix-org/matrix-js-sdk/blob/2337d5a7af6265bbcabbd42c1594cd8b1829b00b/src/secret-storage.ts#L39-L50
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

/**
 * Copied from https://github.com/matrix-org/matrix-js-sdk/blob/2337d5a7af6265bbcabbd42c1594cd8b1829b00b/src/secret-storage.ts#L59-L71
 */
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

/**
 * Copied from https://github.com/matrix-org/matrix-js-sdk/blob/2337d5a7af6265bbcabbd42c1594cd8b1829b00b/src/secret-storage.ts#L78
 */
export type SecretStorageKeyDescription = SecretStorageKeyDescriptionAesV1;

/**
 * Copied from https://github.com/matrix-org/matrix-js-sdk/blob/2337d5a7af6265bbcabbd42c1594cd8b1829b00b/src/secret-storage.ts#L85-L97
 */
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
 * Copied from https://github.com/matrix-org/matrix-react-sdk/blob/11096b207a1510569f5c54182e328f6148a6475c/src/MatrixClientPeg.ts#L57-L67
 */
export interface ExamineLoginResponseCreds {
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

/**
 * Copied from https://github.com/matrix-org/matrix-react-sdk/blob/11096b207a1510569f5c54182e328f6148a6475c/src/toasts/SetupEncryptionToast.ts#L71-L75
 */
export enum SetupEncryptionKind {
    SetUpEncryption = "set_up_encryption",
    UpgradeEncryption = "upgrade_encryption",
    VerifyThisSessions = "verify_this_session",
}

export interface ExtendedMatrixClientCreds extends ExamineLoginResponseCreds {
    secureBackupKey?: string;
}

export interface ProvideCryptoSetupStore {
    getInstance: () => SetupEncryptionStoreProjection;
}

export interface SetupEncryptionStoreProjection {
    usePassPhrase(): Promise<void>;
}

export interface ProvideCryptoSetupExtensions {
    examineLoginResponse(response: any, credentials: ExtendedMatrixClientCreds): void;
    persistCredentials(credentials: ExtendedMatrixClientCreds): void;
    getSecretStorageKey(): Uint8Array | null;
    createSecretStorageKey(): Uint8Array | null;
    catchAccessSecretStorageError(e: Error): void;
    setupEncryptionNeeded: (args: CryptoSetupArgs) => boolean;
    getDehydrationKeyCallback():
        | ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>)
        | null;
    SHOW_ENCRYPTION_SETUP_UI: boolean;
}

export abstract class CryptoSetupExtensionsBase implements ProvideCryptoSetupExtensions {
    public abstract examineLoginResponse(response: any, credentials: ExtendedMatrixClientCreds): void;
    public abstract persistCredentials(credentials: ExtendedMatrixClientCreds): void;
    public abstract getSecretStorageKey(): Uint8Array | null;
    public abstract createSecretStorageKey(): Uint8Array | null;
    public abstract catchAccessSecretStorageError(e: Error): void;
    public abstract setupEncryptionNeeded(args: CryptoSetupArgs): boolean;
    public abstract getDehydrationKeyCallback():
        | ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>)
        | null;
    public abstract SHOW_ENCRYPTION_SETUP_UI: boolean;
}

/* Define an interface for setupEncryptionNeeded to help enforce mandatory arguments */
export interface CryptoSetupArgs {
    kind: SetupEncryptionKind;
    storeProvider: ProvideCryptoSetupStore;
}

/**
 *
 * The default/empty crypto-extensions
 * Can (and will) be used if none of the modules has an implementaion of IProvideCryptoSetupExtensions
 *
 * */
export class DefaultCryptoSetupExtensions extends CryptoSetupExtensionsBase {
    public SHOW_ENCRYPTION_SETUP_UI = true;

    public examineLoginResponse(response: any, credentials: ExtendedMatrixClientCreds): void {
        console.log("Default empty examineLoginResponse() => void");
    }
    public persistCredentials(credentials: ExtendedMatrixClientCreds): void {
        console.log("Default empty persistCredentials() => void");
    }

    public getSecretStorageKey(): Uint8Array | null {
        console.log("Default empty getSecretStorageKey() => null");
        return null;
    }

    public createSecretStorageKey(): Uint8Array | null {
        console.log("Default empty createSecretStorageKey() => null");
        return null;
    }

    public catchAccessSecretStorageError(e: Error): void {
        console.log("Default catchAccessSecretStorageError() => void");
    }

    public setupEncryptionNeeded(args: CryptoSetupArgs): boolean {
        console.log("Default setupEncryptionNeeded() => false");
        return false;
    }

    public getDehydrationKeyCallback():
        | ((keyInfo: SecretStorageKeyDescription, checkFunc: (key: Uint8Array) => void) => Promise<Uint8Array>)
        | null {
        console.log("Default empty getDehydrationKeyCallback() => null");
        return null;
    }
}
