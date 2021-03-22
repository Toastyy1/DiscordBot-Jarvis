const Discord = require('discord.js');
const client = new Discord.Client();

const { token, commandHandler, eventHandler } = require('./config.json');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();


[commandHandler, eventHandler].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
});

client.login(token);

// For server deployment

// [process.env.COMMANDHANDLER, process.env.EVENTHANDLER].forEach(handler => {
// 	require(`./handlers/${handler}`)(client, Discord);
// });

// client.login(process.env.DJS_TOKEN);