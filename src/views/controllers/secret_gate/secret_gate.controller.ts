import {ViewController} from "data/types/structure";
import {injectable} from "inversify";

export interface ISecretGateController extends ViewController {
	handleSecretClick: () => void;
}

@injectable()
export class SecretGateController implements ISecretGateController {
	private static _count = 0;

	static get IS_SECRET_PASSED() {
		const IS_SECRET_ENABLED = Boolean(
			JSON.parse(import.meta.env.VITE_IS_SECRET_ENABLED || "false")
		);

		if (IS_SECRET_ENABLED) {
			return Boolean(JSON.parse(sessionStorage.getItem("isSecretPassed") || "false"));
		}

		return true;
	}

	handleSecretClick = () => {
		if (SecretGateController.IS_SECRET_PASSED) {
			return;
		}

		SecretGateController._count += 1;

		const REQUIRED_CLICK_TIMES = 10;

		if (SecretGateController._count >= REQUIRED_CLICK_TIMES) {
			sessionStorage.setItem("isSecretPassed", "true");
			window.location.reload();
		}
	};
}
