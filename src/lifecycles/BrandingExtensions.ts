interface AppTitleBase {
    /**
     * The configured brand name.
     * @example Element
     */
    brand: string;
    /**
     * Is the client sync loop in an error state.
     */
    syncError: boolean;
    /**
     * The current unread notification count.
     */
    unreadNotificationCount?: number;
    /**
     * Has the client muted notifications.
     */
    notificationsMuted?: boolean;
}

export interface AppTitleInRoom extends AppTitleBase {
    /**
     * The room name, may be undefined if the room has no name.
     */
    roomName?: string;
    /**
     * The room ID of the room in view.
     */
    roomId: string;
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
    /**
     * Called whenever the client would update the document title.
     * @param context Current application context used to generate the title.
     * @returns A string to be used for the full title, or null to use the default title.
     */
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
