import React from "react";
import {observer} from "mobx-react";
import {DialogContent} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {IModalController} from "views/controllers/modal/modal.controller";
import {ModalType} from "data/enums";
import {ModalHOC} from "views/components/modals/modal_hoc/modal_hoc.component";
import {RegistrationForm} from "views/components/registration_form/registration_form.component";

export const ModalRegistration: React.FC = observer(() => {
	const {isOpen, close} = useViewController<IModalController>(Bindings.ModalController, {
		type: ModalType.REGISTRATION,
	});

	return (
		<ModalHOC isOpen={isOpen} onClose={close}>
			<DialogContent>
				<RegistrationForm />
			</DialogContent>
		</ModalHOC>
	);
});
