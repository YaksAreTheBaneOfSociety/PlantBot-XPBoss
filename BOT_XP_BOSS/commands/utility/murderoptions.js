const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	cooldown: 604800,
	data: new SlashCommandBuilder()
		.setName('murderoptions')
		.setDescription('opts in or out to the daily murder')
		.addBooleanOption(option =>
			option.setName('in')
				.setDescription('opt in or out')
				.setRequired(true)
				),
	async execute(interaction, xpObject, client) {
		let usersData = fs.readFileSync("murder.json") // reads the json file
		const targetuser = interaction.user.id;
		const inOut = interaction.options.getBoolean('in')
		let inUsers = JSON.parse(usersData)[0] // turns json into js
		let exemptUsers = JSON.parse(usersData)[1] // turns json into js
		let victim = JSON.parse(usersData)[2]
		if(victim.id == targetuser){
			await interaction.reply(`You cannot remove murder eligibility while being the day's victim. try again tomorrow`)
		}else if(exemptUsers.includes(targetuser)){
			await interaction.reply(`As you are a timeout exempt user, you may not change your murder eligibility status. I apologize for any inconvenience. Watch your back.`)
		}else{
			let userIndex = inUsers.findIndex(element => element.id === targetuser)
			if(userIndex == -1){
				if(inOut){
					let usertoadd = {
						id: targetuser,
						username: targetuser.username,
						banned: 0,
						kills: 0,
						selfDefense: 0,
						murderDeaths: 0,
						failDeaths: 0,
						timesInjured: 0,
						xpSpent: 0,
						xpEarned: 0
					}
					inUsers.push(usertoadd)
					await interaction.reply(`You have opted in to the murder program. Watch your back and happy hunting.`)
				}else{
					await interaction.reply(`You have already opted out of the murder program. Good to know someone out there isn't a bloodthirsty psycho.`)
			
				}
			}else{
				if(inOut){
					await interaction.reply(`You have already opted in to the murder program. Watch your back.`)
				}else{
					if(inUsers[userIndex].banned == targetuser){
						await interaction.reply(`You cannot remove murder eligibility while banned.`)
					}else{
						inUsers.splice(userIndex,1)
						await interaction.reply(`You have opted out of the murder program. Coward.`)
					}
				}
			}
		}
		let jsonMurder = JSON.stringify([inUsers,exemptUsers,victim]) // turns js back into json
		fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
	},
};