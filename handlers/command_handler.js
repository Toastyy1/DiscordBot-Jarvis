const fs = require('fs');
const path = require('path');
const { rootDir } = require('../config.json');

module.exports = (client, Discord) => {
	const fileArray = [];

	const readCommands = (dir) => {

		// TODO: Find a better solution to determine the project folder
		const __dirname = rootDir;

		// Read out all command files
		const files = fs.readdirSync(path.join(__dirname, dir));

		// Loop through all the files in ./commands
		for (const file of files) {
			// Get the status of 'file' (is it a file or directory?)
			const stat = fs.lstatSync(path.join(__dirname, dir, file));

			// If the 'file' is a directory, call the 'readCommands' function
			// again with the path of the subdirectory
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			}
			else {
				const fileDir = dir.replace('\\', '/');
				fileArray.push(fileDir + '/' + file);
				// fs.readdirSync(dir).filter(cmdFile => cmdFile.endsWith('.js'));
			}
		}
	};


	readCommands('commands');

	for(const file of fileArray) {
		const command = require(`../${file}`);

		if(command.name) {
			client.commands.set(command.name, command);
		}
		else {
			continue;
		}
	}
};