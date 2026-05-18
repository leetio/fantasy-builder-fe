import React from "react";
import {Navigate, Outlet, type RouteProps} from "react-router-dom";
import {useLocation} from "react-router";
import {useViewController} from "data/hooks";
import type {IAuthController} from "views/controllers/auth/auth.controller";
import {observer} from "mobx-react";
import {Bindings} from "bindings";

export const PrivateRoute: React.FC<RouteProps> = observer(() => {
	const {isAuthorized, wasLoggedOut} = useViewController<IAuthController>(
		Bindings.AuthController
	);
	const location = useLocation();

	if (isAuthorized) {
		return <Outlet />;
	}

	const state = wasLoggedOut ? {} : {from: location};

	return <Navigate to="/" state={state} replace />;
});
