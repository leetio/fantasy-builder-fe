import React from "react";
import {observer} from "mobx-react";
import {Button, DialogActions, DialogContent, Icon} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import ErrorIcon from "@mui/icons-material/Error";
import {Exist} from "views/components/exist/exist.component";
import {ModalType} from "data/enums";
import type {IModalController} from "views/controllers/modal/modal.controller";
import {ModalHOC} from "views/components/modals/modal_hoc/modal_hoc.component";

export const ModalConfirm: React.FC = observer(() => {
	const {isOpen, modalContent, i18n, close} = useViewController<IModalController>(
		Bindings.ModalController,
		{type: ModalType.CONFIRM}
	);

	const title = modalContent?.title ?? i18n.t("modal.confirm.title", "Confirm");
	const content = modalContent?.message;

	return (
		<ModalHOC isOpen={isOpen} onClose={close}>
			<DialogContent>
				<Icon className="w-20 h-20">
					<ErrorIcon className="w-full h-auto text-red-700" />
				</Icon>
				<h3>{title}</h3>
				<Exist when={content}>
					<div>{content}</div>
				</Exist>
			</DialogContent>
			<DialogActions className="p-4">
				<Button fullWidth variant="contained" onClick={close}>
					{i18n.t("modal.confirm.cancel_button", "No")}
				</Button>
				<Exist when={modalContent?.callback}>
					<Button fullWidth variant="contained" onClick={modalContent?.callback}>
						{i18n.t("modal.confirm.confirm_button", "Yes")}
					</Button>
				</Exist>
			</DialogActions>
		</ModalHOC>
	);
});
