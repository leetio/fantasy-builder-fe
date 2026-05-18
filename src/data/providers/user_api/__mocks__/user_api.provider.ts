import {injectable} from "inversify";
import {createApiFailedResponse, createApiSuccessResponse} from "data/utils/test.utils";
import type {
	IRegistrationPayload,
	IUpdateUserPayload,
	IUserApiProvider,
	IUsername,
} from "data/providers/user_api/user_api.provider";

export const userMock = {
	id: 1,
	email: "test@test.com",
	displayName: "fakeUser",
	isNotificationsEnabled: false,
};

@injectable()
export class UserApiProviderSuccessMock implements IUserApiProvider {
	checkUsername = (_: IUsername) => createApiSuccessResponse(undefined);
	deactivateAccount = () => createApiSuccessResponse(undefined);
	register = (_params: IRegistrationPayload) => createApiSuccessResponse({user: userMock});
	update = (_params: IUpdateUserPayload) => createApiSuccessResponse({user: userMock});
	user = () => createApiSuccessResponse({user: userMock});
}

@injectable()
export class UserApiProviderFailedMock implements IUserApiProvider {
	checkUsername = (_: IUsername) => createApiFailedResponse();
	deactivateAccount = () => createApiSuccessResponse({});
	register = (_params: IRegistrationPayload) =>
		createApiFailedResponse([
			{
				message: "Wrong credentials",
			},
		]);
	update = (_params: IUpdateUserPayload) => createApiFailedResponse();
	user = () =>
		createApiFailedResponse([
			{
				message: "Wrong credentials",
			},
		]);
}
