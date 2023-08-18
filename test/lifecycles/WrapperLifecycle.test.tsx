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

import React from 'react';
import { render, screen } from '@testing-library/react';

import { RuntimeModule } from '../../src/RuntimeModule';
import { WrapperLifecycle, WrapperListener, WrapperOpts } from '../../src/lifecycles/WrapperLifecycle';

describe('WrapperLifecycle', () => {
    let module: RuntimeModule;

    beforeAll(() => {
        module = new class extends RuntimeModule {
            constructor() {
                super(undefined as any);

                this.on(WrapperLifecycle.Wrapper, this.wrapperListener);
            }

            protected wrapperListener: WrapperListener = (wrapperOpts: WrapperOpts) => {
                wrapperOpts.Wrapper = ({ children }) => {
                    return <>
                        <header>Header</header>
                        {children}
                        <footer>Footer</footer>
                    </>;
                };
            };
        };
    });

    it('should wrap a matrix client with header and footer', () => {
        const opts: WrapperOpts = { Wrapper: React.Fragment };
        module.emit(WrapperLifecycle.Wrapper, opts);

        render(<opts.Wrapper><span>MatrixChat</span></opts.Wrapper>);

        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        const matrixChat = screen.getByText(/MatrixChat/i);
        expect(matrixChat).toBeInTheDocument();
        const footer = screen.getByRole('contentinfo');
        expect(footer).toBeInTheDocument();

        expect(header.nextSibling).toBe(matrixChat);
        expect(matrixChat.nextSibling).toBe(footer);
    });
});

