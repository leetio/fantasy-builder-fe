import React, {Fragment} from "react";
import {Outlet} from "react-router-dom";
import {Header} from "views/components/header/header.component";
import {Footer} from "views/components/footer/footer.component";

export const MainLayout: React.FC = () => (
	<Fragment>
		<Header />
		<main className="flex flex-col flex-1 items-center w-full">
			<Outlet />
		</main>
		<Footer />
	</Fragment>
);
