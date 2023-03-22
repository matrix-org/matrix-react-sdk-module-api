/*
Copyright 2023 Mikhail Aheichyk
Copyright 2023 Nordeck IT + Consulting GmbH.

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
 * Banner lifecycle events.
 */
export enum BannerLifecycle {
    /**
     * An event to request the banner.
     */
    Banner = "banner",
}

/**
 * Opts object that is populated with the banner.
 */
export type BannerOpts = {
    /**
     * A banner to be shown at the top of Element. If not defined, then no change to the Element.
     */
    banner: JSX.Element | undefined;
};

/**
 * Helper type that documents how to implement a banner listener.
 */
export type BannerListener = (opts: BannerOpts) => void;
