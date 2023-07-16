#!/usr/bin/env node

import chalk from "chalk";
import inquirer from 'inquirer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import createReact from "./filemaker.js";

const log = console.log;
const defaultPath = path.join(os.homedir(), 'Documents');

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


async function createProject() {
  const installationPath = path.join(defaultPath, 'workflow');
  
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

  if (choosenLangage === 'React') {
    await createReact(workDir.directory, installationPath, choosenLangage)
  } else if(choosenLangage === 'Angular') {
    await createVue(workDir.directory, installationPath, choosenLangage)
  }
}


createProject().catch(err => {
  console.error(err);
  process.exit(1);
});
