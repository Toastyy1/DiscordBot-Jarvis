const Discord = require('discord.js');
const client = new Discord.Client();

const { token, commandHandler, eventHandler } = require('./config.json');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

[commandHandler, eventHandler].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
});

client.login(token);