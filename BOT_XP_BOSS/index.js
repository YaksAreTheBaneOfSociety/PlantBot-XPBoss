const { Client, Collection, Events, GatewayIntentBits, Discord } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	],
});

const fs = require("fs")
const path = require("path")

var cron = require('node-cron');

client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


let xpData = fs.readFileSync("xp.json") // reads the json file
let xpObject = JSON.parse(xpData) // turns json into js
let randomWordsListData = fs.readFileSync("wordsList.json") // reads the json file
let randomWordsList = JSON.parse(randomWordsListData) // turns json into js
let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
let randomWord = JSON.parse(randomWordData) // turns json into js
let murderData = fs.readFileSync("murder.json")
let murderObject = JSON.parse(murderData)[0] // turns json into js
let victimObject = JSON.parse(murderData)[2]

const xpMin = 15
const xpMax = 40
const xpMultiplierForNotRobot = 2
let newRandomWord = {}
let oldRandomWord = {}
let newRandomEvilWord = {}
let oldRandomEvilWord = {}
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


var getRandomWord = function(wordList){
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}
function levelUpCheck(xpObject,xpIndex,m){
	let xpNeeded = 75
	let i = 0
	while(xpObject[xpIndex].xp > xpNeeded) {
		i++
		xpNeeded+=75+100*i
	}
	if(i == xpObject[xpIndex].level){
		let addedRolesString = ``
		for (let i = 0; i < rolesLevels.length; i++) {
			if (xpObject[xpIndex].level >= rolesLevels[i].level && !m.member.roles.cache.has(rolesLevels[i].role)){
				m.member.roles.add(rolesLevels[i].role)
				addedRolesString=addedRolesString.concat(`${m.author} has earned the <@&${rolesLevels[i].role}> role\n`)
			}
		}
		if(addedRolesString != ``){
			client.channels.cache.get('1182165246870310984').send(addedRolesString)
		}
	}else{
		xpObject[xpIndex].level=i
		client.channels.cache.get('1182165246870310984').send(`${m.author} has reached level **${xpObject[xpIndex].level}**`)
	}
}
function selectwordoftheday(){
	newRandomWord = getRandomWord(randomWordsList)
	newRandomWord.found = false
	if(randomWord[0] != null){
		oldRandomWord = randomWord[0]
		randomWord[1] = oldRandomWord
	}
	randomWord[0] = newRandomWord
	let streakString = ""
	if(randomWord[1].found == false){
		randomWord[4] = 0
		streakString = " Yesterday's word was not found. Streak reset to 0."
	}else{
		streakString = `Yesterday's word was found. Current random word streak: **${randomWord[4]}** day(s).`
	}
	let jsonRandomWord = JSON.stringify(randomWord)
	fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	if(randomWord[1] != null){
		client.channels.cache.get('1182165246870310984').send(`Yesterday's random word was **${randomWord[1].word}**.${streakString}`)
	}
	client.channels.cache.get('1182165246870310984').send(`Today's random word has been selected! it has been used **${newRandomWord.count}** times (before March 4, 2024)`)

}
function selectevilwordoftheday(){
	newRandomEvilWord = getRandomWord(randomWordsList)
	if(randomWord[2] != null){
		oldRandomEvilWord = randomWord[2]
		randomWord[3] = oldRandomEvilWord
	}
	randomWord[2] = newRandomEvilWord
	let jsonRandomWord = JSON.stringify(randomWord)
	fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	if(randomWord[3] != null){
		client.channels.cache.get('1182165246870310984').send(`Yesterday's illegal word word was **${randomWord[3].word}**`)
	}
	client.channels.cache.get('1182165246870310984').send(`Today's illegal word has been selected! it has been used **${newRandomEvilWord.count}** times (before March 4, 2024)`)

}
function selectvictimoftheday(){
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	let victimId = murderObject[Math.floor(Math.random() * murderObject.length)].id
	let victimUser = client.users.fetch(victimId)
	victimUser.then(function(victim){
		newRandomVictim = {
			id: victim.id,
			username: victim.username,
			timesMurdered: 0
		}
		victimObject=newRandomVictim
		let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
		fs.writeFileSync("murder.json", jsonMurder)
		client.channels.cache.get('1182165246870310984').send(`Today's random victim has been selected! **${newRandomVictim.username}** should watch out for any comedically timed falling pianos in their vicinity.`)
	})
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const { cooldowns } = interaction.client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1_000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}
	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction, xpObject, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	for (let i = 0; i < xpObject.length; i++) {
		xpObject[i].timeout = false;
	}
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	for (let i = 0; i < murderObject.length; i++) {
		murderObject[i].banned = 0;
	}
	let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
	fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
	let jsonXP = JSON.stringify(xpObject) // turns js back into json
	fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
	cron.schedule('0 5 * * *', () => {
		selectwordoftheday()
		selectvictimoftheday()
	},{
		scheduled: true,
		timezone: "US/Central"
	});
	cron.schedule('0 17 * * *', () => {
		selectevilwordoftheday()
	},{
		scheduled: true,
		timezone: "US/Central"
	});
	if(randomWord[0] == null){
		selectwordoftheday()
	}
	if(randomWord[2] == null){
		selectevilwordoftheday()
	}
	if(victimObject == null){
		selectvictimoftheday()
	}
});

