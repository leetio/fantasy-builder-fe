import {injectable} from "inversify";
import type {IAuthApiProvider, ILoginPayload} from "data/providers/auth_api/auth_api.provider";
import {createApiFailedResponse, createApiSuccessResponse} from "data/utils/test.utils";

export const userMock = {
	id: 1,
	email: "test@test.com",
	displayName: "fakeUser",
	isNotificationsEnabled: false,
};

@injectable()
export class AuthApiProviderSuccessMock implements IAuthApiProvider {
	login = (_: ILoginPayload) =>
		createApiSuccessResponse({
			user: userMock,
		});

	logout = () => createApiSuccessResponse({});
}

@injectable()
export class AuthApiProviderFailedMock implements IAuthApiProvider {
	login = (_: ILoginPayload) =>
		createApiFailedResponse([
			{
				message: "Wrong credentials",
			},
		]);

	logout = () => createApiFailedResponse();
}
