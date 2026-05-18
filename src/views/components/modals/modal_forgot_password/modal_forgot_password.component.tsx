import React from "react";
import {observer} from "mobx-react";
import {DialogContent} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {IModalController} from "views/controllers/modal/modal.controller";
import {ModalType} from "data/enums";
import {ModalHOC} from "views/components/modals/modal_hoc/modal_hoc.component";
import {ForgotPasswordForm} from "views/components/forgot_password_form/forgot_password_form.component";

export const ModalForgotPassword: React.FC = observer(() => {
	const {isOpen, close} = useViewController<IModalController>(Bindings.ModalController, {
		type: ModalType.FORGOT_PASSWORD,
	});

	return (
		<ModalHOC isOpen={isOpen} onClose={close}>
			<DialogContent>
				<ForgotPasswordForm />
			</DialogContent>
		</ModalHOC>
	);
});
