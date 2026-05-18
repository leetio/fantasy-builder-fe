// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config({
		extends: [
			eslint.configs.recommended,
			tseslint.configs.recommendedTypeChecked,
			react.configs.flat.recommended,
			reactHooks.configs["recommended-latest"],
			jsxA11y.flatConfigs.recommended,
			sonarjs.configs.recommended,
			eslintConfigPrettier,
		],
		plugins: {
			boundaries,
			// TODO Add naming convention plugin
			// "filename-rules": require("eslint-plugin-filename-rules"),
		},
		ignores: [
			"node_modules/**",
			"dist/**",
			"vite.config.mts",
			"eslint.config.mjs",
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				warnOnUnsupportedTypeScriptVersion: true,
			},
		},
		settings: {
			"boundaries/ignore": ["**/__mocks__/*.ts", "**/*.test.ts", "**/*.test.tsx"],
			"boundaries/elements": [
				{type: "Hook", pattern: "data/hooks/*"},
				{type: "Service", pattern: "data/services/*"},
				{type: "Provider", pattern: "data/providers/*"},
				{type: "Store", pattern: "data/stores/*"},
				{
					type: "Page",
					pattern: "views/pages/**/*.tsx",
					mode: "file",
					capture: ["name"],
				},
				{
					type: "Component",
					pattern: "views/components/**/*.tsx",
					mode: "file",
					capture: ["name"],
				},
				{
					type: "Controller",
					pattern: "views/*/**/*.controller.ts",
					mode: "file",
					// category can be one of the following values: components, pages, controllers
					capture: ["category", "name"],
				},
			],
			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
		rules: {
			...boundaries.configs.recommended.rules,
			// TODO Setup files naming convention rules
			// "filename-rules/match": [
			// 	"error",
			// 	{
			// 		patterns: {
			// 			"views/pages/**/*.tsx": "^[a-z\\-]+\\.page\\.tsx$",
			// 			"views/pages/**/*.ts": "^[a-z\\-]+\\.controller\\.ts$",
			// 		},
			// 	},
			// ],
			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					message: "${file.type} is not allowed to import ${dependency.type}",
					rules: [
						{
							from: "Page",
							allow: [
								"Component",
								// Allow to import controller from the same folder
								["Controller", {category: "pages", name: "${from.name}"}],
								// Allow to import shared controllers
								["Controller", {category: "controllers"}],
								"Hook",
							],
							message: "The page is allowed to import only its corresponding or shared controller, components and hooks.",
						},
						{
							from: "Component",
							allow: [
								"Component",
								// Allow to import controller from the same folder
								["Controller", {category: "components", name: "${from.name}"}],
								// Allow to import shared controllers
								["Controller", {category: "controllers"}],
								"Hook",
							],
							message: "The component is allowed to import only its corresponding or shared controller, and hooks.",
						},
						{
							from: "Controller",
							allow: [
								"Store",
							],
							message: "The controller is allowed to import only stores.",
						},
						{
							from: "Store",
							allow: [
								"Provider",
								"Store",
							],
							message: "The store is allowed to import only providers and another stores.",
						},
						{
							from: "Provider",
							allow: [
								"Service",
							],
							message: "The provider is allowed to import only services.",
						},
						{
							from: "Service",
							allow: [
								"Service",
							],
							message: "The service is allowed to import only other services.",
						},
					],
				},
			],
			/**
			 * 1 to 10: Simple and easy-to-understand code
			 * 11 to 20: Moderately complex code
			 * 21 to 50: Complex code that should be refactored to reduce complexity
			 * 51 and above: Highly complex code that needs immediate attention
			 */
			"complexity": ["error", {"max": 7, "variant": "modified"}],
			// Enforces cognitive complexity checks to avoid overly complicated logic
			"sonarjs/cognitive-complexity": "error",
			// Prevents duplicate expressions in conditions or logical statements
			"sonarjs/no-identical-expressions": "error",
			// Warns when TODO comments are present in the code
			"sonarjs/todo-tag": "off",
			// Warns console statements
			"no-console": [
				"warn",
				{
					allow: ["warn", "error", "info"], // Allows these methods
				},
			],
			"sonarjs/unused-import": "warn",
			// Prevents explicitly initializing variables with `undefined`
			"no-undef-init": "error",
			// Disallows unnecessary `return await` to improve performance
			"no-return-await": "error",
			// Prevents the use of magic numbers (hardcoded numbers in the code)
			"no-magic-numbers": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			// Disables warnings for comments containing TODO, FIXME, etc.
			"no-warning-comments": "off",
			// Allows direct submodule imports (e.g., lodash/map instead of lodash)
			"no-submodule-imports": "off",
			// Disallows duplicate module imports to avoid redundant imports
			"no-duplicate-imports": "error",
			// Disables restrictions on using cookies (if applicable)
			"no-cookies": "off",
			// Disables enforcement of type casting preference
			"prefer-type-cast": "off",
			// Disables automatic sorting of object literals
			"object-literal-sort-keys": "off",
			// Disables enforcement of ordered imports
			"ordered-imports": "off",
			// Disallows relative imports (forces absolute or alias-based imports)
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["./", "../"],
							message: "Relative imports are not allowed.",
						},
					],
				},
			],
			"sonarjs/redundant-type-aliases": "off",
			// Warns when using dangerouslySetInnerHTML in React (security risk)
			"react/no-danger": "warn",
			// Disables enforcement of prop-types in React (use TypeScript instead)
			"react/prop-types": "off",
			// Allows unescaped entities in JSX (e.g., &nbsp;, <, >)
			"react/no-unescaped-entities": "off",
			// Disables old rule for enforcing interface prefixes (now handled in naming convention)
			"@typescript-eslint/interface-name-prefix": "off",
			// Allows defining explicit types for variables where TypeScript can infer them
			"@typescript-eslint/no-inferrable-types": "off",
			// Allows non-null assertions (`value!`) in TypeScript
			"@typescript-eslint/no-non-null-assertion": "off",
			// Disables requirement for explicit return types in function declarations
			"@typescript-eslint/explicit-function-return-type": "off",
			// Disables requirement for explicit return types in module boundaries
			"@typescript-eslint/explicit-module-boundary-types": "off",
			// Disables restriction on re-declaring variables (handled by base ESLint)
			"no-redeclare": "off",
			"@typescript-eslint/no-redeclare": "error",
			// Enforces naming conventions for interfaces and type aliases
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "enum",
					format: ["PascalCase"],
				},
				{
					selector: "enumMember",
					format: ["UPPER_CASE"],
				},
				{
					selector: "interface",
					format: ["PascalCase"],
					prefix: ["I"], // Interfaces must start with "I"
					filter: {
						regex: "^(Window|ImportMeta|ImportMetaEnv)$", // Excludes these names from the rule
						match: false,
					},
				},
				{
					selector: "typeAlias",
					format: ["PascalCase"],
					prefix: ["T"], // Type aliases must start with "T"
				},
			],
			"sonarjs/void-use": "off",
			// Prevents unused variables, arguments, and destructured values
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					args: "all",
					argsIgnorePattern: "^_", // Ignore function arguments starting with "_"
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_", // Ignore catch block errors starting with "_"
					destructuredArrayIgnorePattern: "^_", // Ignore destructured array elements starting with "_"
					varsIgnorePattern: "^_", // Ignore variables starting with "_"
					ignoreRestSiblings: true,
				}
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports", // Force to always use `import type`
					disallowTypeAnnotations: false, // Allows to use `import type` even in JSDoc
				},
			],
		},
	},
	{
		files: ["**/*.tsx"],
		rules: {
			complexity: ["error", {"max": 35, "variant": "modified"}],
		},
	},
	{
		files: ["src/data/constants/index.ts"],
		rules: {
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["UPPER_CASE"],
				},
			],
		},
	},
);