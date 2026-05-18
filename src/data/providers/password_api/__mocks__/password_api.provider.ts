import {injectable} from "inversify";
import {createApiFailedResponse, createApiSuccessResponse} from "data/utils/test.utils";
import type {
	IForgotPasswordPayload,
	IPasswordApiProvider,
	IResetPasswordPayload,
} from "data/providers/password_api/password_api.provider";

@injectable()
export class PasswordApiProviderSuccessMock implements IPasswordApiProvider {
	forgotPassword = (_params: IForgotPasswordPayload) => createApiSuccessResponse(undefined);
	resetPassword = (_params: IResetPasswordPayload) => createApiSuccessResponse(undefined);
}

@injectable()
export class PasswordApiProviderFailedMock implements IPasswordApiProvider {
	forgotPassword = (_params: IForgotPasswordPayload) => createApiFailedResponse();
	resetPassword = (_params: IResetPasswordPayload) => createApiFailedResponse();
}
