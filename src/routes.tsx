import React, {lazy, Suspense} from "react";
import {Route, createBrowserRouter, createRoutesFromElements} from "react-router-dom";
import {MainLayout, RootLayout} from "views/components/layouts";
import {PagePreloader} from "views/components/preloader";

import {retryFailLoad} from "data/utils";
import {NotAuthOnlyRoute, PrivateRoute} from "views/components/route";
import {BASE_URL} from "data/constants";

const Home = lazy(retryFailLoad(() => import("views/pages/landing/landing.page")));
const ResetPassword = lazy(
	retryFailLoad(() => import("views/pages/reset_password/reset_password.page"))
);
const MyAccount = lazy(retryFailLoad(() => import("views/pages/my_account/my_account.page")));
const Help = lazy(retryFailLoad(() => import("views/pages/help/help.page")));
const NotFound = lazy(retryFailLoad(() => import("views/pages/not_found/not_found.page")));

const MyLeagues = lazy(retryFailLoad(() => import("views/pages/my_leagues/my_leagues.page")));
const JoinLeagues = lazy(retryFailLoad(() => import("views/pages/join_leagues/join_leagues.page")));
const CreateLeague = lazy(
	retryFailLoad(() => import("views/pages/create_league/create_league.page"))
);
const League = lazy(retryFailLoad(() => import("views/pages/league/league.page")));
const LeagueSettings = lazy(
	retryFailLoad(() => import("views/pages/league_settings/league_settings.page"))
);
const LeagueInvite = lazy(
	retryFailLoad(() => import("views/pages/league_invite/league_invite.page"))
);
const LeagueAbout = lazy(retryFailLoad(() => import("views/pages/league_about/league_about.page")));
const LeagueTable = lazy(retryFailLoad(() => import("views/pages/league_table/league_table.page")));
const LeagueManage = lazy(
	retryFailLoad(() => import("views/pages/league_manage/league_manage.page"))
);

export const mainRouter = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<RootLayout />}>
			<Route element={<MainLayout />}>
				<Route element={<NotAuthOnlyRoute />}>
					<Route index element={<Home />} />
					<Route path="/reset-password" element={<ResetPassword />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/leagues">
						<Route index element={<MyLeagues />} />
						<Route path="create" element={<CreateLeague />} />
						<Route path="join" element={<JoinLeagues />}>
							<Route index path=":code" element={<JoinLeagues />} />
						</Route>
						<Route path=":leagueId" element={<League />}>
							<Route path="ladder" element={<LeagueTable />} />
							<Route path="invite" element={<LeagueInvite />} />
							<Route path="settings" element={<LeagueSettings />} />
							<Route path="about" element={<LeagueAbout />} />
							<Route path="manage" element={<LeagueManage />} />
						</Route>
					</Route>
					<Route path="/my-account" element={<MyAccount />} />
				</Route>
				<Route path="help/*" element={<Help />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Route>
	),
	{basename: BASE_URL}
);

export const restrictedRouter = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="*"
			element={
				<Suspense fallback={<PagePreloader />}>
					<NotFound />
				</Suspense>
			}
		/>
	),
	{basename: BASE_URL}
);
