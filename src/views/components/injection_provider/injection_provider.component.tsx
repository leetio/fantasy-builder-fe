import React, {type PropsWithChildren} from "react";
import type {Container} from "inversify";

export const InjectionContext = React.createContext<{container: Container | null}>({
	container: null,
});

interface IProps {
	container: Container;
}

export const InjectionProvider: React.FC<PropsWithChildren<IProps>> = ({children, container}) => (
	<InjectionContext.Provider value={{container}}>{children}</InjectionContext.Provider>
);
