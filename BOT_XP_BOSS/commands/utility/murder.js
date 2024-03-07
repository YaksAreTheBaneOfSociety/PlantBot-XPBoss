const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
let rolesLevels = [
	{
		'role': '1182169777825927178',
		'level': 1
	},
	{
		'role': '1182169821429907456',
		'level': 5
	},
	{
		'role': '1182169863821725727',
		'level': 10
	},
	{
		'role': '1182169907425718303',
		'level': 25
	},
	{
		'role': '1182169962899587153',
		'level': 50
	},
	{
		'role': '1182170032864755722',
		'level': 69
	},
	{
		'role': '1182170091450798151',
		'level': 75
	},
	{
		'role': '1182166525386432642',
		'level': 100
	},
	{
		'role': '1182169175779709008',
		'level': 600
	},
]
function levelUpCheck(xpObject,xpIndex,targetuser,client){
	let guild = client.guilds.cache.get('1089262275036201090');
	let targetmember = guild.members.cache.get(targetuser.id);
	let xpNeeded = 75
	let i = 0
	while(xpObject[xpIndex].xp > xpNeeded) {
		i++
		xpNeeded+=75+100*i
	}
	if(i == xpObject[xpIndex].level){
		return
	}
	xpObject[xpIndex].level=i
	let roleIndex = rolesLevels.findIndex(element => element.level === xpObject[xpIndex].level)
	let addedRolesString = ``
	for (let i = 0; i < rolesLevels.length; i++) {
		if (xpObject[xpIndex].level >= rolesLevels[i].level && !targetmember.roles.cache.has(rolesLevels[i].role)){
			targetmember.roles.add(rolesLevels[i].role)
			addedRolesString=addedRolesString.concat(` and earned the <@&${rolesLevels[i].role}> role`)
		}
	}
	client.channels.cache.get('1182165246870310984').send(`<@${targetuser.id}> has reached level **${xpObject[xpIndex].level}**${addedRolesString}`)

}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('murder')
		.setDescription('murders the victim of the day (or you, if you aren\'t careful')
		.addIntegerOption(option =>
			option.setName('xp')
				.setDescription('xp to spend on your murder attempt. 1xp = 0.25% chance to successfully murder')
				.setRequired(true)
				.addChoices(
					{ name: '100: ~22%', value: 100 },
					{ name: '250: ~47%', value: 250 },
					{ name: '500: ~71%', value: 500 },
					{ name: '1000: ~92%', value: 1000 }
				)
				),
	async execute(interaction, xpObject, client) {
		let usersData = fs.readFileSync("murder.json") // reads the json file
		const xpAmount = interaction.options.getInteger('xp');
		const perpentrator = interaction.user;
		let inUsers = JSON.parse(usersData)[0] // turns json into js
		let exemptUsers = JSON.parse(usersData)[1] // turns json into js
		let victim = JSON.parse(usersData)[2]
		let successful = 0
		let murdered = ""
		let guild = client.guilds.cache.get('1089262275036201090')
		xpIndex = xpObject.findIndex(element => element.id === perpentrator.id)
		if(xpIndex == -1){
			let userxp = {
				id: perpentrator.id,
				username: perpentrator.username,
				xp: 0,
				level: 0,
				timeout: false
			}
			xpObject.push(userxp)
			xpIndex = xpObject.findIndex(element => element.id === perpentrator.id)
		}
		perpUserIndex = inUsers.findIndex(element => element.id === perpentrator.id)
		victimUserIndex = inUsers.findIndex(element => element.id === victim.id)
		if(inUsers[perpUserIndex].banned == 1 || inUsers[perpUserIndex].banned == 2){
			interaction.reply(`You cannot murder while being dead or injured`)
		}else if(victim.id == perpentrator.id){
			interaction.reply(`You cannot murder yourself`)
		}else if(xpIndex == -1){
			interaction.reply(`You cannot murder unless you are in the murder program. Try /murderoptions to opt in.`)
		}else if(inUsers[victimUserIndex].banned == 2 || inUsers[victimUserIndex].banned == 1){
			interaction.reply(`${victim.username} has recently been murdered or injured`)
		}else if(xpObject[xpIndex].xp < xpAmount){
			interaction.reply(`You don't have enough XP for that murder plot`)
		}else{
			for (let i = 0; i < xpAmount; i++) {
				if(Math.random() < 0.0025){
					successful = 2
				}
				if(successful == 0){
					if(Math.random() < 0.005){
						successful = 1
					}
				}
			}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			xpIndex = xpObject.findIndex(element => element.id === perpentrator.id)
			if(xpIndex == -1){
				let userxp = {
					id: perpentrator.id,
					username: perpentrator.username,
					xp: 0,
					level: 0,
					timeout: false
				}
				xpObject.push(userxp)
				xpIndex = xpObject.findIndex(element => element.id === perpentrator.id)
			}
			xpObject[xpIndex].xp -= xpAmount
			inUsers[perpUserIndex].xpSpent+=xpAmount
			client.channels.cache.get('1182165246870310984').send(`${perpentrator.username} spent ${xpAmount} XP on a murder plot against ${victim.username}`)
			levelUpCheck(xpObject,xpIndex,perpentrator,client)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			xpIndex = xpObject.findIndex(element => element.id === victim.id)
			if(xpIndex == -1){
				let userxp = {
					id: victim.id,
					username: victim.username,
					xp: 0,
					level: 0,
					timeout: false
				}
				xpObject.push(userxp)
				xpIndex = xpObject.findIndex(element => element.id === victim.id)
			}
			if(successful == 1){
				let xpInsurance = Math.floor(xpAmount*0.1*Math.random())
				xpObject[xpIndex].xp += xpInsurance
				inUsers[victimUserIndex].xpEarned+=xpInsurance
				client.channels.cache.get('1182165246870310984').send(`${victim.username} got ${xpInsurance} XP from health insurance`)
				levelUpCheck(xpObject,xpIndex,victim,client)
			}else if(successful == 2){
				let xpInsurance = Math.floor(xpAmount*0.75*Math.random())+Math.floor(xpAmount*0.25)
				xpObject[xpIndex].xp += xpInsurance
				inUsers[victimUserIndex].xpEarned+=xpInsurance
				client.channels.cache.get('1182165246870310984').send(`${victim.username} got ${xpInsurance} XP from life insurance`)
				levelUpCheck(xpObject,xpIndex,victim,client)
			}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if(successful == 2){
				let targetmember = guild.members.cache.get(victim.id);
				inUsers[victimUserIndex].banned = 2
				murdered = "v"
				victim.timesMurdered++
				inUsers[perpUserIndex].kills++
				inUsers[victimUserIndex].murderDeaths++
				let jsonMurder = JSON.stringify([inUsers,exemptUsers,victim]) // turns js back into json
				fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
				if(exemptUsers.includes(victim.id)){
					interaction.reply(`Successfully murdered ${victim.username}`)
				}else{
					//targetmember.timeout(600000);
					interaction.reply(`Successfully murdered ${victim.username}`)
				}
			}else if (successful == 1){
				let targetmember = guild.members.cache.get(victim.id);
				inUsers[victimUserIndex].banned = 1
				inUsers[victimUserIndex].timesInjured++
				murdered = "v"
				let jsonMurder = JSON.stringify([inUsers,exemptUsers,victim]) // turns js back into json
				fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
				interaction.reply(`${victim.username} was injured in an attempt on their life.`)
			}else{
				let targetmember = guild.members.cache.get(perpentrator.id);
				inUsers[perpUserIndex].banned = 2
				inUsers[perpUserIndex].failDeaths++
				inUsers[victimUserIndex].selfDefense++
				murdered = "p"
				let jsonMurder = JSON.stringify([inUsers,exemptUsers,victim]) // turns js back into json
				fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
				if(exemptUsers.includes(perpentrator.id)){
					interaction.reply(`${victim.username} caught you trying to murder them and shot you`)
				}else{
					//targetmember.timeout(600000);
					interaction.reply(`${victim.username} caught you trying to murder them and shot you`)
				}
			}
			
			setTimeout(() => {
				usersData = fs.readFileSync("murder.json") // reads the json file
				inUsers = JSON.parse(usersData)[0] // turns json into js
				exemptUsers = JSON.parse(usersData)[1] // turns json into js
				victim = JSON.parse(usersData)[2]
				perpUserIndex = inUsers.findIndex(element => element.id === perpentrator.id)
				victimUserIndex = inUsers.findIndex(element => element.id === victim.id)
				if(murdered == "v"){
					xpIndex = xpObject.findIndex(element => element.id === inUsers[victimUserIndex].id)
					if(inUsers[victimUserIndex].banned == 2){
						client.channels.cache.get('1182165246870310984').send(`${xpObject[xpIndex].username} has recovered from their unfortunate death`)
					} else if(inUsers[victimUserIndex].banned == 1){
						client.channels.cache.get('1182165246870310984').send(`${xpObject[xpIndex].username} has recovered from their injury after a murder attempt`)
					}
					inUsers[victimUserIndex].banned = 0
				}else{
					xpIndex = xpObject.findIndex(element => element.id === inUsers[perpUserIndex].id)
					if(inUsers[perpUserIndex].banned == 2){
						client.channels.cache.get('1182165246870310984').send(`${xpObject[xpIndex].username} has recovered from their unfortunate death`)
					} else if(inUsers[perpUserIndex].banned == 1){
						client.channels.cache.get('1182165246870310984').send(`${xpObject[xpIndex].username} has recovered from their injury after a murder attempt`)
					}
					inUsers[perpUserIndex].banned = 0
				}
				let jsonMurder = JSON.stringify([inUsers,exemptUsers,victim]) // turns js back into json
				fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
			}, 600000);
		}
	},
};