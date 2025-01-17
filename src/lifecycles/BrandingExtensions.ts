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

export type AppTitleContext = AppTitleBase | AppTitleInRoom;

export interface ProvideBrandingExtensions {
    /**
     * Called whenever the client would update the document title.
     * @param context Current application context used to generate the title.
     * @returns A string to be used for the full title, or null to use the default title.
     */
    getAppTitle(context: AppTitleContext): string | null;
}

export abstract class BrandingExtensionsBase implements ProvideBrandingExtensions {
    public getAppTitle(context: AppTitleContext): string | null {
        return null;
    }
}
