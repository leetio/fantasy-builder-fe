import "reflect-metadata";
import {describe, beforeEach, it, expect} from "vitest";
import {Container} from "inversify";
import {type IUserStore, UserStore} from "data/stores/user/user.store";
import {AuthApiProviderSuccessMock} from "data/providers/auth_api/__mocks__/auth_api.provider";
import type {IAuthApiProvider} from "data/providers/auth_api/auth_api.provider";
import {Bindings} from "bindings";
import type {IUserApiProvider} from "data/providers/user_api/user_api.provider";
import {
	UserApiProviderSuccessMock,
	userMock,
} from "data/providers/user_api/__mocks__/user_api.provider";
import type {IPasswordApiProvider} from "data/providers/password_api/password_api.provider";
import {PasswordApiProviderSuccessMock} from "data/providers/password_api/__mocks__/password_api.provider";

describe("User Store", () => {
	let container: Container;
	let userStore: IUserStore;

	beforeEach(() => {
		container = new Container();

		container.bind<IUserApiProvider>(Bindings.UserApiProvider).to(UserApiProviderSuccessMock);
		container.bind<IAuthApiProvider>(Bindings.AuthApiProvider).to(AuthApiProviderSuccessMock);
		container
			.bind<IPasswordApiProvider>(Bindings.PasswordApiProvider)
			.to(PasswordApiProviderSuccessMock);

		container.bind<IUserStore>(Bindings.UserStore).to(UserStore);

		userStore = container.get<IUserStore>(Bindings.UserStore);
	});

	it("should store user data on login and clear on logout", async () => {
		await userStore.login({
			email: "fake.user@mail.com",
			// This fake password which is not exist in real DB so absolutely safe
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			password: "password",
		});

		expect(userStore.user).toEqual(userMock);
		expect(userStore.isAuthorized).toBe(true);
		expect(userStore.wasLoggedOut).toBe(false);
		expect(userStore.user?.displayName).toBe(`${userMock.displayName}`);

		await userStore.logout();

		expect(userStore.user).toBe(undefined);
		expect(userStore.isAuthorized).toBe(false);
		expect(userStore.wasLoggedOut).toBe(true);
	});
});

export {};
