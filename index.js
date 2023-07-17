#!/usr/bin/env node

import chalk from "chalk";
import inquirer from 'inquirer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { exec } from "child_process";

const log = console.log;
const defaultPath = path.join(os.homedir(), 'Documents');
const installationPath = path.join(defaultPath, 'workflow')

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
        'Qwik'
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
      ],
    });
  }

  log(chalk.yellow(`You chose ${answer.front || answer.back}`));
  return answer.front || answer.back;
}

async function createCommand(projectPath, choosenLangage, workDir) {
  const createAppPromise = new Promise((resolve, reject) => {
    exec(`npm create vite@latest ${workDir.directory} -- --template ${choosenLangage.toLowerCase()}`,
    { cwd: installationPath, shell: true },
    (error, stdout, stdeer) => {
      if (error) {
        console.error(`An error occurred while creating the React project: ${error.message}`);
        reject(error);
        return;
      }
    })
    resolve()
  })
}
async function createProject() {

  if (!fs.existsSync(installationPath)) {
    fs.mkdirSync(installationPath);
    console.log(`Le dossier ${installationPath} a été créé.`);
  }
  const choosenLangage = await langage()

  const workDir = await inquirer.prompt({
    name: 'directory',
    type: 'input',
    message: 'Enter a directory name for your project:',
  });
  log(`Creating a new ${choosenLangage} project in directory ${workDir.directory}`);

  const projectPath = path.join(installationPath, workDir.directory)
  createCommand(projectPath, choosenLangage, workDir)

}


createProject().catch(err => {
  console.error(err);
  process.exit(1);
});
