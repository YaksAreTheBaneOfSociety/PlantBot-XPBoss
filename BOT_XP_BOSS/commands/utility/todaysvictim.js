const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('todaysvictim')
		.setDescription('information on victim of the day'),
	async execute(interaction, xpObject, client) {
		let usersData = fs.readFileSync("murder.json") // reads the json file
		let victim = JSON.parse(usersData)[2]
		interaction.reply(`Today's victim is **${victim.username}**. They have been murdered **${victim.timesMurdered}** times.`)
	},
};