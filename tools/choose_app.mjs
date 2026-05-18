#!/usr/bin/env node
import {readdirSync, unlinkSync} from "fs";
import copydir from "copy-dir";
import clear from "clear";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {createRequire} from "module";
import {without, first, size} from "lodash-es";

const require = createRequire(import.meta.url);
const {version} = require("../package.json");

const argv = yargs(hideBin(process.argv))
	.alias("p", "project")
	.describe("p", "Project folder name from which you want to use .env files")
	.example("$0 -p PROJECT_NAME", "Use provided project configs")
	.help("h")
	.alias("h", "help")
	.version("v", version)
	.alias("v", "version")
	.argv;

const ROOT_PATH = "./";
const exclude = [".DS_Store"];

const getDotEnvsList = (path = ROOT_PATH) => {
	let regex = /^\.env(.*)$/;
	return readdirSync(path)
		.filter((f) => regex.test(f))
		.map((f) => path + f);
};

const chooseProject = async () => {
	const inquirer = await import("inquirer").then((module) => module.default);
	const list = without(readdirSync("./configs"), ...exclude);
	const total = size(list);

	if (!total) {
		console.log("Please create at least one app!");
		process.exit(1);
	}

	if (total === 1) {
		return `./configs/${first(list)}`;
	}

	return inquirer
		.prompt({
			type: "list",
			name: "app",
			message: "Please choose project you're want to work on: ",
			choices: list,
		})
		.then(({app}) => `./configs/${app}`);
};

const removeDotEnvsFromRoot = () =>
	getDotEnvsList().forEach((file_path) =>
		unlinkSync(ROOT_PATH + file_path)
	);

const copyToRoot = (app_path) => {
	if (app_path) {
		copydir(`${app_path}/`, ROOT_PATH, {cover: true});
	} else {
		console.log("Folder was not found!");
		process.exit(1);
	}
};

const getConfigPath = async () => {
	return argv.p ? `configs/${argv.p}` : chooseProject();
};

(async () => {
	clear();
	removeDotEnvsFromRoot();
	copyToRoot(await getConfigPath());
})();
