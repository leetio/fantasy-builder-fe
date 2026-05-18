# Downstream Pipelines with Project-specific Configurations

This documentation provides step-by-step instructions on how to set up a GitLab pipeline configuration that utilizes downstream pipelines for individual projects. The configuration allows for splitting the build processes and deploying the projects to different S3 buckets or the same bucket but different folders.

## Setup steps

1. **Rename Files**
   - Remove `.gitlab-ci.yml` from the root.
   - Copy the files `docs/gitlab-config/.gitlab-ci.yml` and `docs/gitlab-config/.gitlab-ci-pipeline-part.yml` to the project's root folder.
   - In order to properly run tests, each project requires environment configuration files (`.env`). Therefore, it's necessary to execute the configuration selection script before the test phase.
        ```
        Lint, Typecheck, Test:
            stage: test
            extends: .install-packages-before
            script:
            - node tools/choose_app.mjs -p PROJECT_ONE
            - !reference [.tasks, lint]
            interruptible: true
        ```
     `PROJECT_ONE` should be replaced with the name of the directory containing the environment configuration files for the corresponding project. (`.gitlab-ci.yml` file) 
   
     If all projects need to be tested (i.e., not just one specific project), then this stage should be moved to the `.gitlab-ci-pipeline-part.yml` file, so that it can be included dynamically for each project in the pipeline. Don't forget to remove `test` stage from `stages:` section:
        ```
        stages:
          - build
        ```

2. **Configure Variables**
   - Open the `.gitlab-ci.yml` file and update the following variables according to your project's requirements:
      - `PROJECT_NAME`: The name of your project. It should be equal to a folder name in the `configs` folder. More below.
      - `S3_BUCKET_DEPLOY_FOLDER`: The folder in the S3 bucket where you want to deploy the project.
      - `AWS_S3_BUCKET`: The name of your AWS S3 bucket.
      - `CDN_DISTRIBUTION_ID`: The ID of the CDN distribution associated with your project.
      - `SITE_URL`: The URL of your project's website.
   - Additionally, update the pipeline names "_PROJECT ONE_" and "_PROJECT TWO_" to reflect the names of your specific projects.

3. **Create Project-specific Configuration Folders**
   - In the root directory of your repository, create a `configs` folder.
   - For each project, create a folder inside the `configs` folder with the name matching the `PROJECT_NAME` variable specified in the `.gitlab-ci.yml` file.
   - Inside each project folder, copy and paste the respective `.env` configuration files from the repository's root directory.
   - Once the files are copied, remove the original `.env` files from the repository's root directory.
   - Make sure that each project's folder under `configs` contains all the required `.env` configuration files.

4. **Update `.gitignore`**
   - Open the `.gitignore` file in your repository and add the following lines to ignore the project-specific `.env` configuration files:
     ```
     .env
     .env.development
     .env.preprod
     .env.production
     ```
   - This prevents conflicts during merges, as the configuration files will be copied from the `configs` folder during the development process.

5. **Update the `start` Script in `package.json`**
   - Open the `package.json` file in your repository and locate the `"start"` script.
   - Update the script to include the following line instead of the existing command:
     ```json
     "start": "node tools/choose_app.mjs && yarn vite",
     ```
   - This modification enables you to select the project and environment you want to work with locally.

### Verify and Monitor the Pipelines

From now on, whenever a push event occurs in your repository, GitLab will trigger the pipeline.

You can monitor the progress and status of the pipelines by navigating to the CI/CD section of your repository in GitLab. Here, you can view the test stage and individual downstream pipelines for each project.

Pipelines for the `uat` and `preprod` environments will run automatically. For the production environment, only the test stage will run automatically, while downstream pipelines for each project need to be triggered manually.

Make sure to review the pipelines' output and status to ensure that each project is built and deployed correctly.

