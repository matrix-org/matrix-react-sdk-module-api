interface AppTitleBase {
    brand: string;
    syncError: boolean;
}

export interface AppTitleInRoom extends AppTitleBase {
    brand: string;
    roomName?: string;
    roomId: string;
    unreadNotificationCount: number;
    notificationsMuted: boolean;
}

export interface GetFaviconParameters {
    // colour parameters
    bgColor: string;
    textColor: string;
    // font styling parameters
    fontFamily: string;
    fontWeight: "normal" | "italic" | "bold" | "bolder" | "lighter" | number;

    // positioning parameters
    isUp: boolean;
    isLeft: boolean;
}

export type AppTitleContext = AppTitleBase | AppTitleInRoom;

export interface ProvideBrandingExtensions {
    getAppTitle(context: AppTitleContext): string | null;
    /**
     * Called when the app needs to generate the basic app favicon.
     * @returns A string URL for the icon, or null if no new icon should be generated.
     */
    getFaviconSrc(): PromiseLike<string | null>;
    /**
     * Called when the app needs to generate a new "badge" favicon.
     * @param content The content inside the "badge".
     * @param opts Extra parameters for the badge.
     * @returns A string URL for the icon, or null if no new icon should be generated.
     */
    getFaviconSrc(content: number | string, opts: GetFaviconParameters): PromiseLike<string | null>;
}

export abstract class BrandingExtensionsBase implements ProvideBrandingExtensions {
    public getAppTitle(context: AppTitleContext): string | null {
        return null;
    }
    public async getFaviconSrc(content?: number | string, opts?: GetFaviconParameters): Promise<string | null> {
        return null;
    }
}
