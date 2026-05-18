import {observer} from "mobx-react";
import React from "react";
import {Button, Stack, Typography} from "@mui/material";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import styled from "@emotion/styled";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import type {IDeleteAccountController} from "views/components/delete_account/delete_account.controller";

const WarningButton = styled(Button)``;

export const DeleteAccount: React.FC = observer(() => {
	const {i18n, deleteAccountModal, isLoading} = useViewController<IDeleteAccountController>(
		Bindings.DeleteAccountController
	);

	return (
		<Stack gap={1}>
			<Typography color="text.custom" variant="h5" fontWeight={700}>
				{i18n.t("my_account.delete.header", "Delete Account")}
			</Typography>
			<Typography variant="body1">{i18n.t("my_account.delete.body")}</Typography>
			<Exist when={!isLoading}>
				<WarningButton
					disabled={isLoading}
					variant="outlined"
					color="error"
					onClick={deleteAccountModal}>
					{i18n.t("my_account.delete.button")}
				</WarningButton>
			</Exist>
			<Exist when={isLoading}>
				<Preloader />
			</Exist>
		</Stack>
	);
});
