#!/usr/bin/env node

import chalk from "chalk";
import inquirer from 'inquirer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { exec } from "child_process";
import {
  createAngular,
  createExpress,
  createNestJS,
  createPython,
  createDjango,
  createNext,
  createNuxt,
  createJavaFile
} from "./filemaker.js";
import ora from 'ora';
import { Command } from "commander";
//import Configstore from "configstore";

const log = console.log;
const defaultPath = path.join(os.homedir(), 'Documents');
const installationPath = path.join(defaultPath, 'workflow');
let packageManager;

async function welcome() {
  log(chalk.green('You want to create a new development project!'));

  const answer = await inquirer.prompt({
    name: 'specialty',
    type: 'list',
    message: 'Choose a specialty between these choices: \n',
    choices: [
      'Frontend',
      'Backend'
    ],
  });

  return answer.specialty;
}

async function langage() {
  const specialty = await welcome();
  log(chalk.yellow(`You chose ${specialty}`));

  let answer;
  if (specialty === 'Frontend') {
    answer = await inquirer.prompt({
      name: 'front',
      type: 'list',
      message: 'Select a language/framework:\n',
      choices: [
        'React',
        'Vue',
        'Angular',
        'Preact',
        'Lit',
        'Svelte',
        'Solid',
        'Qwik',
        'NextJs',
        'NuxtJs'
      ],
    });
  } else if (specialty === 'Backend') {
    answer = await inquirer.prompt({
      name: 'back',
      type: 'list',
      message: 'Select a backend language/framework:\n',
      choices: [
        'Express',
        'Nestjs',
        'Python',
        'Django',
        'Java'
      ],
    });
  }

  log(chalk.yellow(`You chose ${answer.front || answer.back}`));
  return answer.front || answer.back;
}



async function createCommand(projectPath, chosenLanguage, workDir, packageManager) {
  const program = new Command()
  program.option('-p, --package-manager <packageManager>', 'Specify the package manager (npm, yarn, pnpm)');
  program.parse(process.argv);
  packageManager = program.packageManager || program.opts().packageManager || 'npm';
  //console.log(program)
  //console.log(packageManager)
  let commandToExec;

  switch (packageManager) {
    case 'npm':
      commandToExec = `npm create vite@latest ${workDir.directory} -- --template ${chosenLanguage.toLowerCase()}`;
      break;
    case 'yarn':
      commandToExec = `yarn create vite ${workDir.directory} --template ${chosenLanguage.toLowerCase()}`;
      break;
    case 'pnpm':
      commandToExec = `pnpm create vite ${workDir.directory} --template ${chosenLanguage.toLowerCase()}`;
      break;
    default:
      console.error(`Invalid package manager: ${packageManager}`);
      return;
  }
  const createAppPromise = new Promise((resolve, reject) => {
    const spinner = ora(`Creating ${chosenLanguage} project...`).start();
    exec(commandToExec, { cwd: installationPath, shell: true },
      (error, stdout, stderr) => {
        if (error) {
          spinner.fail(`An error occurred while creating the ${chosenLanguage} project: ${error.message}`);
          reject(error);
        } else {
          spinner.succeed(`${chosenLanguage} project created successfully \n Vous avez utilisé: ${packageManager}`);
          resolve();
        }
      }
    );
  });

  createAppPromise
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

async function createProject() {
  if (!fs.existsSync(installationPath)) {
    fs.mkdirSync(installationPath);
    console.log(`Le dossier ${installationPath} a été créé.`);
  }
  const chosenLanguage = await langage();

  const workDir = await inquirer.prompt({
    name: 'directory',
    type: 'input',
    message: 'Enter a directory name for your project:',
  });
  log(`Creating a new ${chosenLanguage} project in directory ${workDir.directory}`);

  const projectPath = path.join(installationPath, workDir.directory);
  if (chosenLanguage === 'Angular') {
    await createAngular(installationPath, workDir.directory, projectPath);
  } else if (chosenLanguage === 'Express') {
    await createExpress(workDir.directory, projectPath)
  } else if (chosenLanguage === 'Nestjs') {
    await createNestJS(installationPath, workDir.directory, projectPath)
  } else if (chosenLanguage === 'Python') {
    await createPython(installationPath, workDir.directory, projectPath)
  } else if (chosenLanguage === 'Django') {
    await createDjango(projectPath)
  } else if (chosenLanguage === 'NextJs') {
    await createNext(projectPath, packageManager, installationPath)
  } else if (chosenLanguage === 'NuxtJs') {
    await createNuxt(projectPath, packageManager, installationPath)
  } else if (chosenLanguage === 'Java') {
    await createJavaFile(workDir.directory, projectPath)
  } else {
    await createCommand(projectPath, chosenLanguage, workDir);
  }

}


createProject().catch(err => {
  console.error(err);
  process.exit(1);
});
