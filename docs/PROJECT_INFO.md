# Table of Contents

* [What is MVVM pattern](#what-is-mvvm-pattern)
  * [Components of MVVM pattern](#components-of-mvvm-pattern)
* [Installation](#installation)
  * [Set local host environment](#set-local-host-environment)
* [Project structure](#project-structure)
  * [Keynotes](#keynotes)
* [Available Scripts](#available-scripts)
  * [yarn start](#yarn-start)
  * [yarn test](#yarn-test)
  * [yarn typecheck](#yarn-typecheck)
  * [yarn lint](#yarn-lint)
  * [yarn coverage](#yarn-coverage)
* [Used core technologies stack](#used-core-technologies-stack)
* [Development workflow](#development-workflow)
* [Bypass CORS for API and JSON requests in local development](#bypass-cors-for-api-and-json-requests-in-local-development)
* [Deployment](#deployment)
* [Troubleshooting and notes](#troubleshooting-and-notes)
* [How to create MVVM pattern for a new CRA application from scratch](#how-to-create-mvvm-pattern-for-a-new-cra-application-from-scratch)

***

## What is MVVM pattern

Model–View–ViewModel (MVVM) is the architectural pattern that facilitates the separation of the development of
the UI(View) – from the development of the business logic (Model) so that the UI(View) is not dependent on any specific Model.
The ViewModel of MVVM is a value converter, meaning the ViewModel is responsible for exposing (converting) the data objects 
from the model in such a way that objects are easily managed and presented.
In this respect, the ViewModel is more model than view, and handles most if not all the view's display logic.

### Components of MVVM pattern

#### Model
Model refers either to a domain model, which represents real state content, or to the data access layer, which represents content.

#### View
As in the Model–View–Controller (MVC) and Model–View–Presenter (MVP) patterns, the view is the structure, layout, 
and appearance of what a user sees on the screen. It displays a representation of the model and receives the user's 
interaction with the view (mouse clicks, keyboard input, screen tap gestures, etc.), and it forwards the handling of 
these to the ViewModel via the data binding (properties, event callbacks, etc.) that is defined to link the view and ViewModel.

#### ViewModel
The view model is an abstraction of the View exposing public properties and commands.
The main difference between the ViewModel and the Presenter in the MVP pattern is that the presenter has a reference 
to a View, whereas the ViewModel does not. Instead, a view directly binds to properties on the view model to send and 
receive updates.

## Installation

Clone the repo.

You will need to install latest stable version of `Node.js` and `yarn` if you haven't already.
You can refer the following links, to define how to do this:

* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com)

After you've set this stuff up please run `yarn`
command inside project's root directory.
This will install all the things you need for running the project.

#### Set local host environment

* Open `/etc/hosts` file
* Add `127.0.0.1 frontend.dev.loc` to hosts file

## Project structure

The project follows the [MVVM pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel).

**The usual data flow is: View is asking -> ViewModel which is asking -> Store which is asking -> Provider that uses Services.**

**Each View must use only one ViewModel, while any ViewModel can be used by many Views.**

**Any ViewModel may use many Stores or Services, but must not use any other ViewModels.**

    .
    ├─ public/
    │   ├─ favicon.ico
    │   └─ manifest.json
    │
    ├─ build/
    │
    ├─ configs/
    │   └─ PROJECT_NAME/
	│       └─ .env.*
    │
    ├─ tools/
    │
    ├─ node_modules/
    ├─ src/
    │   ├─ assets/
	│   │   ├─ css/
	│   │   │   └─ *.css
	│   │   │
	│   │   ├─ fonts/
	│   │   │   └─ *.woff2
	│   │   │
	│   │   └─ img/
	│   │       └─ *.{png,svg,jpg,avif,webp}
	│   │
    │   ├─ data/
    │   │    ├─ constants/
    │   │    │    └─ index.ts
	│   │    │
    │   │    ├─ enums/
    │   │    │    └─ index.ts
	│   │    │
    │   │    ├─ hooks/
    │   │    │   ├─ hook_name/
    │   │    │   │       ├─ index.tsx
    │   │    │   │       ├─ hook_name.hook.tsx
    │   │    │   │       └─ hook_name.hook.test.tsx
	│   │    │   │
    │   │    │   └─ index.ts
	│   │    │
    │   │    ├─ providers/
    │   │    │   ├─ provider_name/
    │   │    │   │      ├─ index.ts
    │   │    │   │      ├─ provider_name.provider.ts
    │   │    │   │      └─ provider_name.provider.test.ts
    │   │    │   │
    │   │    │   └─ index.ts
	│   │    │
    │   │    ├─ services/
    │   │    │   ├─ service_name/
    │   │    │   │      ├─ index.ts
    │   │    │   │      ├─ service_name.service.ts
    │   │    │   │      └─ provider_name.service.test.ts
    │   │    │   │
    │   │    │   └─ index.ts
	│   │    │
    │   │    ├─ stores/
    │   │    │   ├─ store_name/
    │   │    │   │      ├─ index.ts
    │   │    │   │      ├─ store_name.store.ts
    │   │    │   │      └─ store_name.store.test.ts
    │   │    │   │
    │   │    │   └─ index.ts
	│   │    │
    │   │    ├─ types/
    │   │    │   └─ *.d.ts
	│   │    │
    │   │    └─  utils/
    │   │        ├─ utility_name/
    │   │        │      ├─ index.ts
    │   │        │      ├─ utility_name.utility.ts
    │   │        │      └─ utility_name.utility.test.ts
    │   │        │
    │   │        └─ index.ts
    │   │
    │   ├─ routes/
    │   │    ├─ routes_group_name/
    │   │    │   └─ routes_group_name.routes.tsx
    │   │    │
    │   │    └─ index.tsx
    │   │
    │   ├─ views/
    │   │    ├─ components/
    │   │    │   └─ component_name/
    │   │    │       ├─ index.tsx
    │   │    │       ├─ component_name.component.tsx
    │   │    │       └─ component_name.component.test.tsx
    │   │    │
    │   │    ├─ controllers/
    │   │    │   └─ controller_name/
    │   │    │       ├─ controller_name.controller.ts
    │   │    │       └─ controller_name.controller.test.ts
    │   │    │
    │   │    └─ pages/
    │   │        └─ page_name/
    │   │            ├─ page_name.page.tsx
    │   │            ├─ page_name.controller.ts
    │   │            └─ page_name.controller.test.ts
    │   │
    │   ├─ bindings.ts
    │   ├─ dependencies.ts
    │   ├─ routes.ts
    │   ├─ vite-env.d.ts
    │   └─ index.tsx
    │
    ├─ .env
    ├─ .env.local
    ├─ .env.development
    ├─ .env.development.local
    ├─ .env.production
    ├─ .editorconfig
    ├─ tsconfig.json
    ├─ .gitignore
    ├─ .npmrc
    ├─ index.html
    ├─ package.json
    ├─ yarn.lock
    └─ README.md

#### Keynotes:

- `src/` - Application source code folder.

   - `dependencies.ts` - This file describes all dependencies of the application. Service locator implemented by [InversifyJS](https://github.com/inversify/InversifyJS/tree/master/wiki). All dependencies resolve with help of [TS decorators](https://github.com/inversify/InversifyJS#step-2-declare-dependencies-using-the-injectable--inject-decorators).

   - `assets/` - This folder contains all assets used by application. It could be css, fonts, media files like video, images, etc...

   - `data/` - This folder contains all business layer data. All things that don't relate to the UI part should be inside this folder.

       - `constants/` - This file contains constants those used across the whole app.
       
       - `enums/` - This file contains enums those used across the whole app.
       
       - `hooks` - This folder contains hooks, useful utilities that allow to reuse stateful logic between components. Hooks are created and handled by [React](https://reactjs.org/docs/hooks-intro.html) core functionality.

       - `providers/` - The folder contains data providers. It's a layer that handle the data. If you need to save or get some data from API, DB, JSON you should describe the provider that will do this inside current folder.

       - `services/` - This folder contains classes that provide services. A good example of such service is HTTP client.

       - `stores/` - This folder contains "stores". It's a Model in the (M)VVM pattern. Stores should contain all business logic. In a short word, it's the data and business logic of the application.
       
       - `types/` - This folder contains **global** TS types declarations.
       
       - `utils/` - This folder contains framework-agnostic pieces of code that potentially may be re-used at any JS application.

   - `routers/` - This folder contains routes of the application.

   - `views/` - This folder contains presentation and presentations logic - View layer. All things that related to the UI part, and it's behaviour must be inside this folder.
   
       - `components` - That folder contains it's a minimal UI building blocks that can be reused at other components or pages.
       
       - `controllers` - That folder contains shared or commonly used view models. Each controller(ViewModel) may be used across many Views(components, pages).
     
       - `pages` - That folder contains representations of whole page constructed with components and controllers. Each page commonly have its own view model.

- `configs/` - This folder contains `.env` files under the project's folder. Used only for multi-project repo setup. Normally can be removed or ignored for the standard setup.

- `tools/` - This folder may contain useful scripts for project's build process.  

## Available Scripts
In the project directory, you can run:

#### `yarn start`
Runs the app in the development mode.
Open https://frontend.dev.loc:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `yarn test`
Launches the test runner in the interactive / watch mode.

#### `yarn lint`
Launches the TSLint to checks TypeScript code for
readability, maintainability, and functionality errors.
Normally, you don't need to run this command.
It's used in `pre-commit` hook and will be run automatically on every commit.

#### `yarn typecheck`
Launches the TypeScript Compiler without any output
to checks TypeScript code for a types' correctness.
Normally, you don't need to run this command.
It's used in `pre-commit` hook and will be run automatically on every commit.

#### `yarn coverage`
Launches unit tests and generate folder with coverage data.

## Used core technologies stack

* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [InversifyJS](https://inversify.io/)
* [MobX](https://mobx.js.org/README.html)
* [Emotion](https://emotion.sh/docs/introduction)
* [MUI](https://mui.com/material-ui/getting-started/installation/)
* [React Router](https://reactrouter.com/docs/en/)
* [Vitest](https://vitest.dev/)

## Development workflow

We're following a standard Gitflow workflow, but mostly without feature branches.
If you're not familiar with such workflow, you can read more about it by the following link:
[Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
Commonly we have the following branches:
* `main` - It's a production branch.
* `uat` - It's the main development branch. Ordinarily, all developers work there,
  excerpt rare cases when the task could take too much time. In such case another feature branch could be created.
* `preprod` - It's a pre-release branch. All hot-fixes are should be made here.

## Bypass CORS for API and JSON requests in local development

#### Step 1: Create a `.env.development.local` file in the root of your project.

This file will contain the configuration for local development only.

#### Step 2: Configure Environment Variables

Copy the configuration from the environment you plan to work with and modify the API and JSON paths to be relative. Example content of the `.env.development.local` file:

```env
PUBLIC_URL=https://symfony-boilerplate.us.f2p.media.geniussports.com/
VITE_API_URL=/api/
VITE_JSON_URL=/json/
VITE_CONTENT_JSON_URL=/help_center/
VITE_IMAGES_URL=${PUBLIC_URL}media/image/
VITE_SHARE_URL=${PUBLIC_URL}share/
```

#### Explanation of Variables

- **PUBLIC_URL**: Defines the base URL to which all other paths will be relative. The proxy will forward all requests to this value.
- **VITE_API_URL**: The relative path to the API. For example, if your API endpoint is `/api/`, requests to `https://symfony-boilerplate.us.f2p.media.geniussports.com/api/` will be made through `/api/`.
- **VITE_JSON_URL**: The relative path to JSON data. Requests to JSON files will be made through `/json/`.
- **VITE_CONTENT_JSON_URL**: The relative path to JSON content, such as `/help_center/`.

By following these steps, you can set up a local environment to work with production API and JSON requests while bypassing CORS restrictions. This allows you to work locally with a configuration that closely mirrors the preprod or production environments, ensuring more effective debugging and testing.

More details on how Proxy is configured and works can be found in [Vite documentation](https://vitejs.dev/config/server-options#server-proxy).

## Deployment

This repository is connected to Gitlab CI,
and auto-deploy is configured for the `uat` branch.
It means during development you don't need to worry about the deployment process,
because any commit in `uat` branch will be caught by CI server,
which in turn will run type checks, linting, tests and deploy process in case every
previous steps were successful.

To deploy the app to `production` you need access to [Gitlab CI](https://gitlab.com/geniussports/engage/f2p/),
find the project and run the deployment process manually with just one click.
To get credentials to [Gitlab CI](https://gitlab.com/geniussports/engage/f2p/)
and more info on which pipeline should be launched please ask a person,
who leads the project.

## Troubleshooting and notes

1. During development process you may notice that your ViewModel initialized and destroyed a few times,
and your component rendered twice. Such behaviour related to the React [StrictMode](https://reactjs.org/docs/strict-mode.html) and will appear only during development proccess.
If you're not sure that your code is works as expected you can temporarily remove **React.StrictMode** tag from the root file and test the behaviour.
2. Sometimes it may happen that your code should work properly, but a View doesn't change by any events. 
This may happen because developers are quite often forgot to add `makeAutoObservable(this);` to an observable class 
or forgot to wrapping a React component with the `observer` function. Please check, most probably this is your case.
3. You may face an issue `export 'X' (imported as 'X') was not found in 'some/path' (possible exports: A, B, C)`.
This happens because the Babel can't correctly parse imported types. You should help him by adding `type` notation to your import.
Like `import type { X } from "some/path"` or `import { A, B, type X } from "some/path"`.
4. Sometimes, SVG images used in CSS may disappear after the build process. It happens due to optimizations. Vite paste such images as inline base64 string, and if the sting isn't wrapped with the quote marks, the syntax become invalid. To solve the issue and avoid it, just use the quote marks in the `url("${src}")` notation.

If you get stuck with TypeScript or some library API,
here is a list of links that could be useful and should help in many cases:

* [List of links to libraries used in application](#used-core-technologies-stack)

Also, the following links could be very useful if you're new to TypeScript:

* [TypeScript Deep Dive Book](https://basarat.gitbooks.io/typescript/content/)

#### Pitfalls

- Due to Vite's aggressive tree-shaking during the build process, `_.chain` from Lodash breaks and doesn't work correctly in production builds. It works fine in development mode, but after building and deploying the site, the functionality fails.
- This happens because Vite removes parts of Lodash that it considers "unused," but `_.chain` relies on dynamic method chaining that tree-shaking can't detect properly. As a result, chained calls like `_.chain(array).map(...).filter(...).value()` stop working after deployment.
- To fix this, you either:
  - Avoid using `_.chain` entirely, or
  - Write your own chaining logic
- Relevant issues:
  - Vite: https://github.com/vitejs/vite/issues/11960
  - Lodash: https://github.com/lodash/lodash/issues/3298

---

- Someone might have noticed that Tailwind doesn't always apply to MUI components. Basically, this is related to the fact that some components are rendered through a portal. For example, modals. They can be rendered anywhere, but they will still be displayed at the root of the site.
- The problem can be solved in two ways:
  - Disable the portal by adding the `disablePortal` property.
  - Change the root container for these components so that they are rendered in the root where Tailwind can apply styles, rather than at the root of the site. [GitHub Issue Reference](https://github.com/mui/material-ui/issues/33424#issuecomment-1208870672).

---

- React Virtualized is a one of common library used in our projects, but it isn't work with the Vite. [Here](https://github.com/bvaughn/react-virtualized/issues/1722) you may found a solution on how to solve the issue.  
  
  React Virtualized solution is below, as per https://github.com/bvaughn/react-virtualized/issues/1722#issuecomment-1911672178:<br/>
```   
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized]
        }
    },
})
```

## How to create MVVM pattern from scratch for react app.

1. [Install MobX](https://mobx.js.org/installation.html) with `yarn add mobx mobx-react`
2. [Install InversifyJS](https://mobx.js.org/enabling-decorators.html#how-to-enable-decorator-support) with `yarn add inversify reflect-metadata`
3. Enable TS decorators support by adding/replace `tsconfig.json` file's values to the following:
    ```
        "types": ["reflect-metadata"],
        // https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties
        "useDefineForClassFields": true,
        // https://mobx.js.org/enabling-decorators.html#typescript
        "experimentalDecorators": true,
        "module": "esnext",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "baseUrl": "src",
    ```
   more details here:
   - https://mobx.js.org/enabling-decorators.html#how-to-enable-decorator-support
   - https://github.com/inversify/InversifyJS#-installation
4. Insert `import "reflect-metadata";` at the top of your root application file.
