import "reflect-metadata";
import {describe, beforeEach, it, expect} from "vitest";
import {Container} from "inversify";
import {type IUserStore, UserStore} from "data/stores/user/user.store";
import {AuthApiProviderSuccessMock} from "data/providers/auth_api/__mocks__/auth_api.provider";
import {type IAuthApiProvider} from "data/providers/auth_api/auth_api.provider";
import {AuthController, type IAuthController} from "views/controllers/auth/auth.controller";
import {Bindings} from "bindings";
import type {IUserApiProvider} from "data/providers/user_api/user_api.provider";
import type {IPasswordApiProvider} from "data/providers/password_api/password_api.provider";
import {UserApiProviderSuccessMock} from "data/providers/user_api/__mocks__/user_api.provider";
import {PasswordApiProviderSuccessMock} from "data/providers/password_api/__mocks__/password_api.provider";

describe("Auth controller", () => {
	let container: Container;
	let userStore: IUserStore;
	let authController: IAuthController;

	beforeEach(() => {
		container = new Container();

		container.bind<IUserApiProvider>(Bindings.UserApiProvider).to(UserApiProviderSuccessMock);
		container.bind<IAuthApiProvider>(Bindings.AuthApiProvider).to(AuthApiProviderSuccessMock);
		container
			.bind<IPasswordApiProvider>(Bindings.PasswordApiProvider)
			.to(PasswordApiProviderSuccessMock);

		container.bind<IUserStore>(Bindings.UserStore).to(UserStore).inSingletonScope();
		container.bind<IAuthController>(Bindings.AuthController).to(AuthController);

		authController = container.get<IAuthController>(Bindings.AuthController);
		userStore = container.get<IUserStore>(Bindings.UserStore);
	});

	it("should react when user is authorized or logged out", async () => {
		await userStore.login({
			email: "fake.user@mail.com",
			// This fake password which is not exist in real DB so absolutely safe
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			password: "password",
		});

		expect(authController.isAuthorized).toBe(true);
		expect(authController.wasLoggedOut).toBe(false);

		await userStore.logout();

		expect(authController.isAuthorized).toBe(false);
		expect(authController.wasLoggedOut).toBe(true);
	});
});

export {};
