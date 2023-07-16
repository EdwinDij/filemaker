import { exec } from 'node:child_process'
import inquirer from 'inquirer'
import path from 'path';
import ora from 'ora';



async function createReact(workDir, defaultPath, choosenLangage) {
    const spinner = ora().start();
    const projectPath = path.join(defaultPath, workDir);

    const createReactAppPromise = new Promise((resolve, reject) => {
        exec(`npx create-react-app ${projectPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`An error occurred while creating the React project: ${error.message}`);
                reject(error);
                return;
            }
            spinner.succeed(`Successfully created ${choosenLangage} project`)
            resolve();
        });
    });
    createReactAppPromise.then(() => {
        exec(`code ${projectPath}`, (vscodeError, vscodeStdout, vscodeStderr) => {
            if (vscodeError) {
                spinner.fail(`Failed to open Visual Studio Code with the ${choosenLangage} project`);
                console.error(`An error occurred while opening Visual Studio Code: ${vscodeError.message}`);
                return;
            }
            spinner.succeed(`Visual Studio Code opened with the ${choosenLangage} project at ${projectPath}`);
        });
    }).catch((error) => {
        // Gérer les erreurs de la création du projet React
        console.error(`Error while creating the React project: ${error.message}`);
    });
};

export default createReact;