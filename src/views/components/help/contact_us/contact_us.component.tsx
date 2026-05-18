import React, {Fragment} from "react";
import {useViewController} from "data/hooks";
import type {
	IContactUsController,
	TArticle,
} from "views/components/help/contact_us/contact_us.controller";
import {Bindings} from "bindings";
import {HelpContent} from "views/components/help/help_content/help_content.component";
import {Box, Button} from "@mui/material";
import {observer} from "mobx-react";
import {Exist} from "views/components/exist/exist.component";

interface IProps {
	article?: TArticle;
}

export const ContactUsComponent: React.FC<IProps> = observer(({article}) => {
	const {i18n, openZendesk} = useViewController<IContactUsController>(
		Bindings.ContactUsController
	);

	return (
		<div>
			<Exist when={article?.body}>
				<Fragment>
					<HelpContent dangerouslySetInnerHTML={{__html: article?.body ?? ""}} />
					<Box className="p-5" />
				</Fragment>
			</Exist>
			<Button onClick={openZendesk}>{i18n.t("contact_us.button.copy", "Contact Us")}</Button>
		</div>
	);
});
