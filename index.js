#!/usr/bin/env node

import chalk from "chalk";
import inquirer from 'inquirer';

const log = console.log;

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
}

langage().catch(err => {
  console.error(err);
  process.exit(1);
});
