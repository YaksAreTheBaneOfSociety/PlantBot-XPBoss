const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('secretword')
		.setDescription('Replies with daily secret word info, or user\'s secret word profile if user specified')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to fetch secret word profile for')),
	async execute(interaction, xpObject, client) {
		const targetuser = interaction.options.getUser('user') ?? "none";
		let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
		let randomWord = JSON.parse(randomWordData) // turns json into js
		if(targetuser == "none"){
			let half0 = `Yesterday's illegal word was **${randomWord[3].word}**.`
			half0 = half0.concat("\n", `Today's illegal word has been used **${randomWord[2].count}** times.`)
			let half1 = ""
			let half2 = ""
			if(randomWord[1].found == false){
				half1 = (`Yesterday's secret word was **${randomWord[1].word}**. It was **NOT** found.`)
			}else{
				half1 = (`Yesterday's secret word was **${randomWord[1].word}**. It was found by ${randomWord[1].foundBy}.`)
			}
			if(randomWord[0].found == false){
				half2 = (`Today's secret word has been used **${randomWord[0].count}** times. Today's secret word has **NOT** been found`)
			}else{
				half2 = (`Today's secret word has been found by ${randomWord[0].foundBy}. Today's secret word was **${randomWord[0].word}**.`)
			}
			await interaction.reply(half0.concat("\n", half1.concat("\n", half2.concat("\n", `Current streak: ${randomWord[4]} days.`))))
		}else{
			let userIndex = randomWord[5].findIndex(element => element.id === targetuser.id)
			if(userIndex==-1){
				interaction.reply(`${targetuser.username} has found the secret word **0** times.\n${targetuser.username} has said illegal words **0** times.`)
			}else{
				interaction.reply(`${targetuser.username} has found the secret word **${randomWord[5][userIndex].secret}** times.\n${targetuser.username} has said illegal words **${randomWord[5][userIndex].illegal}** times.`)
			}
		}
	},
};