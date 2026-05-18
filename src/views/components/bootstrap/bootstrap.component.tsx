import React, {Fragment, type PropsWithChildren} from "react";
import {PagePreloader} from "views/components/preloader";
import {useViewController} from "data/hooks";
import {observer} from "mobx-react";
import type {IBootstrapController} from "views/components/bootstrap/bootstrap.controller";
import {Bindings} from "bindings";

export const Bootstrap: React.FC<PropsWithChildren> = observer(({children}) => {
	const {isReady} = useViewController<IBootstrapController>(Bindings.BootstrapController);
	return isReady ? <Fragment>{children}</Fragment> : <PagePreloader />;
});
