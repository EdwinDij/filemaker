import excec, { exec } from 'node:child_process'
import inquirer from 'inquirer'
import path from 'path';
import { stderr, stdout } from 'node:process';


async function createReact(workDir, defaultPath) {

    const projectPath = path.join(defaultPath, workDir);

    exec(`npx create-react-app ${projectPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`An error occurred while creating the React project: ${error.message}`);
            return;
          }
      
          console.log(`Successfully created the React project at ${projectPath}`);
    });
};

export default createReact;