const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('murderprofile')
		.setDescription('Replies with level of selected user, or user who initiated command if none selected')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to fetch murder profile of')),
	async execute(interaction, xpObject, client) {
		let usersData = fs.readFileSync("murder.json") // reads the json file
		let murderObjects = JSON.parse(usersData)[0] // turns json into js
		const targetuser = interaction.options.getUser('user') ?? interaction.user;
		let murderIndex = murderObjects.findIndex(element => element.id === targetuser.id)
		if(murderIndex == -1){
			await interaction.reply(`**${targetuser.username}** is not in the murder program`)
		}else{
			let userMurder = murderObjects[murderIndex]
			/*
																																																								kills: 0,
																																																								selfDefense: 0,
																																																								murderDeaths: 0,
																																																								failDeaths: 0,
																																																								timesInjured: 0,
																																																								xpSpent: 0,
																																																								xpEarned: 0
			*/
			await interaction.reply(`**${targetuser.username}**\n----------------------------------------------\nMurders: ${userMurder.kills}\nSelf Defense Kills: ${userMurder.selfDefense}\nTimes Murdered: ${userMurder.murderDeaths}\nFailed Murders: ${userMurder.failDeaths}\nTimes Injured: ${userMurder.timesInjured}\nXP Spent on Murders: ${userMurder.xpSpent}\nXP Earned in Insurance Payouts: ${userMurder.xpEarned}`)
		}
	},
};