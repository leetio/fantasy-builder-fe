import React from "react";
import {Navigate, Outlet, type RouteProps, useLocation} from "react-router-dom";
import {useViewController} from "data/hooks";
import type {IAuthController} from "views/controllers/auth/auth.controller";
import {get} from "lodash-es";
import {observer} from "mobx-react";
import {Bindings} from "bindings";

export const NotAuthOnlyRoute: React.FC<RouteProps> = observer(() => {
	const {isAuthorized} = useViewController<IAuthController>(Bindings.AuthController);
	const location = useLocation();
	const fromPath = get(location, "state.from.pathname", "") as string;
	const fromSearch = get(location, "state.from.search", "") as string;
	const backURL = fromPath ? fromPath + fromSearch : "/my-account";

	if (isAuthorized) {
		return <Navigate to={backURL} replace />;
	}

	return <Outlet />;
});
