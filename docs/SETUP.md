# Project setup checklist
1) Configure `.gitlab-ci.yml` [project's settings at Gitlab](https://geniussports.atlassian.net/wiki/spaces/FHTECH/pages/4205546356/GitLab+CI+CD+Setup) by following all steps. If you want to create multi-project repo, please refer the [MULTI_PROJECT_SETUP.md](./MULTI_PROJECT_SETUP.md) of how to setup project. 
2) Update `.env` files with correct values provided by BE. Pay attention on `PUBLIC_URL` for development and production.
3) Configure Sentry. More info: [Sentry configuration](https://geniussports.atlassian.net/wiki/spaces/FHTECH/pages/4205548463/Sentry#Configuration). 
4) Update the `name` at `package.json` file.
5) If your project has uncommon approach, please update README.md and/or CONTRIBUTING.md files.

*NOTE*: if you're not able to do all steps during the project setup, feel free to delete finished steps (with `~~` symbols, like ~~example~~) and back to unfinished later. It will give a clear vision of what was done for the rest developers.