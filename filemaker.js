import { exec } from 'node:child_process'
import inquirer from 'inquirer'
import path from 'path';
import ora from 'ora';

export default async function createAngular(){
    const createAppAngular = new Promise((resolve, reject) => {
        exec(`npm install -g @angular/cli`,(error, stdout, stdeer) => {
            if (error) {
                console.error(`An error occurred while creating the Angular project: ${error.message}`);
                reject(error);
                return;
              }
        })
        resolve()
    })
    
}
