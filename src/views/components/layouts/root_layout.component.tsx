import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import {Session} from "views/components/session/session.component";
import {PagePreloader} from "views/components/preloader";
import {ModalError} from "views/components/modals/modal_error/modal_error.component";
import {ModalSuccess} from "views/components/modals/modal_success/modal_success.component";
import {ModalConfirm} from "views/components/modals/modal_confirm/modal_confirm.component";

export const RootLayout: React.FC = () => (
	<Session>
		<Suspense fallback={<PagePreloader />}>
			<Outlet />
		</Suspense>
		<ModalError />
		<ModalSuccess />
		<ModalConfirm />
	</Session>
);
