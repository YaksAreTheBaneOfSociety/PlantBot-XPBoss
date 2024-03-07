const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with list of commands for Plant')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('help section')
				.addChoices(
					{ name: 'commands', value: "commands" },
					{ name: 'murder', value: "murder" },
					{ name: 'secret word', value: "secret" }
				)
				),
	async execute(interaction, xpObject, client) {
		const typeString = interaction.options.getString('type') ?? "commands";		
			if(typeString == "commands"){
			await interaction.reply(`**COMMANDS**\n----------------------------------------------\n/help secret word - displays info on secret word\n/help murder - displays info on murder program\n/level - displays current level and xp of user\n/leaderboard - displays xp leaderboard top 10\n/leaderboardfull - displays full leaderboard\n/secretword - displays info on daily secret word\n/murderoptions - opts in or out of murder program\n/murder - murders victim of the day with chance based on xp spent\n/murderprofile - displays detailed murder stats for a user\n/murderleaderboard - displays most killed users or users who have killed the most\n/todaysvictim - displays today's victim and the number of times they have been murdered today`)
		}else if(typeString == "murder"){
			await interaction.reply(`**MURDER INFO**\n----------------------------------------------\nThe **${interaction.guild.name}™** community murder program was introduced in early 2024 as a way to boost instability and divisiveness in the community. Citizens are encouraged to participate as it will improve their sense of belonging in **${interaction.guild.name}™**. As we like to say around here, \${interaction.guild.catchphrase}!\nTo participate, only a few short steps need be completed.\n1. Agree to and sign the community murder program terms and conditions, which can be found at \`ReferenceError: murderObject.termsandconditions is not defined\`\n2. Opt in using **/murderoptions true**\n3. Enjoy using the vast number of /murder commands now available to you:\n/murder - murders victim of the day with chance based on xp spent\n/murderprofile - displays detailed murder stats for a user\n/murderleaderboard - displays most killed users or users who have killed the most\n/todaysvictim - displays today's victim and the number of times they have been murdered today`)
		}else if(typeString == "secret"){
			await interaction.reply(`**WHAT IS THE SECRET WORD????**\n----------------------------------------------\nThe secret word function is a highly classified algorithm that takes a deep analysis of the day's messages, and finds the word that would most effectively supplement meaningful conversation. The first person to say this word will be awarded a lottery equivalent to 25 messages worth of XP, multiplied by the current streak. Each day the secret word is found will increase the streak. Failing to find the secret word on a given day will reset the streak.\nThe secret word function also finds the word with the highest possibility of leading to total societal collapse if overused. This word, the **ILLEGAL WORD**, will not be tolerated, and anyone who says it will be fined 5 messages worth of XP, multiplied by the current streak. In order to prevent potential weaponization of this word by learning it, the program will not inform the user that they have used the word immediately, but will instead wait a small interval first.`)
		}
	},
};