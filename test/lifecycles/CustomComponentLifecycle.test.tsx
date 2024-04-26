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

import React, { ReactPortal } from "react";
import { render, screen } from "@testing-library/react";
import { RuntimeModule } from "../../src/RuntimeModule";
import {
    CustomComponentLifecycle,
    CustomComponentListener,
    CustomComponentOpts,
} from "../../src/lifecycles/CustomComponentLifecycle";
import { ModuleApi } from "../../src/ModuleApi";

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
interface MyComponentProps {
    children: React.ReactNode;
}

// Mock a functional custom Component
const CustomFunctionalComponent: React.FC<MyComponentProps> = ({ children }) => {
    return <div title="CustomFunctionalComponent">{children}</div>;
};
// Mock a functional Component
const FunctionalComponent: React.FC<MyComponentProps> = ({ children }) => {
    return <div title="FunctionalComponent">{children}</div>;
};

describe("CustomComponentLifecycle", () => {
    describe("tests on Class components", () => {
        let module: RuntimeModule;
        let moduleApi: ModuleApi;
        beforeAll(() => {
            module = new (class extends RuntimeModule {
                constructor() {
                    super(moduleApi);

                    this.on(CustomComponentLifecycle.UserMenu, this.customComponentListener);
                }

                protected customComponentListener: CustomComponentListener = (
                    customComponentOpts: CustomComponentOpts,
                ) => {
                    customComponentOpts.CustomComponent = ({ children }) => {
                        const usermenu = React.Children.toArray(children)[0] as UserMenu;
                        const usermenuChildren = usermenu?.props?.children ?? React.Fragment;

                        return (
                            <>
                                <CustomUserMenu>{usermenuChildren}</CustomUserMenu>
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
    describe("tests on FC components", () => {
        let module: RuntimeModule;
        let moduleApi: ModuleApi;
        beforeAll(() => {
            module = new (class extends RuntimeModule {
                constructor() {
                    super(moduleApi);
                    // In this case we are reacting to the "Experimental" lifecyle, because we are testing a generic mocked functional component.
                    this.on(CustomComponentLifecycle.Experimental, this.customComponentListener);
                }

                protected customComponentListener: CustomComponentListener = (
                    customComponentOpts: CustomComponentOpts,
                ) => {
                    customComponentOpts.CustomComponent = ({ children }) => {
                        // We extract the component wrapped in CustomComponentOpts.CustomComponent
                        const defaultFunctionalComponent: ReactPortal = React.Children.toArray(
                            children,
                        )[0] as ReactPortal;
                        return (
                            <>
                                <CustomFunctionalComponent>
                                    {defaultFunctionalComponent.props.children}
                                </CustomFunctionalComponent>
                            </>
                        );
                    };
                };
            })();
        });

        it("should swap the the wrapped FunctionalComponent with the CustomFunctionalComponent and keep it's children", () => {
            const customComponentOpts: CustomComponentOpts = { CustomComponent: React.Fragment };
            module.emit(CustomComponentLifecycle.Experimental, customComponentOpts);

            render(
                <customComponentOpts.CustomComponent>
                    <FunctionalComponent>
                        <span>Child1</span>
                        <span>Child2</span>
                    </FunctionalComponent>
                </customComponentOpts.CustomComponent>,
            );

            const CustomFunctionalComponent = screen.getByTitle("CustomFunctionalComponent");

            expect(CustomFunctionalComponent).toBeInTheDocument();
            expect(CustomFunctionalComponent.children.length).toEqual(2);

            const defaultFunctionalCompoonent = screen.queryByTitle("FunctionalComponent");
            expect(defaultFunctionalCompoonent).toStrictEqual(null);

            const child1 = screen.getByText(/Child1/i);
            const child2 = screen.getByText(/Child2/i);
            expect(child1).toBeInTheDocument();
            expect(child2).toBeInTheDocument();
        });
        it("should swap the the wrapped FunctionalComponent(alternative rendering style) with the CustomFunctionalComponent", () => {
            const customComponentOpts: CustomComponentOpts = { CustomComponent: React.Fragment };
            module.emit(CustomComponentLifecycle.Experimental, customComponentOpts);

            const firstChild = <span key={1}>Child1</span>;
            const secondChild = <span key={2}>Child2</span>;

            render(
                <customComponentOpts.CustomComponent>
                    {FunctionalComponent({ children: [firstChild, secondChild] })}
                </customComponentOpts.CustomComponent>,
            );
            const CustomFunctionalComponent = screen.getByTitle("CustomFunctionalComponent");
            expect(CustomFunctionalComponent).toBeInTheDocument();

            const defaultFunctionalCompoonent = screen.queryByTitle("FunctionalComponent");
            expect(defaultFunctionalCompoonent).toStrictEqual(null);

            const child1 = screen.getByText(/Child1/i);
            const child2 = screen.getByText(/Child2/i);
            expect(child1).toBeInTheDocument();
            expect(child2).toBeInTheDocument();
        });
        it("should NOT swap the FucntionalComponent when module emits an event we are not listening to in the module", () => {
            const customComponentOpts: CustomComponentOpts = { CustomComponent: React.Fragment };

            // We emit a different lifecycle event than what our mock-module is listening to
            module.emit(CustomComponentLifecycle.ErrorBoundary, customComponentOpts);

            render(
                <customComponentOpts.CustomComponent>
                    <FunctionalComponent>
                        <span>Child1</span>
                        <span>Child2</span>
                    </FunctionalComponent>
                </customComponentOpts.CustomComponent>,
            );

            // The document should not be affected at all
            const defaultFunctionalCompoonent = screen.getByTitle("FunctionalComponent");
            expect(defaultFunctionalCompoonent).toBeInTheDocument();
            expect(defaultFunctionalCompoonent.children.length).toEqual(2);

            const CustomFunctionalComponent = screen.queryByTitle("CustomFunctionalComponent");
            expect(CustomFunctionalComponent).toStrictEqual(null);

            const child1 = screen.getByText(/Child1/i);
            const child2 = screen.getByText(/Child2/i);
            expect(child1).toBeInTheDocument();
            expect(child2).toBeInTheDocument();
        });
    });
});
