import { exec } from 'child_process';
import ora from 'ora';
import path from 'path';

export default async function createAngular(installationPath, workDir, projectPath) {
    const installAngularCli = new Promise((resolve, reject) => {
        const spinner = ora('Installing Angular CLI...').start();
        exec(`npm install -g @angular/cli`, (error, stdout, stderr) => {
            if (error) {
                spinner.fail(`An error occurred while installing the Angular CLI: ${error.message}`);
                reject(error);
            } else {
                spinner.succeed('Angular CLI installed successfully');
                resolve();
            }
        });
    });

    installAngularCli
        .then(() => {
            const spinner = ora('Creating Angular project...').start();
            process.chdir(installationPath);
            return new Promise((resolve, reject) => {
                exec(`ng new ${path.basename(workDir)} --style scss --routing=true`,
                    { shell: true, cwd: installationPath },
                    (error, stdout, stderr) => {
                        if (error) {
                            spinner.fail(`An error occurred while creating the Angular project: ${error.message}`);
                            reject(error);
                        } else {
                            spinner.succeed('Angular project created successfully');
                            //console.log("workdir:", workDir, "instal path: ",installationPath)
                            resolve();
                        }
                    });
            });
        })
        .then(() => {
            const spinner = ora('Opening project in the editor...').start();
            const projectPathStr = String(projectPath)
            exec(
                'code .',
                { shell: true, cwd: workDir },
                (error, stdout, stderr) => {
                    if (error) {
                        spinner.fail(`An error occurred while opening the project in the editor: ${error.message}`);
                    } else {
                        spinner.succeed('Project opened in the editor');
                    }
                }
            );
        })
        .catch((error) => {
            console.error(`An error occurred: ${error.message}`);
        });
}
