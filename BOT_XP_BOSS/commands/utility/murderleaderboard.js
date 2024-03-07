const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('murderleaderboard')
		.setDescription('Replies with murder leaderboard!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('kills or deaths leaderboard')
				.setRequired(true)
				.addChoices(
					{ name: 'kills', value: "Murders" },
					{ name: 'deaths', value: "Times Murdered" }
				)
				),
	async execute(interaction, xpObject, client) {
		let usersData = fs.readFileSync("murder.json") // reads the json file
		let murderObjects = JSON.parse(usersData)[0] // turns json into js
		const commandType = interaction.options.getString('type');
		// Sorting function
		function compareKills(a, b) {
			if ((a.kills) !== (b.kills)) {
				return (b.kills) - (a.kills); // Sort by kills and self defense kills descending
			}
		}
		function compareDeaths(a, b) {
			if ((b.murderDeaths) !== (a.murderDeaths)) {
				return (b.murderDeaths) - (a.murderDeaths); // Sort by kills and self defense kills descending
			}
		}
		// Sort objects array based on 'level' and 'xp'
		if(commandType == "Murders"){
			murderObjects.sort(compareKills);
			const topTen = murderObjects.map((obj, index) => `#${index + 1} • ${obj.username} • ${commandType}: ${obj.kills}`);
			const topTenFormatted = topTen.join('\n')
			await interaction.reply("**"+ interaction.guild.name +"'s murder leaderboard**\n" + topTenFormatted)
		}else if(commandType == "Times Murdered"){
			murderObjects.sort(compareDeaths);
			const topTen = murderObjects.map((obj, index) => `#${index + 1} • ${obj.username} • ${commandType}: ${obj.murderDeaths}`);
			const topTenFormatted = topTen.join('\n')
			await interaction.reply("**"+ interaction.guild.name +"'s murder leaderboard**\n" + topTenFormatted)
		}
	},
};