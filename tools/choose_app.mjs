#!/usr/bin/env node
import {readdirSync, unlinkSync, statSync, existsSync} from "fs";
import {join} from "path";
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
	.describe("p", "Project path (CLIENT/GAME or FLAT_PROJECT)")
	.example("$0 -p FANTASY_PLATFORM/fantasy-super-rugby", "Use CLIENT/GAME structure")
	.example("$0 -p LOCAL_FANTASY", "Use flat structure (legacy)")
	.help("h")
	.alias("h", "help")
	.version("v", version)
	.alias("v", "version")
	.argv;

const ROOT_PATH = "./";
const exclude = [".DS_Store", ".gitkeep"];

const getDotEnvsList = (path = ROOT_PATH) => {
	let regex = /^\.env(.*)$/;
	return readdirSync(path)
		.filter((f) => regex.test(f))
		.map((f) => path + f);
};

/**
 * Check if a path is a valid project config (has env/ folder)
 */
const isProjectConfig = (path) => {
	return existsSync(join(path, "env"));
};

/**
 * Scan configs/ for flat projects and nested CLIENT/GAME structure
 */
const scanConfigs = () => {
	const configsPath = "./configs";
	const entries = without(readdirSync(configsPath), ...exclude);
	const projects = [];

	for (const entry of entries) {
		const entryPath = join(configsPath, entry);
		const stats = statSync(entryPath);

		if (!stats.isDirectory()) continue;

		// Check if this is a flat project (has env/ directly)
		if (isProjectConfig(entryPath)) {
			projects.push({
				type: "flat",
				client: null,
				game: entry,
				path: entryPath,
				display: entry,
			});
		} else {
			// Scan for games under this client
			const games = without(readdirSync(entryPath), ...exclude);
			for (const game of games) {
				const gamePath = join(entryPath, game);
				if (statSync(gamePath).isDirectory() && isProjectConfig(gamePath)) {
					projects.push({
						type: "nested",
						client: entry,
						game,
						path: gamePath,
						display: `${entry}/${game}`,
					});
				}
			}
		}
	}

	return projects;
};

const chooseProject = async () => {
	const inquirer = await import("inquirer").then((module) => module.default);
	const projects = scanConfigs();

	if (!projects.length) {
		console.log("No projects found! Create at least one in configs/");
		process.exit(1);
	}

	if (projects.length === 1) {
		return projects[0].path;
	}

	const answer = await inquirer.prompt({
		type: "list",
		name: "project",
		message: "Choose a project:",
		choices: projects.map((p) => ({
			name: p.display,
			value: p.path,
		})),
	});

	return answer.project;
};

const removeDotEnvsFromRoot = () => {
	try {
		getDotEnvsList().forEach((file_path) => unlinkSync(file_path));
	} catch (e) {
		// Ignore if files don't exist
	}
};

const copyToRoot = (app_path) => {
	if (!app_path) {
		console.log("Folder was not found!");
		process.exit(1);
	}

	// Copy env files from env/ to root
	const envPath = join(app_path, "env");
	if (existsSync(envPath)) {
		copydir(envPath, ROOT_PATH, {cover: true});
	}

	// Copy public/ assets (merge with existing public/)
	const publicPath = join(app_path, "public");
	if (existsSync(publicPath)) {
		const rootPublic = join(ROOT_PATH, "public");
		copydir(publicPath, rootPublic, {cover: true});
	}

	// Copy index.html if exists
	const indexPath = join(app_path, "index.html");
	const rootIndexPath = join(ROOT_PATH, "index.html");
	if (existsSync(indexPath)) {
		copydir(indexPath, rootIndexPath, {cover: true});
	}

	// Note: src/ overrides stay in configs/ and are loaded via import.meta.glob
};

const getConfigPath = async () => {
	if (argv.p) {
		const configPath = `configs/${argv.p}`;
		if (!isProjectConfig(configPath)) {
			console.error(`Error: ${configPath} is not a valid project (missing env/ folder)`);
			process.exit(1);
		}
		return configPath;
	}
	return chooseProject();
};

(async () => {
	clear();
	const configPath = await getConfigPath();
	console.log(`Using config: ${configPath}`);
	removeDotEnvsFromRoot();
	copyToRoot(configPath);
})();
