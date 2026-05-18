import React, {Fragment, type PropsWithChildren} from "react";
import {PagePreloader} from "views/components/preloader";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {ISessionController} from "views/components/session/session.controller";

export const Session: React.FC<PropsWithChildren> = observer(({children}) => {
	const {isSessionChecked} = useViewController<ISessionController>(Bindings.SessionController);
	return isSessionChecked ? <Fragment>{children}</Fragment> : <PagePreloader />;
});