client.on("messageCreate", (m) => {
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	let xpIndex = xpObject.findIndex(element => element.id === m.author.id)
	let murderIndex = murderObject.findIndex(element => element.id === m.author.id)
	if(xpIndex == -1){
		let userxp = {
			id: m.author.id,
			username: "test",
			xp: 0,
			level: 0,
			timeout: false
		}
		xpObject.push(userxp)
		xpIndex = xpObject.findIndex(element => element.id === m.author.id)
	}
	try{
		if(xpObject[xpIndex].username != m.member.displayName){
			xpObject[xpIndex].username = m.member.displayName
		}
	}catch{
		xpObject[xpIndex].username = m.author.username
	}
	try{
		let murderBanned = 0
		if(murderIndex != -1){
			try{
				if(murderObject[murderIndex].username != m.member.displayName){
					murderObject[murderIndex].username = m.member.displayName
				}
			}catch{
				murderObject[murderIndex].username = m.author.username
			}
			let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
			fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
			murderBanned = murderObject[murderIndex].banned
		}
		if(murderBanned == 2){
			m.channel.send(`${m.author} is currently timed out`)
			m.delete()
			return
		}
		if(xpObject[xpIndex].timeout == false && murderBanned == 0){
			let xpToAdd = Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin
			xpObject[xpIndex].xp += xpToAdd
			xpObject[xpIndex].timeout=true
			setTimeout(() => {
				xpObject[xpIndex].timeout=false
			}, 60000);
			let jsonXP = JSON.stringify(xpObject) // turns js back into json
			fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
		}	
		levelUpCheck(xpObject,xpIndex,m)
		
		let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
		let randomWord = JSON.parse(randomWordData) // turns json into js

		if(m.toString().toLowerCase().includes(randomWord[0].word.toLowerCase()) && randomWord[0].found == false){
			randomWord[0].found = true
			randomWord[0].foundBy = m.author.username
			randomWord[4]++
			let wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			if(wordUserIndex==-1){
				let userword = {
					id: m.author.id,
					secret: 0,
					illegal: 0
				}
				randomWord[5].push(userword)
				wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			}
			randomWord[5][wordUserIndex].secret++
			let xpToAdd = randomWord[4]*25*(Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin)
			m.reply(`${m.author} found the secret word: **${randomWord[0].word}**`)
			client.channels.cache.get('1182165246870310984').send(`${m.author} found the secret word: **${randomWord[0].word}** and was awarded ${xpToAdd} xp. Current random word streak: **${randomWord[4]}** day(s).`)
			xpObject[xpIndex].xp += xpToAdd
			levelUpCheck(xpObject,xpIndex,m)
			let jsonRandomWord = JSON.stringify(randomWord)
			fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
		}
		if(m.toString().toLowerCase().includes(randomWord[2].word.toLowerCase())){
			let wordUserIndex = randomWord[5].findIndex(element => element.id === targetuser.id)
			if(wordUserIndex==-1){
				let userword = {
					id: m.author.id,
					secret: 0,
					illegal: 0
				}
				randomWord[5].push(userword)
				wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			}
			randomWord[5][wordUserIndex].illegal++
			let xpToRemove = -5*(Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin)
			if(randomWord[4]!=0){
				xpToRemove *= randomWord[4]
			}
			xpObject[xpIndex].xp += xpToRemove
			levelUpCheck(xpObject,xpIndex,m)
			setTimeout(() => {
				client.channels.cache.get('1182165246870310984').send(`${m.author} said the illegal word and was fined ${-xpToRemove} xp`)
				let jsonRandomWord = JSON.stringify(randomWord)
				fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
			}, Math.floor(10000*Math.random()))
		}
	} catch (err){
		console.log('an error occured')
		console.log(err)
		xpIndex = xpObject.findIndex(element => element.id === m.author.id)
		setTimeout(() => {
			xpObject[xpIndex].timeout=false
		}, 60000);
	}
})
// Log in to Discord with your client's token
client.login(token);