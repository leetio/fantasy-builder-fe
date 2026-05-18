import React from "react";
import {observer} from "mobx-react";
import {DialogContent, Icon} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Exist} from "views/components/exist/exist.component";
import type {IModalController} from "views/controllers/modal/modal.controller";
import {ModalType} from "data/enums";
import {ModalHOC} from "views/components/modals/modal_hoc/modal_hoc.component";

export const ModalSuccess: React.FC = observer(() => {
	const {isOpen, modalContent, i18n, close} = useViewController<IModalController>(
		Bindings.ModalController,
		{type: ModalType.SUCCESS}
	);

	const title = i18n.t(modalContent?.title ?? "modal.error.title", "");
	const content = i18n.t(modalContent?.message ?? "", modalContent?.message);

	return (
		<ModalHOC isOpen={isOpen} onClose={close}>
			<DialogContent>
				<Icon className="w-20 h-20">
					<CheckCircleIcon className="w-full h-auto text-green-700" />
				</Icon>
				<h3>{title}</h3>
				<Exist when={content}>
					<div>{content}</div>
				</Exist>
			</DialogContent>
		</ModalHOC>
	);
});
