/*
Copyright 2024 Verji Tech AS

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

import React from "react";
import { render, screen } from "@testing-library/react";

import { RuntimeModule } from "../../src/RuntimeModule";
import {
    CustomComponentLifecycle,
    CustomComponentListener,
    CustomComponentOpts,
} from "../../src/lifecycles/CustomComponentLifecycle";

//Mock a CustomUserMenu
class CustomUserMenu extends React.Component {
    render() {
        return (
            <div className="customUserMenu" title="CustomUserMenu">
                {this.props.children}
            </div>
        );
    }
}
//Mock a default UserMenu
class UserMenu extends React.Component {
    render() {
        return (
            <div className="defaultUserMenu" title="UserMenu">
                {this.props.children}
            </div>
        );
    }
}
describe("CustomComponentLifecycle", () => {
    let module: RuntimeModule;

    beforeAll(() => {
        module = new (class extends RuntimeModule {
            constructor() {
                super(undefined as any);

                this.on(CustomComponentLifecycle.UserMenu, this.customComponentListener);
            }

            protected customComponentListener: CustomComponentListener = (customComponentOpts: CustomComponentOpts) => {
                customComponentOpts.CustomComponent = ({ children }) => {
                    let usermenu: any = React.Children.toArray(children)[0];
                    return (
                        <>
                            <CustomUserMenu>{usermenu.props?.children}</CustomUserMenu>
                        </>
                    );
                };
            };
        })();
    });

    it("should swap the UserMenu with CustomUserMenu and keep it's children", () => {
        const customComponentOpts: CustomComponentOpts = { CustomComponent: React.Fragment };
        module.emit(CustomComponentLifecycle.UserMenu, customComponentOpts);

        render(
            <customComponentOpts.CustomComponent>
                <UserMenu>
                    <span>Child1</span>
                    <span>Child2</span>
                </UserMenu>
            </customComponentOpts.CustomComponent>,
        );

        const customUserMenu = screen.getByTitle("CustomUserMenu");
        expect(customUserMenu).toBeInTheDocument();
        expect(customUserMenu.children.length).toEqual(2);

        const defaultUserMenu = screen.queryByTitle("UserMenu");
        expect(defaultUserMenu).toStrictEqual(null);

        const child1 = screen.getByText(/Child1/i);
        const child2 = screen.getByText(/Child2/i);
        expect(child1).toBeInTheDocument();
        expect(child2).toBeInTheDocument();
    });

    it("should NOT swap the UserMenu when module emits an event we are not listening to in the module", () => {
        const customComponentOpts: CustomComponentOpts = { CustomComponent: React.Fragment };

        // We emit a different lifecycle event than what our mock-module is listening to
        module.emit(CustomComponentLifecycle.Experimental, customComponentOpts);

        render(
            <customComponentOpts.CustomComponent>
                <UserMenu>
                    <span>Child1</span>
                    <span>Child2</span>
                </UserMenu>
            </customComponentOpts.CustomComponent>,
        );

        // The document should not be affected at all
        const defaultUserMenu = screen.getByTitle("UserMenu");
        expect(defaultUserMenu).toBeInTheDocument();
        expect(defaultUserMenu.children.length).toEqual(2);

        const customUserMenu = screen.queryByTitle("CustomUserMenu");
        expect(customUserMenu).toStrictEqual(null);

        const child1 = screen.getByText(/Child1/i);
        const child2 = screen.getByText(/Child2/i);
        expect(child1).toBeInTheDocument();
        expect(child2).toBeInTheDocument();
    });
});
