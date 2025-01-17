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

export type AppTitleContext = AppTitleBase | AppTitleInRoom;

export interface ProvideBrandingExtensions {
    getAppTitle(context: AppTitleContext): string | null;
}

export abstract class BrandingExtensionsBase implements ProvideBrandingExtensions {
    public getAppTitle(context: AppTitleContext): string | null {
        return null;
    }
}
