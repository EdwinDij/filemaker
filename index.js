#!/usr/bin/env node

import chalk from "chalk";
import inquirer from 'inquirer';

const log = console.log

async function welcome() {
    log(chalk.green('You want to create a new developpement project!'))
    const answer = await inquirer.prompt({
        name: 'speciality',
        type: 'list',
        message: 'Choose a spéciality between theses choices: \n',
        choices: [
            'Frontend',
            'Backend'
        ],
    });
    return answer.speciality;
}

async function choices() {
    const speciality = await welcome();
    log(chalk.yellow(`You choose ${speciality}`));

}

choices().catch(err => {
    console.error(err);
    process.exit(1);
})