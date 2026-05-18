import React from "react";
import {observer} from "mobx-react";
import {DialogContent} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {IModalController} from "views/controllers/modal/modal.controller";
import {ModalType} from "data/enums";
import {ModalHOC} from "views/components/modals/modal_hoc/modal_hoc.component";
import {LoginForm} from "views/components/login_form/login_form.component";

export const ModalLogin: React.FC = observer(() => {
	const {isOpen, close} = useViewController<IModalController>(Bindings.ModalController, {
		type: ModalType.LOGIN,
	});

	return (
		<ModalHOC isOpen={isOpen} onClose={close}>
			<DialogContent>
				<LoginForm />
			</DialogContent>
		</ModalHOC>
	);
});
