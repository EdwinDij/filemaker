import { exec, execSync } from 'child_process';
import ora from 'ora';
import path from 'path';
import fs from "fs"

export async function createAngular(installationPath, workDir, projectPath) {
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

export async function createExpress(workDir, projectPath) {
    const createExpressPromise = new Promise((resolve, reject) => {
        const spinner = ora(`Creating express project...`).start();

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
            console.log(`Dossier ${workDir} crée.`);
        }

        process.chdir(projectPath);
        exec(
            'npm init -y',
            { shell: true },
            (error, stdout, stderr) => {
                if (error) {
                    spinner.fail(`An error occurred while creating the express project: ${error.message}`);
                    reject(error);
                } else {
                    spinner.succeed('npm init -y');
                    resolve();
                }
            }
        );
    });

    createExpressPromise
        .then(() => {
            const spinner = ora('Installation des packages...').start();
            createFileExpress(projectPath);
            return new Promise((resolve, reject) => {
                process.chdir(projectPath);
                exec(
                    'npm install express cors dotenv',
                    { shell: true },
                    (error, stdout, stderr) => {
                        if (error) {
                            spinner.fail(`An error occurred while installing all the packages: ${error.message}`);
                            reject(error);
                        } else {
                            spinner.succeed('npm install');
                            resolve();
                        }
                    }
                );
            });
        })
}

function createFileExpress(projectPath) {
    const code = `// Les paramètres ci-dessous sont installés et configurés par défaut
  
  const express = require('express');
  const app = express();
  const cors = require('cors');
  require('dotenv').config();
  const port = process.env.PORT || 3000; // N'hésitez pas à la modifier
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    console.log('Serveur connecté sur le port: ' + port);
  });
  
  module.exports = app;`;

    fs.writeFileSync(path.join(projectPath, 'index.js'), code, { encoding: 'utf-8' });

    fs.writeFileSync(path.join(projectPath, '.env'), 'PORT = 3000');

    fs.writeFileSync(path.join(projectPath, '.gitignore'), '.env\nnode_modules');

    console.log('Ouverture du fichier index.js et installation des packages.');
    process.chdir(projectPath);
    execSync('code .');
    updatePackageJson(projectPath)
}

function updatePackageJson(projectPath) {
    const packageJsonPath = path.join(projectPath, 'package.json');

    fs.readFile(packageJsonPath, 'utf8', (error, data) => {
        if (error) {
            console.error(`An error occurred while reading package.json: ${error}`);
            return;
        }

        const packageJson = JSON.parse(data);

        if (!packageJson.scripts || !packageJson.scripts.start) {
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.start = 'nodemon index.js';

            fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8', (error) => {
                if (error) {
                    console.error(`An error occurred while writing package.json: ${error}`);
                    return;
                }
                console.log('package.json modified');
            });
        }
    });
}

export async function createNestJS(installationPath, workDir, projectPath) {
    const installNestJSPromise = new Promise((resolve, reject) => {
        const spinner = ora('Installing NestJS CLI...').start();
        exec(`npm install -g @nestjs/cli`, (error, stdout, stderr) => {
            if (error) {
                spinner.fail(`An error occurred while installing the NestJS CLI: ${error.message}`);
                reject(error);
            } else {
                spinner.succeed('NestJS CLI installed successfully');
                resolve();
            }
        });
    });

    installNestJSPromise
        .then(() => {
            const spinner = ora('Creating NestJS project...').start();
            return new Promise((resolve, reject) => {
                process.chdir(installationPath)
                exec(
                    `nest new ${path.basename(workDir)} -p npm`,
                    { shell: true, cwd: installationPath },
                    (error, stdout, stderr) => {
                        if (error) {
                            spinner.fail(`An error occurred while creating the NestJS project: ${error.message}`);
                            reject(error);
                        } else {
                            spinner.succeed(`NestJS project created successfully at: ${projectPath}`);
                            resolve();
                        }
                    }
                );
            });
        })
        .then(() => {
            const spinner = ora('Opening project in the editor...').start();
            exec(
                'code .',
                { shell: true, cwd: projectPath },
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

export async function createPython(installationPath, workDir, projectPath) {


    const code = `##Les paramètres ci-dessous sont installés et configurés par défaut
def hello_world():
    print("Hello, World!")

hello_world()

def calculate_sum(a, b):
    return a + b

def greet(name):
    print(f"Hello, {name}!")

result = calculate_sum(5, 3)
print("Sum:", result)

greet("Alice")
`

if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
    console.log(`Dossier ${workDir} crée.`);
}


process.chdir(projectPath);
fs.writeFileSync(path.join(projectPath, 'main.py'), code, {encoding: 'utf-8'});

console.log('Ouverture du fichier index.js et installation des packages.');
execSync('code .');
}