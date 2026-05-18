import React from "react";
import {useViewController} from "data/hooks";
import type {IHelpController} from "views/pages/help/help.controller";
import {observer} from "mobx-react";
import {Box, Container, Tab, Tabs} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {useLocation} from "react-router";
import {Exist} from "views/components/exist/exist.component";
import {HelpListComponent} from "views/components/help/help_list/help_list.component";
import {ContactUsComponent} from "views/components/help/contact_us/contact_us.component";
import {Bindings} from "bindings";
import {HelpContent} from "views/components/help/help_content/help_content.component";

export const HelpPage: React.FC = observer(() => {
	const location = useLocation();

	const controller = useViewController<IHelpController>(Bindings.HelpController, {
		navigate: useNavigate(),
		pathname: location.pathname,
	});

	const {i18n, currentTab, tabs, isActiveTab, buildPathName, isContactUs} = controller;

	return (
		<section>
			<Container>
				<h3>{i18n.t("help.page.title", "Help")}</h3>
			</Container>
			<Container>
				{currentTab && (
					<Tabs value={currentTab} variant="fullWidth">
						{tabs.map((tab) => (
							<Tab
								sx={{fontWeight: 700}}
								value={tab.id}
								key={tab.id}
								component={NavLink}
								label={tab.name}
								to={buildPathName(tab.name)}
							/>
						))}
					</Tabs>
				)}

				<Box>
					{tabs.map((tab) => {
						if (!isActiveTab(tab.id)) {
							return null;
						}

						const sections = controller.findSectionsById(tab.id);

						if (isContactUs(tab.id)) {
							return <ContactUsComponent key={tab.id} article={sections[0]} />;
						}

						if (sections.length === 1) {
							return (
								<Exist when={isActiveTab(tab.id)} key={tab.id}>
									<HelpContent
										dangerouslySetInnerHTML={{
											__html: sections[0]?.body ?? "",
										}}
									/>
								</Exist>
							);
						}

						return <HelpListComponent key={tab.id} list={sections} />;
					})}
				</Box>
			</Container>
		</section>
	);
});

export default HelpPage;
